import fs from "fs";
import path from "path";

export interface ServiceMetadata {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
}

export interface Service {
  metadata: ServiceMetadata;
  content: string;
}

const servicesDirectory = path.join(process.cwd(), "content/services");

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const filePath = path.join(servicesDirectory, `${slug}.md`);
    console.log("🔍 Looking for service file:", filePath);
    console.log("📁 Directory exists:", fs.existsSync(servicesDirectory));
    console.log("📄 File exists:", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      console.log("❌ File not found:", filePath);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    console.log("✅ File read successfully, length:", fileContent.length);

    // Parse frontmatter - support both \n and \r\n line endings
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = fileContent.match(frontmatterRegex);

    if (!match) {
      console.log("❌ Frontmatter regex did not match");
      console.log("First 200 chars:", fileContent.substring(0, 200));
      return null;
    }

    const [, frontmatterString, content] = match;
    const metadata = parseFrontmatter(frontmatterString);
    console.log("✅ Metadata parsed:", metadata);

    return {
      metadata: metadata as unknown as ServiceMetadata,
      content: content.trim(),
    };
  } catch (error) {
    console.error(`❌ Error reading service ${slug}:`, error);
    return null;
  }
}

export async function getAllServices(): Promise<ServiceMetadata[]> {
  try {
    const files = fs.readdirSync(servicesDirectory);
    const services: ServiceMetadata[] = [];

    for (const file of files) {
      if (file.endsWith(".md")) {
        const slug = file.replace(".md", "");
        const service = await getServiceBySlug(slug);
        if (service) {
          services.push(service.metadata);
        }
      }
    }

    return services;
  } catch (error) {
    console.error("Error reading services:", error);
    return [];
  }
}

function parseFrontmatter(frontmatterString: string): Record<string, string> {
  const lines = frontmatterString.split("\n");
  const metadata: Record<string, string> = {};

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
      metadata[key.trim()] = value;
    }
  }

  return metadata;
}
