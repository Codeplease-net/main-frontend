import React from "react";
import { Card } from "@/components/ui/card";
import BetterMathJax from "./BetterMathJax";
import { MonacoWrapper } from "./AutoFitEditor";
import { useTranslations } from "next-intl";

interface SolutionDescriptionProps {
  description: string;
  code: string;
}

const renderLatex = (text: string) => {
  if (!text) return null;
  return <BetterMathJax latexContent={text}></BetterMathJax>;
};

const encryptedString = "WEQEWQEDJHSJGbnbxcmnxbcvxcvjkasdkqru7821y4jbnqfbq";

const formatDescription = (description: string, t: any) => {
  if (!description) {
    return <p>{t("NoSol")}</p>;
  }

  return (
    <ul className="list-disc mt-4 h-full">
      {description.split("\\\\").map((paragraph, i) => {
        if (paragraph.startsWith("\\bullet")) {
          return (
            <li key={i} className="ml-8">
              {renderLatex(paragraph.replace("\\bullet", ""))}
            </li>
          );
        } else {
          return <div key={i}>{renderLatex(paragraph)}</div>;
        }
      })}
    </ul>
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
          content={code
            .replaceAll("\\\\n", encryptedString)
            .replaceAll("\\n", "\n")
            .replaceAll(encryptedString, "\\n")
            .replaceAll("\\t", "\t")}
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
