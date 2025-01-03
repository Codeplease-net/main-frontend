import React from "react";
import { useTranslations } from "next-intl";
import { decryptText } from "@/api/toStoreInFirebase";
import { RenderMathJaxText } from "../ui/RenderMathJaxText";
import { MathJaxContext } from "better-react-mathjax";

interface SolutionDescriptionProps {
  description: string;
}

const formatDescription = (description: string, t: any) => {
  if (!description) {
    return <p>{t("NoSol")}</p>;
  }

  return (
    <RenderMathJaxText content={decryptText(description)}/>
  );
};

export default function SolutionDescription({
  description,
}: SolutionDescriptionProps) {
  const t = useTranslations("Playground");
  return (
    <div className="w-full">
      <MathJaxContext>
      <div className="space-y-4">
        
        {formatDescription(description, t)}
      </div>
      </MathJaxContext>
    </div>
  );
}
