import { MathJaxContext } from "better-react-mathjax";
import { Example } from "./Example";
import { parseLaTeXToReact } from "./MathJaxProcess";

function extractSections(input: string): string[] {
  const results: string[] = [];

  // Split the input into blocks based on ###
  const blocks = input.split(/#{3,}\n?/);

  // Iterate over each block
  blocks.forEach(block => {
      // Trim whitespace
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return;

      // Extract the first line and subsequent lines separately
      const firstNewLineIndex = trimmedBlock.indexOf('\n');
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
  console.log(results)
  return results;
  
}


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
    fontCache: "global", // Optional: caching for better performance
  },
};

const splitAndPreserve = (content: string): string[] => {
  const codeRegex = /\\begin\{(cpp|python|java|itemize|center|enumerate)\}[\s\S]*?\\end\{(cpp|python|java|itemize|center|enumerate)\}/g;
  let counter = 0;
  const blocks: { [key: string]: string } = {};
  let placeholders: string[] = [];
  
  // Replace lstlisting blocks with placeholders
  const contentWithPlaceholders = content.replace(codeRegex, match => {
    const placeholder = `<!--BLOCK${counter}-->`;
    blocks[placeholder] = match;
    placeholders.push(placeholder);
    counter++;
    return placeholder;
  });

  // Split the text outside lstlisting blocks
  let splitParts = contentWithPlaceholders.split("\n\n");

  // Reintegrate the lstlisting blocks
  splitParts = splitParts.map(part => {
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
          {text.startsWith("###") ? (
            <Example
              className="mt-1 mb-3"
              splitText={extractSections(text.substring(3, text.length))}
            />
          ) : text.startsWith("##") ? (
            <h3 className="text-xl font-semibold">{text.slice(3)}</h3>
          ) : (
            parseLaTeXToReact(text)
          )}
        </div>
      )})}
    </MathJaxContext>
  );
}
