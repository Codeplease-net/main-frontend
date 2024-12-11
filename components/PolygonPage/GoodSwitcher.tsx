import { difficulties } from "@/components/ui/difficulty";

export default function GoodSwitcher({
  defaultValue,
  label,
  className,
  setDefaultValue,
}: {
  defaultValue: number;
  label: string;
  className: string;
  setDefaultValue: (value: number) => void;
}) {
  return (
    <label
      className={`relative transition-opacity [&:disabled]:opacity-30 flex ${className}`}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex appearance-none bg-transparent pl-2 pr-6"
        defaultValue={defaultValue}
        onChange={(e) =>
          setDefaultValue(
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
      <span className="pointer-events-none absolute right-2 top-[-3px]">⌄</span>
    </label>
  );
}
