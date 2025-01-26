import { descriptionTabProps, solutionTabProps } from "./OutputPart";
import DifficultySwitcher from "./DifficultySwitcher";
import { createNewProblem, updateDescription, updateGeneral } from "./recenter";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsTrigger, Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import {
  AutoResizingTextarea,
  AutoResizingTextarea2,
} from "./AutoResizingTextarea";
import { inputTabProps, langProps, textLangProps } from "./Polygon";
import { routing } from "@/i18n/routing";

export type inputParamProps = {
  setWaiting: (value: boolean) => void;
  problemIdOnFetch: string | null;
  setProblemIdOnFetch: (value: string | null) => void;
};

type descriptionProps = descriptionTabProps & solutionTabProps;

export type generalProps = {
  displayTitle: string;
  difficulty: number;
  category: string;
};

export type setGeneralProps = {
  setDisplayTitle: (value: string) => void;
  setDifficulty: (value: number) => void;
  setCategory: (value: string) => void;
};

export type setDescriptionProps = {
  setTitle: (value: textLangProps) => void;
  setDescriptionValue: (value: textLangProps) => void;
  setSolutionValue: (value: textLangProps) => void;
};

type inputProps = descriptionProps &
  setDescriptionProps &
  generalProps &
  setGeneralProps &
  inputParamProps;

function GeneralTab({
  displayTitle,
  setDisplayTitle,
  difficulty,
  setDifficulty,
  category,
  setCategory,
  setWaiting,
  problemIdOnFetch,
  setProblemIdOnFetch,
}: generalProps & setGeneralProps & inputParamProps) {
  const [problemId, setProblemId] = useState<string>("");

  const createProblemButton = async () => {
    const isConfirmed = window.confirm("Do you confirm create a new problem?");
    if (isConfirmed) {
      setWaiting(true);
      const ret = await createNewProblem({
        problemId,
        displayTitle,
        category,
        difficulty,
      });
      if (ret) {
        alert("Creating a new problem SUCCESSFULLY !");
        setProblemIdOnFetch(problemId);
      } else {
        alert("Creating a new problem FAILED !");
      }
      setWaiting(false);
    }
  };

  const updateProblemButton = async () => {
    if (problemIdOnFetch == null) return;
    const isConfirmed = window.confirm(
      `Do you confirm updating problem #${problemIdOnFetch}?`
    );
    if (isConfirmed) {
      setWaiting(true);
      const updatingState = await updateGeneral({
        problemId: problemIdOnFetch,
        displayTitle,
        category,
        difficulty,
      });
      if (updatingState) {
        alert(`Update problem #${problemIdOnFetch} successfully !`);
        setProblemIdOnFetch(problemIdOnFetch);
      } else {
        alert(`Error while updating problem #${problemIdOnFetch} !`);
      }
      setWaiting(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex-1 mr-4">
          <div className="font-bold">Problem Id</div>
          {problemIdOnFetch != null ? (
            <div className="bg-muted/50 font-mono text-foreground w-full p-1 text-sm border border-foreground rounded-sm">
              {problemIdOnFetch}
            </div>
          ) : (
            <input
              placeholder="Enter problem id here..."
              className="bg-muted/50 font-mono text-foreground w-full p-1 text-sm border border-foreground rounded-sm"
              value={problemId}
              onChange={(e) => setProblemId(e.target.value)}
            />
          )}
        </div>
        <div>
          <div className="font-bold">Difficulty</div>
          <DifficultySwitcher value={difficulty} setValue={setDifficulty} />
        </div>
      </div>
      <div className="mt-4">
        <div className="font-bold">Display Title</div>
        <input
          placeholder="Enter display title here..."
          className="bg-muted/50 font-mono text-foreground w-full p-1 text-sm border border-foreground rounded-sm"
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="font-bold">Category</div>
        <AutoResizingTextarea
          placeholder="Enter category here..."
          value={category}
          setValue={setCategory}
          minLine={3}
        />
      </div>
      <div className="w-full flex justify-center my-4 space-x-4">
        {problemIdOnFetch == null ? (
          <button
            onClick={createProblemButton}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-800"
          >
            Create New Problem
          </button>
        ) : (
          <>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700">
              Delete Problem
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
              onClick={updateProblemButton}
            >
              Update Problem
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DescriptionTab({
  lang,
  title,
  setTitle,
  descriptionValue,
  setDescriptionValue,
  solutionValue,
  setSolutionValue,
  problemIdOnFetch,
  setWaiting,
  setProblemIdOnFetch,
}: { lang: langProps } & descriptionProps &
  setDescriptionProps &
  inputParamProps) {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: textLangProps,
    setter: (value: textLangProps) => void
  ) => {
    let newValues: textLangProps = {
      ...value,
      [lang]: event.target.value,
    };
    setter(newValues);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(event, title, setTitle);
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => handleInputChange(event, descriptionValue, setDescriptionValue);
  const handleSolutionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => handleInputChange(event, solutionValue, setSolutionValue);

  return (
    <div className="overflow-auto bg-background h-full">
      <div className="mt-2">
        <div className="font-bold">Title</div>
        <input
          placeholder="Enter the title here..."
          className="bg-muted/50 font-mono text-foreground w-full p-1 text-sm border border-foreground rounded-sm"
          value={title[lang]}
          onChange={handleTitleChange}
        />
      </div>
      <div className="mt-2">
        <div className="font-bold">Description</div>
        <AutoResizingTextarea2
          placeholder={"Enter the description here..."}
          value={descriptionValue[lang]}
          setValue={handleDescriptionChange}
          minLine={8}
        />
      </div>
      <div className="mt-2">
        <div className="font-bold px-[1px]">Solution</div>
        <AutoResizingTextarea2
          placeholder={"Enter the solution here..."}
          value={solutionValue[lang]}
          setValue={handleSolutionChange}
          minLine={6}
        />
      </div>
      <div className="w-full flex justify-center my-2 space-x-4">
        <button
          onClick={async () => {
            const isConfirmed = window.confirm(
              `Do you confirm updating problem "${problemIdOnFetch}?"`
            );
            // console.log(problemIdOnFetch)
            if (isConfirmed && problemIdOnFetch != null) {
              setWaiting(true);
              const updatingState = await updateDescription({
                lang,
                problemId: problemIdOnFetch,
                title,
                description: descriptionValue,
                solution: solutionValue,
              });
              if (updatingState) {
                alert(`Update problem "${problemIdOnFetch}" successfully !`);
                setProblemIdOnFetch(problemIdOnFetch);
              } else {
                alert(`Error while updating problem "${problemIdOnFetch}" !`);
              }
              setWaiting(false);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
        >
          Update Problem
        </button>
      </div>
    </div>
  );
}

export default function InputPart({
  displayTitle,
  setDisplayTitle,
  difficulty,
  setDifficulty,
  title,
  setTitle,
  category,
  setCategory,
  descriptionValue,
  setDescriptionValue,
  solutionValue,
  setSolutionValue,
  problemIdOnFetch,
  setWaiting,
  setProblemIdOnFetch,
  inputTab,
  setInputTab,
}: inputProps & {
  inputTab: inputTabProps;
  setInputTab: (value: inputTabProps) => void;
}) {
  function isInputTabProps(value: any): value is inputTabProps {
    return ["general", "en", "de", "vi", "zh-CN"].includes(value);
  }

  const handleTabChange = (value: string) => {
    if (isInputTabProps(value)) {
      setInputTab(value);
    } else {
      console.error("Invalid tab value", value);
    }
  };

  return (
    <Card className="w-full flex flex-col h-[calc(100vh-5rem)] border-none rounded-none shadow-none bg-muted">
      <CardContent className="p-0 flex-grow overflow-auto">
        <Tabs
          value={inputTab}
          onValueChange={handleTabChange}
          className="h-full flex flex-col rounded-e-none"
        >
          <div className="justify-between items-center">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              {problemIdOnFetch != null ? (
                <>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="de">German</TabsTrigger>
                  <TabsTrigger value="zh-CN">Chinese</TabsTrigger>
                  <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                </>
              ) : null}
            </TabsList>
          </div>
          <TabsContent
            value="general"
            className="flex-grow overflow-auto px-4 pt-2 bg-background"
          >
            <GeneralTab
              setProblemIdOnFetch={setProblemIdOnFetch}
              displayTitle={displayTitle}
              difficulty={difficulty}
              category={category}
              setCategory={setCategory}
              setDisplayTitle={setDisplayTitle}
              setDifficulty={setDifficulty}
              problemIdOnFetch={problemIdOnFetch}
              setWaiting={setWaiting}
            />
          </TabsContent>
          {routing.locales.map(lang => 
            <TabsContent
            value={lang}
            className="flex-grow overflow-auto px-4 pt-2 bg-background"
          >
            <DescriptionTab
              lang={lang}
              difficulty={difficulty}
              title={title}
              category={category}
              descriptionValue={descriptionValue}
              solutionValue={solutionValue}
              problemIdOnFetch={problemIdOnFetch}
              setTitle={setTitle}
              setDescriptionValue={setDescriptionValue}
              setSolutionValue={setSolutionValue}
              setProblemIdOnFetch={setProblemIdOnFetch}
              setWaiting={setWaiting}
            />
          </TabsContent>
          )}
          
        </Tabs>
      </CardContent>
    </Card>
  );
}
