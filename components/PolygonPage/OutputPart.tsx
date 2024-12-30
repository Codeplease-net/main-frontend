import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import Image from "next/image";
import chillguy from "@/public/chillguy.png";
import { inputTabProps } from "./Polygon";

import { TabsContent } from "@/components/ui/tabs";
import { CardTitle } from "@/components/ui/card";
import DifficultyBox from "@/components/ui/difficulty";
import { RenderMathJaxText } from "@/components/ui/RenderMathJaxText";
import CategoryBadge from "../ui/category";
import { langProps, textLangProps } from "./Polygon";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { parseInlineCommands } from "../ui/MathJaxProcess";

export type descriptionTabProps = {
  title: textLangProps;
  difficulty: number;
  category: string;
  descriptionValue: textLangProps;
};

export type solutionTabProps = {
  solutionValue: textLangProps;
};

export function SolutionsTab({
  solutionValue,
  lang,
}: solutionTabProps & { lang: langProps }) {
  return (
    <div className="min-h-full">
      {solutionValue[lang].length > 0 ? (
        <RenderMathJaxText content={solutionValue[lang]} />
      ) : null}
    </div>
  );
}

function DescriptionTab({
  lang,
  title,
  difficulty,
  category,
  descriptionValue,
}: descriptionTabProps & { lang: langProps }) {
  return (
    <div className="min-h-full">
      <CardTitle className="text-2xl mb-2">{title[lang]}</CardTitle>
      <div className="flex items-center space-x-2 mb-4">
        <DifficultyBox difficulty={difficulty} />
        <CategoryBadge category={category} />
      </div>
      <RenderMathJaxText content={descriptionValue[lang]} />
    </div>
  );
}

export default function OutputPart({
  title,
  difficulty,
  category,
  descriptionValue,
  solutionValue,
  inputTab,
}: descriptionTabProps & solutionTabProps & { inputTab: inputTabProps }) {
  const [selectedTab, setSelectedTab] = useState<string>("description");
  return (
    <Card className="w-full flex flex-col h-[90vh] border-none rounded-none shadow-none bg-muted">
      <CardContent className="p-0 flex-grow overflow-auto">
        {inputTab == "general" ? (
          <div className="flex justify-center items-center w-full h-full bg-background">
            <Image src={chillguy} alt="chillguy" />
          </div>
        ) : (
          <Tabs
            defaultValue="description"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="h-full flex flex-col rounded-e-none"
          >
            <div className="justify-between items-center">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solutions">Solution</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="description"
              className="flex-grow overflow-auto pl-4 pt-2 bg-background"
            >
              <DescriptionTab
                lang={inputTab}
                title={title}
                difficulty={difficulty}
                category={category}
                descriptionValue={descriptionValue}
              />
            </TabsContent>
            <TabsContent
              value="solutions"
              className="flex-grow overflow-auto pl-4 pt-2 bg-background"
            >
              <SolutionsTab lang={inputTab} solutionValue={solutionValue} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
