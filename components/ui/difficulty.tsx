import { useTranslations } from "next-intl";
import { Badge } from "./badge";

export type DifficultyTypes =
  | "Beginner"
  | "Easy"
  | "Intermediate"
  | "Challenging"
  | "Hard"
  | "Very Hard"
  | "Expert";

const colors: Record<DifficultyTypes, string> = {
  "Beginner": "bg-teal-100 text-teal-800",
  "Easy": "bg-lime-100 text-lime-800",
  "Intermediate": "bg-sky-100 text-sky-800",
  "Challenging": "bg-amber-100 text-amber-800", 
  "Hard": "bg-rose-100 text-rose-800",
  "Very Hard": "bg-fuchsia-200 text-fuchsia-900", 
  "Expert": "bg-gray-800 text-gray-100",
};

export const difficulties: DifficultyTypes[] = ["Beginner", "Easy", "Intermediate", "Challenging", "Hard", "Very Hard", "Expert"]

export function isDifficultyType(value: any): value is DifficultyTypes {
  return difficulties.includes(value);
}

export default function DifficultyBox({difficulty}: {difficulty: number}){
  const t = useTranslations('Box')
  return <Badge variant="outline" className={colors[isDifficultyType(difficulties[difficulty]) ? difficulties[difficulty] : "Easy"]}>
  {t(difficulties[difficulty])}
</Badge>
}