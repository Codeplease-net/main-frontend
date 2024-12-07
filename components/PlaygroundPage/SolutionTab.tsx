import React from "react";
import { Card } from "@/components/ui/card";
import BetterMathJax from "../ui/BetterMathJax";
import { MonacoWrapper } from "./AutoFitEditor";
import { useTranslations } from "next-intl";
import { decryptText } from "@/api/toStoreInFirebase";
import { RenderMathJaxText } from "../ui/RenderMathJaxText";

interface SolutionDescriptionProps {
  description: string;
  code: string;
}

const renderLatex = (text: string) => {
  if (!text) return null;
  return <BetterMathJax latexContent={text}></BetterMathJax>;
};


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
  code,
}: SolutionDescriptionProps) {
  const t = useTranslations("Playground");
  return (
    <Card className="w-full border-none">
      <div className="space-y-4">
        <div className="text-xl font-semibold">
          <div>{t("Solution in words")}</div>
        </div>
        {formatDescription(description, t)}
        <div className="text-xl font-semibold">
          <div>{t("Sample Code")}</div>
        </div>
        <MonacoWrapper
          className="mt-4"
          content={decryptText(code)}
          options={{
            readOnly: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            roundedSelection: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </Card>
  );
}
