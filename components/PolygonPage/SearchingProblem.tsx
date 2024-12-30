import { useLocale } from "next-intl";
import { setDescriptionProps, setGeneralProps } from "./InputPart";
import { searchProblem } from "./recenter";
import { Search } from "lucide-react";
import { useState } from "react";
import { base_null, inputTabProps } from "./Polygon";

type searchingProps = {
  setWaiting: (value: boolean) => void;
  setDone: (value: boolean) => void;
  setProblemIdOnFetch: (value: string | null) => void;
  setInputTab: (value: inputTabProps) => void
} & setDescriptionProps &
  setGeneralProps;

export default function SearchingProblem({
  setDisplayTitle,
  setDifficulty,
  setTitle,
  setCategory,
  setDescriptionValue,
  setSolutionValue,
  setWaiting,
  setDone,
  setProblemIdOnFetch,
  setInputTab
}: searchingProps) {
  const [problemId, setProblemId] = useState<string>("");

  const doTheSearch = async () => {
    if (problemId == "new") {
      setDone(true);
      setProblemIdOnFetch(null);
      setDisplayTitle("");
        setCategory("");
        setDifficulty(0);
        setTitle(base_null);
        setDescriptionValue(base_null);
        setSolutionValue(base_null);
      setTimeout(() => setDone(false), 2000);
    } else {
      setWaiting(true);
      const dataSearch = await searchProblem(problemId);
      if (dataSearch) {
        setProblemIdOnFetch(problemId);
        setDisplayTitle(dataSearch.displayTitle);
        setCategory(dataSearch.category);
        setDifficulty(dataSearch.difficulty);
        setTitle(dataSearch.title);
        setDescriptionValue(dataSearch.description);
        setSolutionValue(dataSearch.solution);
      } else {
        alert(`Problem "${problemId}" doesn't exist !`);
        setDisplayTitle("");
        setCategory("");
        setDifficulty(0);
        setTitle(base_null);
        setDescriptionValue(base_null);
        setSolutionValue(base_null);
        setProblemIdOnFetch(null);
      }
      setWaiting(false);
    }
    setInputTab("general")
  };

  return (
    <div className="flex absolute right-4 bottom-4">
      <input
        type="text"
        placeholder="Problem ID"
        className="px-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        value={problemId}
        onKeyDown={(e) => {
          e.key == "Enter" ? doTheSearch() : null;
        }}
        onChange={(e) => setProblemId(e.target.value)}
      />
      <button
        onClick={doTheSearch}
        className="px-4 py-2 bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Search color="white" />
      </button>
    </div>
  );
}