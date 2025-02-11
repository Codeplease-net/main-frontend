import { Card, CardContent, CardHeader, CardTitle } from "../card";
import CopyButton from "../copy-button";

export function Example({
  input,
  output,
  className = "",
}: {
  input: string;
  output: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-2">
        <Card className="bg-secondary/50 rounded-none border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6">
            <CardTitle className="text-base font-bold font-mono">
              Input
            </CardTitle>
            <CopyButton content={input} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="py-5 pl-6">
            <div className="text-sm font-mono whitespace-pre-wrap break-words">
              {input}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50  border-l-none border-t border-b border-r rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6">
            <CardTitle className="text-base font-bold font-mono">
              Output
            </CardTitle>
            <CopyButton content={output} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="py-5 pl-6">
            <div className="text-sm font-mono whitespace-pre-wrap break-words">
              {output}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
