import { descriptionTabProps } from "./DescriptionTab";
import GoodSwitcher from "./GoodSwitcher";
import { insertProblem } from "./recenter";
import { solutionTabProps } from "./SolutionsTab";

export type paramDescriptionProps = {
  internationalTitle: string;
} & descriptionTabProps &
  solutionTabProps;

export type setDescriptionProps = {
  setInternationalTitle: (value: string) => void;
  setDifficulty: (value: number) => void;
  setTitle: (value: string) => void;
  setCategory: (value: string) => void;
  setDescriptionValue: (value: string) => void;
  setSolutionValue: (value: string) => void;
  setCodeText: (value: string) => void;
};

type descriptionProps = paramDescriptionProps & setDescriptionProps;

export default function InputPart({
  internationalTitle,
  setInternationalTitle,
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
  codeText,
  setCodeText,
}: descriptionProps) {
  return (
    <div className="overflow-auto px-2" style={{ height: "85vh", flex: 1 }}>
      <div className="flex">
        <div className="flex-1 pr-1">
          <div className="font-bold">International Title: </div>
          <input
            className="text-black w-full p-1 mt-1 text-xs"
            value={internationalTitle}
            onChange={(e) => setInternationalTitle(e.target.value)}
          />
        </div>
        <div>
          <div className="font-bold ml-2">Difficuly: </div>
          <GoodSwitcher
            className="mt-1"
            defaultValue={difficulty}
            label={"label"}
            setDefaultValue={setDifficulty}
          />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 pr-1">
          <div className="font-bold">English Title: </div>
          <input
            className="text-black w-full p-1 mt-1 text-xs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex-1 pl-1">
          <div className="font-bold">Category: </div>
          <input
            className="text-black w-full p-1 mt-1 text-xs"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>
      <div className="font-bold">English Description: </div>
      <textarea
        className="text-black w-full p-1 mt-1 text-xs"
        style={{ height: "12rem" }}
        value={descriptionValue}
        onChange={(e) => setDescriptionValue(e.target.value)}
      />
      <div className="font-bold">Solution: </div>
      <textarea
        className="text-black w-full p-1 mt-1 text-xs"
        style={{ height: "10rem" }}
        value={solutionValue}
        onChange={(e) => setSolutionValue(e.target.value)}
      />
      <div className="font-bold">Code: </div>
      <textarea
        className="text-black w-full p-1 mt-1 text-xs"
        style={{ height: "8rem" }}
        value={codeText}
        onChange={(e) => setCodeText(e.target.value)}
      />
      <div className="w-full flex justify-center mt-2 space-x-4">
        <button
          onClick={() => insertProblem("")}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none"
        >
          Insert the problem
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none">
          Delete Problem
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none">
          Update Problem
        </button>
      </div>
    </div>
  );
}
