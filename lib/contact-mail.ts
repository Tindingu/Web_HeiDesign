import net from "node:net";
import tls from "node:tls";

type MailPayload = {
  host: string;
  port: number;
  secure: boolean;
  username?: string;
  password?: string;
  from: string;
  to: string;
  subject: string;
  text: string;
};

type Reply = {
  code: number;
  message: string;
};

function base64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

function chunkText(value: string, size = 76) {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += size) {
    chunks.push(value.slice(index, index + size));
  }
  return chunks.join("\r\n");
}

function escapeDotStuffing(value: string) {
  return value.replace(/^\./gm, "..");
}

function encodeSubject(value: string) {
  return `=?UTF-8?B?${base64(value)}?=`;
}

function buildMessage({ from, to, subject, text }: MailPayload) {
  const body = chunkText(base64(escapeDotStuffing(text)));

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    body,
    "",
  ].join("\r\n");
}

class SmtpSession {
  private socket: net.Socket | tls.TLSSocket;
  private buffer = "";
  private activeReply: { code: number; lines: string[] } | null = null;
  private pendingReply: {
    resolve: (reply: Reply) => void;
    reject: (error: Error) => void;
  } | null = null;

  constructor(socket: net.Socket | tls.TLSSocket) {
    this.socket = socket;
    this.socket.setEncoding("utf8");
    this.bindSocket(this.socket);
  }

  private bindSocket(socket: net.Socket | tls.TLSSocket) {
    socket.on("data", (chunk: string) => this.handleData(chunk));
    socket.on("error", (error) => {
      this.pendingReply?.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
      this.pendingReply = null;
    });
    socket.on("close", () => {
      if (this.pendingReply) {
        this.pendingReply.reject(
          new Error("SMTP connection closed unexpectedly"),
        );
        this.pendingReply = null;
      }
    });
  }

  replaceSocket(socket: net.Socket | tls.TLSSocket) {
    this.socket = socket;
    this.socket.setEncoding("utf8");
    this.bindSocket(this.socket);
  }

  private handleData(chunk: string) {
    this.buffer += chunk;

    let newlineIndex = this.buffer.indexOf("\n");
    while (newlineIndex >= 0) {
      const rawLine = this.buffer.slice(0, newlineIndex).replace(/\r$/, "");
      this.buffer = this.buffer.slice(newlineIndex + 1);
      this.handleLine(rawLine);
      newlineIndex = this.buffer.indexOf("\n");
    }
  }

  private handleLine(line: string) {
    const match = line.match(/^(\d{3})([- ])(.*)$/);
    if (!match) return;

    const code = Number(match[1]);
    const separator = match[2];

    if (!this.activeReply || this.activeReply.code !== code) {
      this.activeReply = { code, lines: [line] };
    } else {
      this.activeReply.lines.push(line);
    }

    if (separator === " ") {
      const reply = {
        code,
        message: this.activeReply.lines
          .map((currentLine) => currentLine.slice(4))
          .join("\n"),
      };
      this.activeReply = null;
      this.pendingReply?.resolve(reply);
      this.pendingReply = null;
    }
  }

  private waitForReply() {
    if (this.pendingReply) {
      throw new Error("SMTP session already waiting for a response");
    }

    return new Promise<Reply>((resolve, reject) => {
      this.pendingReply = { resolve, reject };
    });
  }

  private write(command: string) {
    this.socket.write(`${command}\r\n`);
  }

  async expectGreeting() {
    const reply = await this.waitForReply();
    if (reply.code !== 220) {
      throw new Error(
        `Unexpected SMTP greeting: ${reply.code} ${reply.message}`,
      );
    }
  }

  async command(command: string, expectedCodes: number[]) {
    const replyPromise = this.waitForReply();
    this.write(command);
    const reply = await replyPromise;
    if (!expectedCodes.includes(reply.code)) {
      throw new Error(
        `SMTP command failed (${command}): ${reply.code} ${reply.message}`,
      );
    }
    return reply;
  }

  async rawData(message: string) {
    const replyPromise = this.waitForReply();
    this.write(message);
    this.socket.write("\r\n.\r\n");
    const reply = await replyPromise;
    if (reply.code !== 250) {
      throw new Error(`SMTP DATA failed: ${reply.code} ${reply.message}`);
    }
    return reply;
  }

  close() {
    this.socket.end();
  }
}

async function upgradeToTls(
  socket: net.Socket,
  host: string,
): Promise<tls.TLSSocket> {
  return await new Promise((resolve, reject) => {
    const secureSocket = tls.connect({ socket, servername: host }, () => {
      resolve(secureSocket);
    });
    secureSocket.on("error", reject);
  });
}

export async function sendContactLeadMail(payload: {
  host: string;
  port: number;
  secure?: boolean;
  username?: string;
  password?: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  const secure = payload.secure ?? payload.port === 465;
  const socket = secure
    ? tls.connect({
        host: payload.host,
        port: payload.port,
        servername: payload.host,
      })
    : net.connect({ host: payload.host, port: payload.port });

  const session = new SmtpSession(socket);

  await session.expectGreeting();
  await session.command(`EHLO ${payload.host}`, [250]);

  if (!secure) {
    const upgradeReply = await session.command("STARTTLS", [220]);
    if (upgradeReply.code === 220) {
      const tlsSocket = await upgradeToTls(socket as net.Socket, payload.host);
      session.replaceSocket(tlsSocket);
      await session.command(`EHLO ${payload.host}`, [250]);
    }
  }

  if (payload.username && payload.password) {
    await session.command("AUTH LOGIN", [334]);
    await session.command(base64(payload.username), [334]);
    await session.command(base64(payload.password), [235]);
  }

  await session.command(`MAIL FROM:<${payload.from}>`, [250]);
  await session.command(`RCPT TO:<${payload.to}>`, [250, 251]);
  await session.command("DATA", [354]);
  await session.rawData(buildMessage(payload));
  await session.command("QUIT", [221]);
  session.close();
}
