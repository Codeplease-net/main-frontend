import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  },
  // chtml: { displayAlign: "left" },
  options: {
    enableMenu: false
  }
};

export default function BetterMathJax({ latexContent } : {latexContent: string}) {
  return (
    <MathJaxContext version={3} config={config}>
      <MathJax hideUntilTypeset={"first"}>{latexContent}</MathJax>
    </MathJaxContext>
  );
}
