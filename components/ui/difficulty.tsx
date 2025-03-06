import { cn } from "@/lib/utils";

interface ColorStop {
  point: number;
  color: string;
  label: string;
}

const difficultyLevels: ColorStop[] = [
  { point: 100, color: "#22c55e", label: "Easy" },      // Green (100-1000)
  { point: 1100, color: "#f59e0b", label: "Medium" },   // Amber (1100-1500)
  { point: 1600, color: "#ef4444", label: "Hard" },     // Red (1600-2000)
];

function getDifficultyInfo(difficulty: number): ColorStop {
  // Ensure difficulty is between 100 and 2000, and rounds to nearest 100
  const normalizedDifficulty = Math.max(
    100,
    Math.min(2000, Math.round(difficulty / 100) * 100)
  );
  
  for (let i = difficultyLevels.length - 1; i >= 0; i--) {
    if (normalizedDifficulty >= difficultyLevels[i].point) {
      return difficultyLevels[i];
    }
  }
  
  return difficultyLevels[0];
}

export default function DifficultyBox({ difficulty }: { difficulty: number }) {
  const { color, label } = getDifficultyInfo(difficulty);
  
  return (
    <div className="group relative inline-flex items-center justify-center">
      <div
        style={{ backgroundColor: color }}
        className={cn(
          "relative px-3 py-1.5",
          "rounded-sm text-white font-medium",
          "transition-all duration-300 ease-out",
          "hover:shadow-md",
          "hover:scale-105",
          "flex items-center gap-2"
        )}
      >
        <span className="text-[11px] font-mono">
          {difficulty}
        </span>
      </div>
      <div 
        style={{ backgroundColor: color }}
        className={cn(
          "absolute inset-0 -z-10",
          "rounded-sm opacity-0",
          "blur-md",
          "transition-opacity duration-300",
        )}
      />
    </div>
  );
}