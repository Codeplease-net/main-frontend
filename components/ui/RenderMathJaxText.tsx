import { splitString } from "../PolygonPage/recenter";
import BetterMathJax from "./BetterMathJax";
import { Example } from "./Example";

function transformText(input: string): string {
  // Replace any occurrence of \t with 1t
  input = input.replace(/\\t/, '\\1t');
  
  // Then perform the transformation for the rest of the cases
  return input.replace(/\$\\(\d+)t\$(.*)/, (_, number, remainingText) => {
      const marginLeft = 32 * parseInt(number, 10);  // Calculate margin-left
      return `$\\style{margin-left: ${marginLeft}px}{}$ ${remainingText.trim()}`;
  });
}

export function RenderMathJaxText({ content }: { content: string }) {
  return content.split("\n\n").map((text, id) => (
    <div className="mt-2" key={id}>
      {text.startsWith("$\\nwex$") ? (
        <Example splitText={splitString(text.substring(8, text.length))} />
      ) : (
        text.split("\n").map((t, id2) => {
          if (t.startsWith("$\\ttl$"))
            return (
              <div className="text-xl font-semibold" key={id2}>
                <BetterMathJax latexContent={t.substring(6, t.length)} />
              </div>
            );
          return <BetterMathJax latexContent={transformText(t)} key={id2} />;
        })
      )}
    </div>
  ));
}
