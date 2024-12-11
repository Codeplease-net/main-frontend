import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import DifficultyBox from "@/components/ui/difficulty";
import { RenderMathJaxText } from "@/components/ui/RenderMathJaxText";

export type descriptionTabProps = {
  title: string;
  difficulty: number;
  category: string;
  descriptionValue: string;
};

export default function DescriptionTab({
  title,
  difficulty,
  category,
  descriptionValue,
}: descriptionTabProps) {
  return (
    <TabsContent value="description">
      <div
        className="min-h-full overflow-auto"
        style={{ height: "75vh", flex: 1 }}
      >
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <div className="flex items-center space-x-2 mb-4">
          <DifficultyBox difficulty={difficulty} />
          {category
            .split(",")
            .filter((value) => value.replaceAll(" ", "").length > 0)
            .map((content) => (
              <Badge variant="outline">{content}</Badge>
            ))}
        </div>
        <RenderMathJaxText content={descriptionValue} />
      </div>
    </TabsContent>
  );
}
