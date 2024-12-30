import { difficulties } from "@/components/ui/difficulty";

export default function DifficultySwitcher({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <label className="relative transition-opacity [&:disabled]:opacity-30 flex border border-foreground bg-muted/50 font-mono text-foreground rounded-sm text-sm">
      <select
        className="inline-flex appearance-none bg-muted/50 pl-2 pr-5 py-1"
        value={value}
        onChange={(e) =>
          setValue(
            typeof e.target.value == "number" ? e.target.value : +e.target.value
          )
        }
      >
        {difficulties.map((cur, index: number) => (
          <option key={index} value={index}>
            {cur}
          </option>
        ))}
      </select>
      <span className="pointer-events-none right-2 absolute">⌄</span>
    </label>
  );
}
