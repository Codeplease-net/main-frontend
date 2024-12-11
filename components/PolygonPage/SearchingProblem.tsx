import { useLocale } from "next-intl";
import { setDescriptionProps } from "./InputPart";
import { searchProblem } from "./recenter";
import { Search } from "lucide-react";

type searchingProps = {
  problemId: string;
  setProblemId: (value: string) => void;
} & setDescriptionProps;

export default function SearchingProblem({
  problemId,
  setProblemId,
  setInternationalTitle,
  setDifficulty,
  setTitle,
  setCategory,
  setDescriptionValue,
  setSolutionValue,
  setCodeText,
}: searchingProps) {
  const locale = useLocale();

  return (
    <div className="flex absolute right-4">
        <input
          type="text"
          placeholder="Problem ID"
          className="px-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={problemId}
          onChange={(e) => setProblemId(e.target.value)}
        />
        <button
          onClick={() =>
            searchProblem(
              locale,
              problemId,
              setInternationalTitle,
              setDifficulty,
              setTitle,
              setCategory,
              setDescriptionValue,
              setSolutionValue,
              setCodeText
            )
          }
          className="px-4 py-2 bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Search />
        </button>
    </div>
  );
}
