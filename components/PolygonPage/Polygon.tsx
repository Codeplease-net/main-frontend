"use client";

import { useState } from "react";
import InputPart from "./InputPart";
import OutputPart from "./OutputPart";
import SearchingProblem from "./SearchingProblem";

export default function PolygonProgram() {
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [solutionValue, setSolutionValue] = useState("");
  const [codeText, setCodeText] = useState("");
  const [problemId, setProblemId] = useState("");
  const [title, setTitle] = useState("");
  const [internationalTitle, setInternationalTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [selectedTab, setSelectedTab] = useState<string>("description");

  return (
    <div>
      <SearchingProblem
        problemId={problemId}
        setProblemId={setProblemId}
        setInternationalTitle={setInternationalTitle}
        setDifficulty={setDifficulty}
        setTitle={setTitle}
        setCategory={setCategory}
        setDescriptionValue={setDescriptionValue}
        setSolutionValue={setSolutionValue}
        setCodeText={setCodeText}
      />
      <div className="flex px-3 mt-5">
        <InputPart
          internationalTitle={internationalTitle}
          difficulty={difficulty}
          title={title}
          category={category}
          descriptionValue={descriptionValue}
          solutionValue={solutionValue}
          codeText={codeText}
          setInternationalTitle={setInternationalTitle}
          setDifficulty={setDifficulty}
          setTitle={setTitle}
          setCategory={setCategory}
          setDescriptionValue={setDescriptionValue}
          setSolutionValue={setSolutionValue}
          setCodeText={setCodeText}
        />
        <OutputPart
          selectedTab={selectedTab}
          title={title}
          difficulty={difficulty}
          category={category}
          descriptionValue={descriptionValue}
          solutionValue={solutionValue}
          codeText={codeText}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </div>
  );
}
