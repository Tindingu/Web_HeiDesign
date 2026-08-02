export type MarkdownFaqItem = {
  question: string;
  answer: string;
};

export type MarkdownFaqResult = {
  content: string;
  faqs: MarkdownFaqItem[];
};

const faqBlockPattern = /(?:^|\n):::\s*faq\s*\n([\s\S]*?)\n:::/gi;

function stripMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFaqBlock(block: string): MarkdownFaqItem[] {
  const items: MarkdownFaqItem[] = [];
  let currentQuestion = "";
  let currentAnswer: string[] = [];

  const pushCurrent = () => {
    const question = stripMarkdown(currentQuestion);
    const answer = stripMarkdown(currentAnswer.join("\n"));

    if (question && answer) {
      items.push({ question, answer });
    }

    currentQuestion = "";
    currentAnswer = [];
  };

  for (const rawLine of block.split(/\r?\n/)) {
    const line = rawLine.trim();
    const questionMatch = line.match(/^Q:\s*(.+)$/i);
    const answerMatch = line.match(/^A:\s*(.*)$/i);

    if (questionMatch) {
      pushCurrent();
      currentQuestion = questionMatch[1].trim();
      continue;
    }

    if (answerMatch) {
      currentAnswer.push(answerMatch[1].trim());
      continue;
    }

    if (currentQuestion && line) {
      currentAnswer.push(line);
    }
  }

  pushCurrent();
  return items;
}

export function extractMarkdownFaqs(markdown: string): MarkdownFaqResult {
  const faqs: MarkdownFaqItem[] = [];
  const content = markdown.replace(faqBlockPattern, (_match, block) => {
    faqs.push(...parseFaqBlock(block));
    return "\n";
  });

  return { content, faqs };
}

export function buildFaqJsonLd(faqs: MarkdownFaqItem[]) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
