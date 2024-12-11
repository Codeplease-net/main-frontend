import { Card, CardContent, CardHeader, CardTitle } from "./card";
import CopyButton from "./copy-button";

export function Example({ splitText }: { splitText: string[] }) {
  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-xl font-semibold">{splitText[0]}</h3>
      <div className="grid grid-cols-2 gap-4 rounded-md">
        <Card className="bg-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-bold ">
              {splitText[1]}
            </CardTitle>
            <CopyButton content={splitText[2]} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="mt-4">
            <div className="text-sm font-mono whitespace-pre-wrap break-words">
              {splitText[2]}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-bold">
              {splitText[3]}
            </CardTitle>
            <CopyButton content={splitText[4]} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="mt-4">
            <div className="text-sm font-mono whitespace-pre-wrap break-words">
              {splitText[4]}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
