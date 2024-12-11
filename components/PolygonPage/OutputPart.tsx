import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import DescriptionTab, { descriptionTabProps } from "./DescriptionTab";
import SolutionsTab, { solutionTabProps } from "./SolutionsTab";

type outputType = {selectedTab: string, setSelectedTab: (value: string) => void } & descriptionTabProps & solutionTabProps;

export default function OutputPart({selectedTab, setSelectedTab, title, difficulty, category, descriptionValue, solutionValue, codeText}: outputType){
    const t = useTranslations('Polygon')
    return <div className="px-2 overflow-auto" style={{ flex: 1 }}>
    <div className="font-bold">Preview: </div>
    <Tabs
      defaultValue="description"
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="rounded-e-none"
    >
      <div className="flex justify-between items-center mt-2">
        <TabsList className=" border-b flex-shrink-0">
          <TabsTrigger value="description">
            {t("Description")}
          </TabsTrigger>
          <TabsTrigger value="solutions">{t("Solutions")}</TabsTrigger>
        </TabsList>
      </div>
      <DescriptionTab
        title={title}
        difficulty={difficulty}
        category={category}
        descriptionValue={descriptionValue}
      />
      <SolutionsTab
        solutionValue={solutionValue}
        codeText={codeText}
      />
    </Tabs>
  </div>
}