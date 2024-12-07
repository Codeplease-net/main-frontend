import { splitString } from "../PolygonPage/recenter";
import BetterMathJax from "./BetterMathJax";
import { Example } from "./Example";

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
          return <BetterMathJax latexContent={t} key={id2} />;
        })
      )}
    </div>
  ));
}
