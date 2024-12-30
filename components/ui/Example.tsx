import { Card, CardContent, CardHeader, CardTitle } from "./card";
import CopyButton from "./copy-button";

export function Example({ splitText, className = '' }: { splitText: string[], className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-xl font-semibold">{splitText[0]}</h3>
      <div className="grid grid-cols-2">
        <Card className="bg-secondary/50 rounded-none border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6">
            <CardTitle className="text-base font-bold font-mono">
              Input
            </CardTitle>
            <CopyButton content={splitText[1]} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="py-5 pl-6">
            <div className="text-sm font-mono whitespace-pre-wrap break-words">
              {splitText[1]}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50  border-l-none border-t border-b border-r rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6">
            <CardTitle className="text-base font-bold font-mono">
              Output
            </CardTitle>
            <CopyButton content={splitText[2]} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="py-5 pl-6">
            <div className="text-sm font-mono whitespace-pre-wrap break-words">
              {splitText[2]}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
