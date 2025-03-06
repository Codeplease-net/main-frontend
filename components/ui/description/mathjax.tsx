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
  textbf: { fontWeight: "bold" },
  it: { fontStyle: "italic" },
  textit: { fontWeight: "italic" },
  t: { fontStyle: "monospace" },
  tt: { fontFamily: "monospace" },
  texttt: { fontFamily: "monospace" },
  emph: { textDecoration: "underline" },
  underline: { textDecoration: "underline" },
  sout: { textDecoration: "line-through" },
  textsc: { textTransform: "uppercase", fontVariant: "small-caps" },
  tiny: { fontSize: "0.7em" },
  scriptsize: { fontSize: "0.75em" },
  small: { fontSize: "0.85em" },
  normalsize: { fontSize: "1em" },
  large: { fontSize: "1.15em" },
  Large: { fontSize: "1.3em" },
  LARGE: { fontSize: "1.45em" },
  huge: { fontSize: "1.75em" },
  HUGE: { fontSize: "2em" },
  h1: { fontSize: "2em", fontWeight: "bold" },
  h2: { fontSize: "1.7em", fontWeight: "bold" },
  h3: { fontSize: "1.45em", fontWeight: "bold" },
  h4: { fontSize: "1.3em", fontWeight: "bold" },
  h5: { fontSize: "1.15em", fontWeight: "bold" },
  h6: { fontSize: "1em", fontWeight: "bold" },
  tableBorder: {
    border: "1px solid currentColor",
    padding: "0.5rem",
  },
  tableCell: {
    padding: "0.5rem",
    textAlign: "center",
  },
  verticalLine: {
    borderLeft: "1px solid currentColor",
    borderRight: "1px solid currentColor",
  },
  horizontalLine: {
    borderTop: "1px solid currentColor",
    borderBottom: "1px solid currentColor",
  },
};

interface TableCellProps {
  content: React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
  align?: "left" | "center" | "right";
  hasBorder?: boolean;
  style?: React.CSSProperties;
}

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

  // Updated regex to handle nested tags and headings
  const inlineRegex =
    /((?:\$[^$\n]+\$|\$\$[\s\S]*?\$\$))|\\href\{([^}]+)\}\{([^}]+)\}|\\(bf|textbf|it|textit|t|tt|texttt|emph|underline|sout|textsc|tiny|scriptsize|small|normalsize|large|Large|LARGE|huge|HUGE|url)\{([^}]*)\}|^(#{1,6})\s*(.*)$/gm;

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
    } else if (match[2] && match[3]) {
      // Handle href tags with nested content
      const url = match[2];
      const linkText = match[3];
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
    } else if (match[4] && match[5]) {
      // Handle other tags with nested content
      const tag = match[4];
      const content = match[5];
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
            "span",
            {
              key: `${lastIndex}-${tag}`,
              style: style as React.CSSProperties,
            },
            parseInlineCommands(content, true)
          )
        );
      }
    } else if (match[6] && match[7]) {
      // Handle headings
      const level = match[6].length;
      const headingText = match[7];
      const headingTag = `h${level}` as keyof typeof styleMap;
      parts.push(
        <div
          key={`${lastIndex}-heading`}
          style={styleMap[headingTag] as React.CSSProperties}
        >
          {headingText}
        </div>
      );
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

const TableCell: React.FC<TableCellProps> = ({
  content,
  rowSpan,
  colSpan,
  align = "center",
  hasBorder = false,
}) => (
  <td
    rowSpan={rowSpan}
    colSpan={colSpan}
    style={{
      ...(styleMap.tableCell as React.CSSProperties),
      textAlign: align,
      ...(hasBorder ? (styleMap.tableBorder as React.CSSProperties) : {}),
    }}
  >
    {content}
  </td>
);

export const parseLaTeXToReact = (text: string): React.ReactNode => {
  const parseNestedContent = (content: string): React.ReactNode[] => {
    const blockRegex =
      /\\begin{(itemize|enumerate|center|detail|example|cpp|java|python|tabular)}([\s\S]*?)\\end{\1}/g;
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
        case "tabular":
          const tableContent = innerContent.trim();

          // Better alignment parsing
          const alignmentRegex = /\\begin{tabular}\{([^}]+)\}/;
          const alignMatch = match[0].match(alignmentRegex);
          const alignments = alignMatch
            ? alignMatch[1]
                .split("")
                .filter((c) => ["l", "c", "r", "|"].includes(c))
            : [];

          // Split rows handling escaped backslashes
          const rows = tableContent
            .split(/(?<!\\)\\\\/)
            .map((row) => row.trim());

          const processedRows = rows.map((row) => {
            // Handle \hline and \cline
            if (row.match(/^\s*\\hline\s*$/)) {
              return { type: "hline" };
            }

            const clineMatch = row.match(/\\cline\{(\d+)-(\d+)\}/);
            if (clineMatch) {
              return {
                type: "cline",
                start: parseInt(clineMatch[1]),
                end: parseInt(clineMatch[2]),
              };
            }
            // Split cells handling escaped &
            const cells = row.split(/(?<!\\)&/).map((cell) => {
              cell = cell.trim();

              // Handle multirow with better regex
              const multirowMatch = cell.match(
                /\\multirow\{(\d+)\}\{([^}]*)\}\{((?:[^{}]|\{[^}]*\})*)\}/
              );
              if (multirowMatch) {
                return {
                  content: parseInlineCommands(multirowMatch[3]),
                  rowSpan: parseInt(multirowMatch[1]),
                  width: multirowMatch[2],
                };
              }

              // Handle multicolumn with better regex
              const multicolMatch = cell.match(
                /\\multicolumn\{(\d+)\}\{([^}]*)\}\{((?:[^{}]|\{[^}]*\})*)\}/
              );
              if (multicolMatch) {
                return {
                  content: parseInlineCommands(multicolMatch[3]),
                  colSpan: parseInt(multicolMatch[1]),
                  align: multicolMatch[2],
                };
              }
              return {
                content: parseInlineCommands(cell.replace(/\\&/g, "&")),
              };
            });

            return { type: "row", cells };
          });

          // Render table with borders
          results.push(
            <table
              key={`table-${lastIndex}`}
              style={{
                borderCollapse: "collapse",
                margin: "1rem 0",
                width: "auto",
              }}
            >
              <tbody>
                {processedRows.map((row, rowIndex) => {
                  if (row.type === "hline") {
                    return null;
                  }
                  if (row.type === "cline") {
                    return null;
                  }
                  return (
                    <tr
                      key={rowIndex}
                      style={{
                        borderTop:
                          row.type === "row"
                            ? "1px solid currentColor"
                            : "none",
                        borderBottom:
                          row.type === "row"
                            ? "1px solid currentColor"
                            : "none",
                      }}
                    >
                      {row.cells?.map((cell, cellIndex) => {
                        const hasLeftBorder = alignments[cellIndex * 2] === "|";
                        const hasRightBorder =
                          alignments[cellIndex * 2 + 1] === "|";

                        return (
                          <TableCell
                            key={cellIndex}
                            content={cell.content}
                            rowSpan={cell.rowSpan}
                            colSpan={cell.colSpan}
                            align={
                              (cell.align as "left" | "center" | "right") ||
                              (alignments[cellIndex] === "c"
                                ? "center"
                                : alignments[cellIndex] === "l"
                                ? "left"
                                : "right")
                            }
                            style={{
                              borderLeft: hasLeftBorder
                                ? "1px solid currentColor"
                                : "none",
                              borderRight: hasRightBorder
                                ? "1px solid currentColor"
                                : "none",
                            }}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
          break;

        case "example":
          const [input, output] = innerContent
            .split("```")
            .map((part) => part.trim());
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
          const summaryMatch = innerContent.match(/\\summary\s*([^\\]*)/);
          const summaryText = summaryMatch ? summaryMatch[1].trim() : "Details";

          // Get remaining content after summary
          const detailContent = innerContent
            .replace(/\\summary\s*[^\\]*/, "")
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
            .split(/\\item/)
            .slice(1)
            .map((item) => item.trim());
          results.push(
            React.createElement(
              tag === "itemize" ? "ul" : "ol",
              {
                key: `list-${lastIndex}`,
                className:
                  tag === "itemize" ? "list-disc pl-10" : "list-decimal pl-10",
              },
              items.map((item, i) => (
                <li key={i}>{parseNestedContent(item)}</li>
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

const splitAndPreserve = (content: string): string[] => {
  const codeRegex =
    /\\begin{(itemize|enumerate|center|detail|example|cpp|java|python|tabular)}([\s\S]*?)\\end{\1}/g;
  let counter = 0;
  const blocks: { [key: string]: string } = {};
  let placeholders: string[] = [];

  // Replace code blocks with placeholders
  const contentWithPlaceholders = content.replace(codeRegex, (match) => {
    const placeholder = `<!--BLOCK${counter}-->`;
    blocks[placeholder] = match;
    placeholders.push(placeholder);
    counter++;
    return placeholder;
  });

  // Split the text outside code blocks
  let splitParts = contentWithPlaceholders.split("\n\n");

  // Reintegrate the code blocks
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
      <div className="space-y-2">
        {splitAndPreserve(content).map((text, id) => {
          return <div key={id}>{parseLaTeXToReact(text)}</div>;
        })}
      </div>
    </MathJaxContext>
  );
}
