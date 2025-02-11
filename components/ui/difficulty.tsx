import { cn } from "@/lib/utils";

interface ColorStop {
  point: number;
  from: string;
  to: string;
}

const colorStops: ColorStop[] = [
  { point: 0, from: "rgb(20, 184, 166)", to: "rgb(16, 185, 129)" },  // Teal/Emerald
  { point: 20, from: "rgb(34, 197, 94)", to: "rgb(132, 204, 22)" },  // Green/Lime
  { point: 40, from: "rgb(245, 158, 11)", to: "rgb(249, 115, 22)" }, // Amber/Orange
  { point: 60, from: "rgb(239, 68, 68)", to: "rgb(225, 29, 72)" },   // Red/Rose
  { point: 80, from: "rgb(236, 72, 153)", to: "rgb(147, 51, 234)" }, // Pink/Purple
  { point: 100, from: "rgb(139, 92, 246)", to: "rgb(79, 70, 229)" }  // Violet/Indigo
];

function interpolateColor(difficulty: number) {
  const normalizedDifficulty = Math.max(0, Math.min(100, difficulty));
  
  // Find the surrounding color stops
  let lowerIndex = 0;
  for (let i = 0; i < colorStops.length; i++) {
    if (colorStops[i].point >= normalizedDifficulty) {
      lowerIndex = Math.max(0, i - 1);
      break;
    }
  }
  
  const lowerStop = colorStops[lowerIndex];
  const upperStop = colorStops[lowerIndex + 1] || colorStops[lowerIndex];
  
  // Calculate how far between the two stops we are (0-1)
  const range = upperStop.point - lowerStop.point;
  const progress = range === 0 ? 0 : (normalizedDifficulty - lowerStop.point) / range;

  // Parse RGB values
  const fromRGB = lowerStop.from.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const toRGB = upperStop.from.match(/\d+/g)?.map(Number) || [0, 0, 0];
  
  // Interpolate RGB values
  const r = Math.round(fromRGB[0] + (toRGB[0] - fromRGB[0]) * progress);
  const g = Math.round(fromRGB[1] + (toRGB[1] - fromRGB[1]) * progress);
  const b = Math.round(fromRGB[2] + (toRGB[2] - fromRGB[2]) * progress);
  
  return {
    from: `rgb(${r}, ${g}, ${b})`,
    to: `rgb(${r}, ${g}, ${b})`
  };
}

export default function DifficultyBox({ difficulty }: { difficulty: number }) {
  const colors = interpolateColor(difficulty);
  
  return (
    <div className="group relative inline-flex items-center justify-center">
      <div
        style={{
          '--from': colors.from,
          '--to': colors.to,
        } as React.CSSProperties}
        className={cn(
          "min-w-[2.75rem] px-2 py-1",
          "rounded-full text-white text-xs font-medium",
          "bg-gradient-to-r from-[var(--from)] to-[var(--to)]",
          "transition-all duration-300",
          "shadow-sm hover:shadow-lg",
          "hover:scale-105"
        )}
      >
        {Math.round(difficulty)}
      </div>
      <div 
        style={{
          '--from': colors.from,
          '--to': colors.to,
        } as React.CSSProperties}
        className={cn(
          "absolute inset-0 -z-10",
          "rounded-full opacity-0 blur-xl",
          "bg-gradient-to-r from-[var(--from)] to-[var(--to)]",
          "transition-opacity duration-300",
          "group-hover:opacity-25"
        )}
      />
    </div>
  );
}