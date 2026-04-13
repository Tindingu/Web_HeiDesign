import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import TurndownService from "turndown";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const coverImage = formData.get("coverImage") as string;
    const autoCreate = formData.get("autoCreate") === "true";
    const overwrite = formData.get("overwrite") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".docx")) {
      return NextResponse.json(
        { error: "Invalid file type. Only .docx files are supported" },
        { status: 400 },
      );
    }

    let newPageUrl = "";
    let newSlug = "";

    if (title && slug) {
      newSlug = slug
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert Word to HTML, extracting images with their URLs
    const conversion = await mammoth.convertToHtml(
      { buffer },
      {
        styleMap: [
          // Map Word Caption style to figcaption HTML
          "p[style-name='Caption'] => figcaption:fresh",
        ],
        convertImage: mammoth.images.imgElement(async (image) => {
          // Try to read the image and check if it has an external URL
          // For now, just return the image data URL
          const imageBuffer = await image.read("base64");
          return {
            src: `data:${image.contentType};base64,${imageBuffer}`,
          };
        }),
      },
    );

    // Log the HTML to debug
    console.log("🔍 HTML Output Sample:", conversion.value.substring(0, 500));
    console.log("🔍 Full HTML length:", conversion.value.length);

    // Check if there are figures with captions
    const figureCount = (conversion.value.match(/<figure/gi) || []).length;
    const figcaptionCount = (conversion.value.match(/<figcaption/gi) || [])
      .length;
    console.log(
      "🖼️ Figures found:",
      figureCount,
      "Figcaptions found:",
      figcaptionCount,
    );

    const turndown = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
    });

    // Custom rule to convert figures with captions to markdown images
    turndown.addRule("figure", {
      filter: "figure",
      replacement: (content, node) => {
        console.log("🖼️ Found figure, extracting caption and image...");
        const element = node as HTMLElement;
        const img = element.querySelector("img");
        const figcaption = element.querySelector("figcaption");

        if (img) {
          const src = img.src || img.getAttribute("src") || "";
          const caption = figcaption?.textContent?.trim() || "";
          console.log(
            "🖼️ Figure - caption:",
            caption.substring(0, 50),
            "src:",
            src.substring(0, 50),
          );
          return `![${caption}](${src})\n`;
        }
        return content;
      },
    });

    // Custom rule for standalone figcaption (when figure extraction fails)
    turndown.addRule("figcaption", {
      filter: "figcaption",
      replacement: (content) => {
        console.log("🏷️ Found figcaption:", content.substring(0, 50));
        return `*${content.trim()}*\n`;
      },
    });

    // Custom rule to convert standalone images with alt text (captions from Word)
    turndown.addRule("image", {
      filter: (node) => {
        // Only match img tags that are not inside a figure
        return (
          node.tagName === "IMG" && node.parentElement?.tagName !== "FIGURE"
        );
      },
      replacement: (content, node) => {
        const element = node as HTMLElement;
        const src = element.getAttribute("src") || "";
        const alt = element.getAttribute("alt") || "";
        console.log(
          "🖼️ Found img tag, alt:",
          alt.substring(0, 50),
          "src:",
          src.substring(0, 50),
        );
        return `![${alt}](${src})\n`;
      },
    });

    // Custom rule to convert tables to markdown
    turndown.addRule("table", {
      filter: "table",
      replacement: (content, node) => {
        console.log("📊 Found table, converting...");
        // Get the outer HTML of the table element
        const tableHtml = (node as HTMLElement).outerHTML || content;
        console.log("📊 Table HTML:", tableHtml.substring(0, 300));
        const result = convertHtmlTableToMarkdown(tableHtml);
        console.log("📊 Table converted, result length:", result.length);
        return "\n\n" + result + "\n\n";
      },
    });

    // Remove raw HTML tags
    turndown.addRule("stripHtml", {
      filter: (node) => {
        return node.nodeType === 3 && /<[^>]+>/g.test(node.nodeValue || "");
      },
      replacement: (content) => {
        return content.replace(/<[^>]+>/g, "");
      },
    });

    let markdown = turndown.turndown(conversion.value).trim();

    // Log markdown for debugging
    console.log("✅ Markdown after turndown:");
    console.log("✅ First 1500 chars:", markdown.substring(0, 1500));

    // Extract any Cloudinary URLs from the text and convert to markdown images
    markdown = markdown.replace(
      /(https?:\/\/res\.cloudinary\.com\/[^\s\)]+\.(jpg|jpeg|png|gif|webp|svg))/gi,
      "![]($1)",
    );

    markdown = cleanMarkdown(markdown);

    console.log("✅ Final markdown length:", markdown.length);
    console.log(
      "✅ Markdown sample (first 1500 chars):",
      markdown.substring(0, 1500),
    );

    markdown = cleanMarkdown(markdown);

    console.log("✅ Final markdown length:", markdown.length);
    console.log(
      "✅ Markdown sample (first 1000 chars):",
      markdown.substring(0, 1000),
    );

    // If auto-create is enabled, create the file
    if (autoCreate && title && slug) {
      // Create frontmatter
      const frontmatter = `---
title: "${title}"
slug: "${newSlug}"
description: "${description || "Dịch vụ từ ICEP Design"}"
coverImage: "${coverImage || "https://res.cloudinary.com/dfazfoh2l/image/upload/v1771992147/vila_tld4bi.webp"}"
---

`;

      const fullContent = frontmatter + markdown;

      try {
        // Write file to content/services/
        const servicesDir = path.join(process.cwd(), "content/services");

        // Ensure directory exists
        await fs.mkdir(servicesDir, { recursive: true });

        const filePath = path.join(servicesDir, `${newSlug}.md`);

        // Check if file already exists
        try {
          await fs.access(filePath);
          if (!overwrite) {
            return NextResponse.json(
              { error: `Service page with slug "${newSlug}" already exists` },
              { status: 409 },
            );
          }
        } catch {
          // File doesn't exist, we can create it
        }

        // Write the file
        await fs.writeFile(filePath, fullContent, "utf-8");
        newPageUrl = `/dich-vu/${newSlug}`;
      } catch (writeError) {
        console.error("Error writing service file:", writeError);
        return NextResponse.json(
          {
            error: `Failed to create service page: ${writeError instanceof Error ? writeError.message : "Unknown error"}`,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      markdown,
      fileName: file.name,
      autoCreated: autoCreate && !!newPageUrl,
      newPageUrl,
      newSlug,
      overwritten: overwrite,
    });
  } catch (error) {
    console.error("Error converting Word file:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to convert file",
      },
      { status: 500 },
    );
  }
}

function cleanMarkdown(markdown: string): string {
  let cleaned = markdown
    .replace(/\r\n/g, "\n")
    .replace(/\\([`*_{}\[\]()#+\-.!|>])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/<[^>]+>/g, "") // Strip remaining HTML tags
    .trim();

  // Convert image links to markdown image syntax
  cleaned = cleaned.replace(
    /\[([^\]]*)\]\((https?:\/\/[^\)]+\.(jpg|jpeg|png|gif|webp|svg))\)/gi,
    "![$1]($2)",
  );

  // Convert standalone image URLs to markdown images
  cleaned = cleaned.replace(
    /^(https?:\/\/res\.cloudinary\.com\/[^\s]+\.(jpg|jpeg|png|gif|webp))$/gim,
    "![]($1)",
  );

  // Merge image with figcaption on same line
  // Pattern: ![caption](url)\n\n*Caption text* => ![caption text](url)
  cleaned = cleaned.replace(
    /!\[([^\]]*)\]\(([^\)]+)\)\n\n\*([^*]+)\*/g,
    (match, existingCaption, url, captionText) => {
      // Use captionText if it has content, otherwise keep existing
      const finalCaption = captionText.trim() || existingCaption;
      return `![${finalCaption}](${url})`;
    },
  );

  // Also handle case where caption is on next line without extra newlines
  cleaned = cleaned.replace(
    /!\[([^\]]*)\]\(([^\)]+)\)\n\*([^*]+)\*/g,
    (match, existingCaption, url, captionText) => {
      const finalCaption = captionText.trim() || existingCaption;
      return `![${finalCaption}](${url})`;
    },
  );

  // Remove standalone figcaption lines (they should be merged with image above)
  cleaned = cleaned.replace(/^\*Hình\s+\d+[^\*]*\*$/gm, "");

  return cleaned;
}

function convertHtmlTableToMarkdown(html: string): string {
  console.log("🔧 Converting table, input length:", html.length);

  const rows: string[][] = [];

  // Remove extra whitespace and newlines
  html = html.replace(/\s+/g, " ");

  // Try to find table content
  const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/is);
  if (!tableMatch) {
    console.log("❌ No table match found");
    return "";
  }

  const tableContent = tableMatch[1];
  console.log("🔧 Table content found, length:", tableContent.length);

  // Extract all rows
  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
  const rowMatches = tableContent.matchAll(rowRegex);

  for (const rowMatch of rowMatches) {
    const rowContent = rowMatch[1];
    const cells: string[] = [];

    // Extract all cells (td or th)
    const cellRegex = /<(?:td|th)([^>]*)>(.*?)<\/(?:td|th)>/gis;
    const cellMatches = rowContent.matchAll(cellRegex);

    for (const cellMatch of cellMatches) {
      const attributes = cellMatch[1];
      let cellContent = cellMatch[2];

      // Remove all HTML tags from cell content
      cellContent = cellContent
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Handle colspan
      const colspanMatch = attributes.match(/colspan=["']?(\d+)["']?/i);
      const colspan = colspanMatch ? parseInt(colspanMatch[1]) : 1;

      // Add cell content multiple times for colspan
      for (let i = 0; i < colspan; i++) {
        cells.push(cellContent || " ");
      }
    }

    if (cells.length > 0) {
      rows.push(cells);
      console.log(
        "🔧 Row added with",
        cells.length,
        "cells:",
        cells.slice(0, 3),
      );
    }
  }

  console.log("🔧 Total rows found:", rows.length);

  if (rows.length === 0) return "";

  // Build markdown table
  let markdown = "\n";

  // All rows as data rows (first row is header by default)
  for (let i = 0; i < rows.length; i++) {
    markdown += "| " + rows[i].join(" | ") + " |\n";

    // Add separator after first row
    if (i === 0) {
      markdown += "| " + rows[i].map(() => "---").join(" | ") + " |\n";
    }
  }

  console.log("✅ Markdown table built, length:", markdown.length);
  return markdown + "\n";
}
