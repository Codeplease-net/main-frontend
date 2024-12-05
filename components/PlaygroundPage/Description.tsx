import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "../ui/copy-button";
import BetterMathJax from "./BetterMathJax";
import { useTranslations } from "next-intl";

interface ProblemDescriptionProps {
  description: string;
}

const renderLatex = (text: string) => {
  if (!text) return null;
  return <BetterMathJax latexContent={text}></BetterMathJax>;
};

const formatDescription = (description: string, t: any) => {
  if (!description) {
    return <p>{t("NoDes")}</p>;
  }
  const sections = description.split("\\\\\\\\");
  return sections.map((section, index) => {
    if (section.startsWith(" ")) section = section.slice(1);
    if (section.startsWith(t("Input"))) {
      return (
        <div className="mt-4" key={index}>
          <div className="text-xl font-semibold">
            <div>{t("Input")}:</div>
          </div>
          <ul className="list-disc space-y-2 mt-2">
            {section
              .split("\\\\")
              .slice(1)
              .map((text, i) =>
                text.startsWith("\\bullet") ? (
                  <li className="ml-8" key={i}>
                    {renderLatex(text.replace("\\bullet", ""))}
                  </li>
                ) : (
                  <div key={i}>{renderLatex(text)}</div>
                )
              )}
          </ul>
        </div>
      );
    } else if (section.startsWith(t("Output"))) {
      return (
        <div className="mt-4" key={index}>
          <div className="text-xl font-semibold">
            <div>{t("Output")}:</div>
          </div>
          <ul className="list-disc space-y-2 mt-2">
            {section
              .split("\\\\")
              .slice(1)
              .map((text, i) =>
                text.startsWith("\\bullet") ? (
                  <li className="ml-8" key={i}>
                    {renderLatex(text.replace("\\bullet", ""))}
                  </li>
                ) : (
                  <div key={i}>{renderLatex(text)}</div>
                )
              )}
          </ul>
        </div>
      );
    } else if (section.startsWith(t("Example"))) {
      const [title, ...content] = section.split("\\\\");
      return (
        <div className="space-y-2 mt-4" key={index}>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="grid grid-cols-2 gap-4 p-4 rounded-md">
            {content.map((line, i) => {
              let [label, value] = line.split(t(":"));
              value = value.replaceAll("\\n", "\n");
              if (value.startsWith(" ")) value = value.slice(1);
              return (
                <Card className="bg-secondary/50" key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold">
                      {label}
                    </CardTitle>
                    <CopyButton content={value} />
                  </CardHeader>
                  <div className="w-full bg-secondary/50 h-0.5"></div>
                  <CardContent className="mt-4">
                    <div className="text-sm font-mono whitespace-pre-wrap">
                      {value}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      );
    } else if (section.startsWith(t("Notes"))) {
      return (
        <div className="mt-4" key={index}>
          <div className="text-xl font-semibold">
            <div>{t("Notes")}:</div>
          </div>
          <ul className="list-disc space-y-2 mt-2">
            {section
              .split("\\\\")
              .slice(1)
              .map((note, i) =>
                note.startsWith("\\bullet") ? (
                  <li className="ml-8" key={i}>
                    {renderLatex(note.replace("\\bullet", ""))}
                  </li>
                ) : (
                  <div key={i}>{renderLatex(note)}</div>
                )
              )}
          </ul>
        </div>
      );
    } else {
      return (
        <ul className="list-disc mt-4 h-full" key={index}>
          {section.split("\\\\").map((paragraph, i) =>
            paragraph.startsWith("\\bullet") ? (
              <li className="ml-8" key={i}>
                {renderLatex(paragraph.replace("\\bullet", ""))}
              </li>
            ) : (
              <div key={i}>{renderLatex(paragraph)}</div>
            )
          )}
        </ul>
      );
    }
  });
};

export default function ProblemDescription({
  description,
}: ProblemDescriptionProps) {
  const t = useTranslations("Playground");
  return (
    <Card className="w-full border-none">
      <div className="space-y-4">{formatDescription(description, t)}</div>
    </Card>
  );
}
