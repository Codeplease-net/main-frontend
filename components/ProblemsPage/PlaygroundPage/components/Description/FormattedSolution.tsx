import { useTranslations } from "next-intl";
import { RenderMathJaxText } from "@/components/ui/description/mathjax";

interface FormattedSolutionProps {
  content: string;
}

const formatDescription = (description: string, t: (key: string) => string) => {
  if (!description) {
    return <p>{t("NoDes")}</p>;
  }
  return <RenderMathJaxText content={description} />;
};

export function FormattedSolution({ content }: FormattedSolutionProps) {
  const t = useTranslations("Playground");
  return <div className="w-full pb-6">{formatDescription(content, t)}</div>;
}

export default FormattedSolution;