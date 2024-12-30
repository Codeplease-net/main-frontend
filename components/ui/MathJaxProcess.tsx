import { MathJax } from "better-react-mathjax";
import React from "react";
import { MonacoWrapper } from "./AutoFitEditor";

// Mapping LaTeX commands to styles
const styleMap: { [key: string]: React.CSSProperties | string } = {
  "bf": { fontWeight: "bold" },
  "textbf": { fontWeight: "bold" },
  "it": { fontStyle: "italic" },
  "textit": { fontStyle: "italic" },
  "t": { fontFamily: "monospace" },
  "tt": { fontFamily: "monospace" },
  "texttt": { fontFamily: "monospace" },
  "emph": { fontStyle: "italic", fontWeight: "bold" },
  "underline": { textDecoration: "underline" },
  "sout": { textDecoration: "line-through" },
  "textsc": { textTransform: "uppercase", fontVariant: "small-caps" },
  "tiny": { fontSize: "0.6em" },
  "scriptsize": { fontSize: "0.75em" },
  "small": { fontSize: "0.875em" },
  "normalsize": { fontSize: "1em" },
  "large": { fontSize: "1.25em" },
  "Large": { fontSize: "1.5em" },
  "LARGE": { fontSize: "2em" },
  "huge": { fontSize: "2.5em" },
  "Huge": { fontSize: "3em" },
};

export const formatDashes = (text: string): string => {
  // Replace '---' with a very long dash (em dash)
  text = text.replace(/---/g, '—');
  // Replace '--' with a long dash (en dash)
  text = text.replace(/--/g, '–');
  return text;
};

export const parseInlineCommands = (text: string, sub: boolean = false): React.ReactNode => {
  const formattedText = formatDashes(text);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Regex to skip over $...$ and $$...$$ while matching LaTeX commands and links
  const inlineRegex = /(\$[^$]*\$|\$\$[^$]*\$\$)|\\(bf|textbf|it|textit|t|tt|texttt|emph|underline|sout|textsc|tiny|scriptsize|small|normalsize|large|Large|LARGE|huge|Huge|href|url)\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}(?:\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\})?/g;

  while ((match = inlineRegex.exec(formattedText)) !== null) {
    if (match[1]) {
      // If match[1] is not undefined, it's a math expression, so we push it directly to parts
      parts.push(formattedText.slice(lastIndex, inlineRegex.lastIndex));
    } else {
      const [fullMatch, , command, content, linkText] = match;

      // Push text before the match
      if (lastIndex < match.index) {
        parts.push(formattedText.slice(lastIndex, match.index));
      }

      // Determine action based on the command
      let element: React.ReactNode;
      if (command === "href" && linkText !== undefined) {
        // Handling \href{URL}{text}
        element = <a target="_blank" className="hover:bg-muted" href={content} style={{ textDecoration: "underline" }}>{parseInlineCommands(linkText, true)}</a>;
      } else if (command === "url") {
        // Handling \url{URL}
        element = <a target="_blank" className="hover:bg-muted" href={content} style={{ textDecoration: "underline" }}>{content}</a>;
      } else {
        // Process other LaTeX commands recursively
        const style = styleMap[command] || {};
        const parsedContent = parseInlineCommands(content, true); // Recursively parse nested commands
        element = <span style={style as React.CSSProperties}>{parsedContent}</span>;
      }

      parts.push(element);
    }

    // Update last index to the end of the current match
    lastIndex = inlineRegex.lastIndex;
  }

  // Push any remaining text
  if (lastIndex < formattedText.length) parts.push(formattedText.slice(lastIndex));

  if (!sub) return <MathJax>{parts}</MathJax>;
  return parts;
};

// Function to handle parsing and rendering LaTeX tabular environments
const parseTabular = (content: string): React.ReactNode => {
  // Splitting rows on newline
  const rows = content.trim().split("\\\\").map(row => row.trim());

  return (
    <table className="border-collapse table-auto w-full text-sm">
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.split("&").map((cell, index) => (
              <td key={index} className="border px-2 py-1">
                {parseInlineCommands(cell.trim())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Main parsing function for both blocks and inline commands
export const parseLaTeXToReact = (text: string): React.ReactNode => {
  // Extend regex to handle lstlisting along with other block-level environments
  const blockRegex = /\\begin\{(itemize|center|enumerate|cpp|java|python)\}([\s\S]*?)\\end\{\1\}/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(text)) !== null) {
    const [fullMatch, environment, content] = match;

    // Add text before the match
    if (lastIndex < match.index) {
      parts.push(parseInlineCommands(text.slice(lastIndex, match.index)));
    }
    // Handle specific environments
    if (environment === "tabular"){
      parts.push(parseTabular(content));
    } else if (environment === "cpp") {
      parts.push(
        <MonacoWrapper 
          language="cpp"
          content={content.substring(1, content.length-1)}
        />
      );
    } else if (environment === "python") {
      parts.push(
        <MonacoWrapper 
          language="python"
          content={content.substring(1, content.length-1)}
        />
      );
    }  else if (environment === "java") {
      parts.push(
        <MonacoWrapper 
          language="java"
          content={content.substring(1, content.length-1)}
        />
      );
    } else if (environment === "itemize") {
      parts.push(
        <ul className="list-disc pl-10">
          {content.split(/\\item/).slice(1).map((line, index) => (
            <li key={index}>{parseInlineCommands(line.trim())}</li>
          ))}
        </ul>
      );
    } else if (environment === "enumerate") {
      parts.push(
        <ol className="list-decimal pl-10">
          {content.split(/\\item/).slice(1).map((line, index) => (
            <li key={index}>{parseInlineCommands(line.trim())}</li>
          ))}
        </ol>
      );
    } else if (environment === "center") {
      parts.push(<div className="text-center">{parseInlineCommands(content.trim())}</div>);
    }

    // Update the last index
    lastIndex = blockRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(parseInlineCommands(text.slice(lastIndex)));
  }

  return parts;
};
