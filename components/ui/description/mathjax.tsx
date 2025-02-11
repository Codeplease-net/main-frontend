import { MathJaxContext } from "better-react-mathjax";
import { Example } from "./example";
import { MathJax } from "better-react-mathjax";
import React from "react";
import AutoFitEditor from "./fit-editor";

const config = {
  loader: { load: ["[tex]/html", "[tex]/colorv2", "input/asciimath"] },
  tex: {
    packages: {
      "[+]": ["html", "colorv2"],
    },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },

  svg: {
    fontCache: "global",
  },
};

// Mapping LaTeX commands to styles
const styleMap: { [key: string]: React.CSSProperties | string } = {
  bf: { fontWeight: "bold" },
  it: { fontStyle: "italic" },
  tt: { fontFamily: "monospace" },
  emph: { fontStyle: "italic", fontWeight: "bold" },
  underline: { textDecoration: "underline" },
  sout: { textDecoration: "line-through" },
  textsc: { textTransform: "uppercase", fontVariant: "small-caps" },
  tiny: { fontSize: "0.6em" },
  scriptsize: { fontSize: "0.75em" },
  small: { fontSize: "0.875em" },
  normalsize: { fontSize: "1em" },
  large: { fontSize: "1.25em" },
  huge: { fontSize: "2.5em" },
  title: { fontSize: "1.25em", lineHeight: "1.75em", fontWeight: 600 },
};

export const formatDashes = (text: string): string => {
  // Replace '---' with a very long dash (em dash)
  text = text.replace(/---/g, "—");
  // Replace '--' with a long dash (en dash)
  text = text.replace(/--/g, "–");
  return text;
};

export const parseInlineCommands = (
  text: string,
  sub: boolean = false
): React.ReactNode => {
  const formattedText = formatDashes(text);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Updated regex to handle nested tags
  const inlineRegex =
    /((?:\$[^$\n]+\$|\$\$[\s\S]*?\$\$))|<(href)\s+link="([^"]+)">((?:[^<]|<(?!\/href>))*)<\/href>|<(bf|it|tt|emph|underline|sout|textsc|tiny|scriptsize|small|normalsize|large|huge|url|title)>((?:[^<]|<(?!\/\5>))*)<\/\5>/g;

  while ((match = inlineRegex.exec(formattedText)) !== null) {
    // Push text before match
    if (lastIndex < match.index) {
      parts.push(
        <span key={`${lastIndex}-pre`}>
          {formattedText.slice(lastIndex, match.index)}
        </span>
      );
    }

    if (match[1]) {
      // Math expression
      parts.push(<span key={`${lastIndex}-math`}>{match[1]}</span>);
    } else if (match[2] === "href") {
      // Handle href tags with nested content
      const url = match[3];
      const linkText = match[4];
      parts.push(
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          key={`${lastIndex}-href`}
          href={url}
        >
          {parseInlineCommands(linkText, true)}
        </a>
      );
    } else if (match[5]) {
      // Handle other tags with nested content
      const tag = match[5];
      const content = match[6];
      if (tag === "url") {
        parts.push(
          <a
            key={`${lastIndex}-url`}
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {content}
          </a>
        );
      } else if (tag === "title") {
        parts.push(
          <h2
            key={`${lastIndex}-${tag}`}
            className="text-xl font-semibold my-2"
            style={styleMap[tag] as React.CSSProperties}
          >
            {parseInlineCommands(content, true)}
          </h2>
        );
      } else {
        const style = styleMap[tag] || {};
        parts.push(
          React.createElement(
            tag,
            {
              key: `${lastIndex}-${tag}`,
              style: style as React.CSSProperties,
            },
            parseInlineCommands(content, true)
          )
        );
      }
    }

    lastIndex = inlineRegex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < formattedText.length) {
    parts.push(formattedText.slice(lastIndex));
  }

  return sub ? parts : <MathJax>{parts}</MathJax>;
};

interface DetailProps {
  summary: string;
  children: React.ReactNode;
  className?: string;
}

const Detail: React.FC<DetailProps> = ({ summary, children, className }) => {
  return (
    <details
      className={`
        group
        border border-gray-200 
        rounded-lg 
        p-4 my-3
        transition-all
        hover:shadow-sm
        bg-muted/50
        ${className || ""}
      `}
    >
      <summary
        className="
          cursor-pointer 
          font-medium 
          flex items-center 
          justify-between
          select-none
        "
      >
        {summary}
        <svg
          className="w-4 h-4 transform transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
};

export const parseLaTeXToReact = (text: string): React.ReactNode => {
  const parseNestedContent = (content: string): React.ReactNode[] => {
    const blockRegex =
      /<(cpp|java|python|itemize|enumerate|center|detail|example)>([\s\S]*?)<\/\1>/g;
    const results: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = blockRegex.exec(content)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        const beforeText = content.slice(lastIndex, match.index).trim();
        if (beforeText) {
          results.push(
            <div key={`text-${lastIndex}`}>
              {parseInlineCommands(beforeText)}
            </div>
          );
        }
      }

      const [_, tag, innerContent] = match;

      switch (tag) {
        case "example":
          const inputMatch = innerContent.match(/<input>([\s\S]*?)<\/input>/);
          const outputMatch = innerContent.match(/<output>([\s\S]*?)<\/output>/);
          
          const input = inputMatch ? inputMatch[1].trim() : '';
          const output = outputMatch ? outputMatch[1].trim() : '';
        
          results.push(
            <Example
              key={`example-${lastIndex}`}
              className="mt-1 mb-3"
              input={input}
              output={output}
            />
          );
          break;

        case "cpp":
        case "java":
        case "python":
          results.push(
            <div key={`code-${lastIndex}`}>
              <AutoFitEditor language={tag} content={innerContent.trim()} />
            </div>
          );
          break;

        case "detail":
          const summaryMatch = innerContent.match(/<summary>(.*?)<\/summary>/);
          const summaryText = summaryMatch ? summaryMatch[1] : "Details";

          // Get remaining content after summary
          const detailContent = innerContent
            .replace(/<summary>.*?<\/summary>/, "")
            .trim();

          results.push(
            <Detail key={`detail-${lastIndex}`} summary={summaryText}>
              {parseNestedContent(detailContent)}
            </Detail>
          );
          break;

        case "itemize":
        case "enumerate":
          const items = innerContent
            .split(/<item>/)
            .slice(1)
            .map((item) => item.replace(/<\/item>$/, ""));
          results.push(
            React.createElement(
              tag === "itemize" ? "ul" : "ol",
              {
                key: `list-${lastIndex}`,
                className:
                  tag === "itemize" ? "list-disc pl-10" : "list-decimal pl-10",
              },
              items.map((item, i) => (
                <li key={i}>{parseNestedContent(item.trim())}</li>
              ))
            )
          );
          break;

        case "center":
          results.push(
            <div key={`center-${lastIndex}`} className="text-center">
              {parseNestedContent(innerContent.trim())}
            </div>
          );
          break;
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining content
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex).trim();
      if (remainingText) {
        results.push(
          <div key={`final-${lastIndex}`}>
            {parseInlineCommands(remainingText)}
          </div>
        );
      }
    }

    return results;
  };

  return parseNestedContent(text);
};

function extractSections(input: string): string[] {
  const results: string[] = [];

  // Split the input into blocks based on ###
  const blocks = input.split(/#{3,}\n?/);

  // Iterate over each block
  blocks.forEach((block) => {
    // Trim whitespace
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return;

    // Extract the first line and subsequent lines separately
    const firstNewLineIndex = trimmedBlock.indexOf("\n");
    if (firstNewLineIndex === -1) {
      // No newline, so the whole block is a single line (unlikely in your case)
      results.push(trimmedBlock);
    } else {
      // Add the first line to results
      const firstLine = trimmedBlock.substring(0, firstNewLineIndex).trim();
      results.push(firstLine);

      // Handle the code blocks enclosed by ```
      const codeBlockRegex = /```([\s\S]*?)```/g;
      let match;
      while ((match = codeBlockRegex.exec(trimmedBlock))) {
        results.push(match[1].trim());
      }
    }
  });
  return results;
}

const splitAndPreserve = (content: string): string[] => {
  const codeRegex =
    /<(cpp|java|python|itemize|enumerate|center|detail|example)>([\s\S]*?)<\/\1>/g;
  let counter = 0;
  const blocks: { [key: string]: string } = {};
  let placeholders: string[] = [];

  // Replace lstlisting blocks with placeholders
  const contentWithPlaceholders = content.replace(codeRegex, (match) => {
    const placeholder = `<!--BLOCK${counter}-->`;
    blocks[placeholder] = match;
    placeholders.push(placeholder);
    counter++;
    return placeholder;
  });

  // Split the text outside lstlisting blocks
  let splitParts = contentWithPlaceholders.split("\n\n");

  // Reintegrate the lstlisting blocks
  splitParts = splitParts.map((part) => {
    if (placeholders.includes(part)) {
      return blocks[part];
    }
    return part;
  });

  return splitParts;
};

export function RenderMathJaxText({ content }: { content: string }) {
  return (
    <MathJaxContext config={config}>
      {splitAndPreserve(content).map((text, id) => {
        return (
          <div className="my-2" key={id}>
            {parseLaTeXToReact(text)}
          </div>
        );
      })}
    </MathJaxContext>
  );
}
