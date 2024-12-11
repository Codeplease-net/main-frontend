import { MonacoWrapper } from "@/components/PlaygroundPage/AutoFitEditor";
import { RenderMathJaxText } from "@/components/ui/RenderMathJaxText";
import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export type solutionTabProps = {
  solutionValue: string;
  codeText: string;
};

export default function SolutionsTab({
  solutionValue,
  codeText,
}: solutionTabProps) {
    const t = useTranslations('Polygon');
  return (
    <TabsContent value="solutions">
      <div
        className="flex-grow overflow-auto pt-1"
        style={{ height: "75vh", flex: 1 }}
      >
        <div className="text-xl font-semibold">
          <div>{t("Solution in words")}</div>
        </div>
        <RenderMathJaxText content={solutionValue} />
        <div className="text-xl font-semibold mt-2">
          <div>{t("Sample Code")}</div>
        </div>
        {codeText.length > 0 ? (
          <MonacoWrapper
            className="mt-2"
            content={codeText}
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
        ) : null}
      </div>
    </TabsContent>
  );
}
