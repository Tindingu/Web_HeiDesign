import GithubSlugger from "github-slugger";

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const lines = source.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const match = /^(#{2,4})\s+(.*)/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].replace(/`/g, "");
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}
