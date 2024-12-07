import React from "react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { RenderMathJaxText } from "../ui/RenderMathJaxText";
import { decryptText } from "@/api/toStoreInFirebase";

interface ProblemDescriptionProps {
  description: string;
}

const formatDescription = (description: string, t: any) => {
  if (!description) {
    return <p>{t("NoDes")}</p>;
  }
  return <RenderMathJaxText content={decryptText(description)}/>
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
