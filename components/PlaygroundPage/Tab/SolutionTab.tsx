import React from "react";
import { useTranslations } from "next-intl";
import { RenderMathJaxText } from "../../ui/description/mathjax";
import { MathJaxContext } from "better-react-mathjax";

interface SolutionDescriptionProps {
  description: string;
}

const formatDescription = (description: string, t: any) => {
  if (!description) {
    return <p>{t("NoSol")}</p>;
  }

  return <RenderMathJaxText content={description} />;
};

export default function SolutionDescription({
  description,
}: SolutionDescriptionProps) {
  const t = useTranslations("Playground");
  return (
    <div className="w-full pb-6">
      <MathJaxContext>
        <div className="space-y-4">{formatDescription(description, t)}</div>
      </MathJaxContext>
    </div>
  );
}
