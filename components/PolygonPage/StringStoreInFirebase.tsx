import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CopyButton from "@/components/ui/copy-button";

export function StringStoreInFirebase({ text, description }: { text: string, description: string }) {
  return (
    <div className="space-y-2 mt-4">
      <div className="grid grid-cols gap-4 rounded-md">
        <Card className="bg-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-bold">
              {description}
            </CardTitle>
            <CopyButton content={text} />
          </CardHeader>
          <div className="w-full bg-secondary/50 h-0.5"></div>
          <CardContent className="mt-4" style={{width: '47vw'}}>
            <div className="text-xs font-mono break-words">
              {text}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
