import React from "react";
import { useTranslations } from "next-intl";
import { RenderMathJaxText } from "../../ui/description/mathjax";
import { CardTitle } from "../../ui/card";
import DifficultyBox from "../../ui/difficulty";
import CategoryBadge from "../../ui/category";

interface ProblemDescriptionProps {
  description: string;
  title: string;
  difficulty: number;
  category: string;
}

const formatDescription = (description: string, t: (key: string) => string) => {
  if (!description) {
    return <p>{t("NoDes")}</p>;
  }
  return <RenderMathJaxText content={description} />;
};

export default function ProblemDescription({
  description,
  title,
  difficulty,
  category,
}: ProblemDescriptionProps) {
  const t = useTranslations("Playground");

  return (
    <div className="w-full pb-2">
      <CardTitle className="text-2xl mb-4">{title}</CardTitle>
      <div className="flex items-center space-x-2 mb-4">
        <DifficultyBox difficulty={difficulty} />
        <CategoryBadge category={category} />
      </div>
      {formatDescription(description, t)}
    </div>
  );
}
