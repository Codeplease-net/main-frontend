"use client";

import { useEffect, useState } from "react";
import InputPart from "./InputPart";
import OutputPart from "./OutputPart";
import SearchingProblem from "./SearchingProblem";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { DoneModal, WaitingModal } from "./modal";

const reloadTime = 2000;

export type langProps = "en" | "de" | "vi" | "zh-CN";

export type inputTabProps = "general" | langProps;

export type textLangProps = {
  en: string;
  de: string;
  vi: string;
  "zh-CN": string;
};

export const base_null: textLangProps = {
  "en": "",
  "de": "",
  "vi": "",
  "zh-CN": ""
}

export default function PolygonProgram() {
  const [waiting, setWaiting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [problemIdOnFetch, setProblemIdOnFetch] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [displayTitle, setDisplayTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [descriptionValue, setDescriptionValue] = useState<textLangProps>(base_null);
  const [displayDescription, setDisplayDescription] = useState<textLangProps>(base_null);
  const [solutionValue, setSolutionValue] = useState<textLangProps>(base_null);
  const [displaySolution, setDisplaySolution] = useState<textLangProps>(base_null);
  const [title, setTitle] = useState<textLangProps>(base_null);

  const [inputTab, setInputTab] = useState<inputTabProps>("general");

  useEffect(() => {
    const handlers: NodeJS.Timeout[] = []

    const delayedSet = (value: textLangProps, setter: React.Dispatch<React.SetStateAction<textLangProps>>) => {
      const handler = setTimeout(() => {
        setter(value)
      }, reloadTime);
      handlers.push(handler);
      return handler;
    }

    delayedSet(descriptionValue, setDisplayDescription)
    delayedSet(solutionValue, setDisplaySolution);

    return () => {
      handlers.forEach(clearTimeout);
    };
  }, [descriptionValue, solutionValue])

  return (
    <div>
      <WaitingModal isOpen={waiting} />
      <DoneModal isOpen={done} />
      <SearchingProblem
        setDisplayTitle={setDisplayTitle}
        setDifficulty={setDifficulty}
        setCategory={setCategory}
        setTitle={setTitle}
        setDescriptionValue={setDescriptionValue}
        setSolutionValue={setSolutionValue}
        setWaiting={setWaiting}
        setDone={setDone}
        setProblemIdOnFetch={setProblemIdOnFetch}
        setInputTab={setInputTab}
      />
      <div className="h-[90vh]">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full"
        >
          <ResizablePanel defaultSize={50}>
            <InputPart
              inputTab={inputTab}
              setInputTab={setInputTab}
              displayTitle={displayTitle}
              difficulty={difficulty}
              title={title}
              category={category}
              descriptionValue={descriptionValue}
              solutionValue={solutionValue}
              problemIdOnFetch={problemIdOnFetch}
              setDisplayTitle={setDisplayTitle}
              setDifficulty={setDifficulty}
              setTitle={setTitle}
              setCategory={setCategory}
              setDescriptionValue={setDescriptionValue}
              setSolutionValue={setSolutionValue}
              setProblemIdOnFetch={setProblemIdOnFetch}
              setWaiting={setWaiting}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <OutputPart
              inputTab={inputTab}
              title={title}
              difficulty={difficulty}
              category={category}
              descriptionValue={displayDescription}
              solutionValue={displaySolution}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
