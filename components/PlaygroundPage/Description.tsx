import React from "react";
import { useTranslations } from "next-intl";
import { RenderMathJaxText } from "../ui/RenderMathJaxText";
import { decryptText } from "@/api/toStoreInFirebase";
import { CardTitle } from "../ui/card";
import DifficultyBox from "../ui/difficulty";
import CategoryBadge from "../ui/category";

interface ProblemDescriptionProps {
  description: string;
  title: string;
  difficulty: number;
  category: string;
  acceptance: number;
}

const formatDescription = (description: string, t: any) => {
  if (!description) {
    return <p>{t("NoDes")}</p>;
  }
  return <RenderMathJaxText content={decryptText(description)}/>
};


export default function ProblemDescription({
  description,
  title,
  difficulty,
  category,
  acceptance
}: ProblemDescriptionProps) {
  const t = useTranslations("Playground");
  return (
    <div className="w-full border-none">
      <CardTitle className="text-2xl mb-4">{title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-4">
                      <DifficultyBox difficulty={difficulty} />
                      <CategoryBadge category={category} />
                    </div>
      {formatDescription(description, t)}
    </div>
  );
}
