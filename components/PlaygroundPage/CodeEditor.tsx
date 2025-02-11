import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Editor, { loader } from "@monaco-editor/react";
import {
  Upload,
  Copy,
  Settings,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CopyButton from "../ui/copy-button";

const INITIAL_COMMENTS = {
  python: "# Write your Python solution here\n# Have fun coding!",
  cpp: "// Write your C++ solution here\n// Have fun coding!",
  java: "// Write your Java solution here\n// Have fun coding!",
};

const THEMES = {
  "custom-vs-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#020817",
      "editor.lineHighlightBackground": "#1a2234",
      "editorCursor.foreground": "#7c85f3",
      "editor.selectionBackground": "#2a3957",
    },
  },
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0d1117",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#58a6ff",
      "editor.selectionBackground": "#1f2937",
    },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#272822",
      "editor.lineHighlightBackground": "#3e3d32",
      "editorCursor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#49483e",
    },
  },
};

// Initialize Monaco themes
loader.init().then((monaco) => {
  Object.entries(THEMES).forEach(([name, theme]) => {
    monaco.editor.defineTheme(name, theme as any);
  });
});

export default function CodeEditor({
  setDisplaySubmission,
  onTabChange,
}: {
  onTabChange: (value: string) => void;
  setDisplaySubmission: (submission: number) => void;
}) {
  const [theme, setTheme] = useState("custom-vs-dark");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<"python" | "cpp" | "java">("cpp");
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [tabSize, setTabSize] = useState(4);
  const [bracketPairs, setBracketPairs] = useState(true);
  const editorRef = React.useRef<any>(null);

  // Load saved code from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${language}`);
    if (savedCode && editorRef.current) {
      editorRef.current.setValue(savedCode);
    }
  }, [language]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      if (editorRef.current) {
        const currentCode = editorRef.current.getValue();
        localStorage.setItem(`code-${language}`, currentCode);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [autoSave, language]);

  const handleSubmit = async () => {
    if (!editorRef.current) return;

    try {
      setIsSubmitting(true);

      const code = editorRef.current.getValue();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/submit`,
        {
          problem_id: "digit-queries",
          source: code,
          user_id: "lV1Ed1vQjKS60FpZsQETj7xmdKO2",
          lang: language === "cpp" ? "c++17" : language,
        }
      );

      setDisplaySubmission(response.data);
      onTabChange("submissions");
      toast({
        title: "Code submitted successfully!",
        description: "Your submission is being processed.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex w-full justify-between items-center h-16 px-4 border-b">
        <div className="flex items-center gap-4">
          <Select
            value={language}
            onValueChange={(value: "python" | "cpp" | "java") =>
              setLanguage(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Editor Settings</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom-vs-dark">Dark</SelectItem>
                      <SelectItem value="github-dark">GitHub Dark</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size ({fontSize}px)</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={10}
                    max={24}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tab Size</Label>
                  <Slider
                    value={[tabSize]}
                    onValueChange={([value]) => setTabSize(value)}
                    min={2}
                    max={8}
                    step={2}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Minimap</Label>
                  <Switch checked={minimap} onCheckedChange={setMinimap} />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Word Wrap</Label>
                  <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Line Numbers</Label>
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto Save</Label>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Bracket Pair Colorization</Label>
                  <Switch
                    checked={bracketPairs}
                    onCheckedChange={setBracketPairs}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Button
          onClick={handleSubmit}
          className="gap-2 font-mono"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Submit
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 relative group">
              <CopyButton content={editorRef.current?.getValue()} classname="absolute top-3 right-3 z-10 
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200 ease-in-out
                    bg-background/70 backdrop-blur-md
                    hover:bg-background/90 hover:scale-105
                    shadow-lg border border-border/50
                    hover:border-border/80 hover:shadow-xl
                    active:scale-95"/>
        

        <Editor
          height="100%"
          theme={theme}
          language={language}
          defaultValue={INITIAL_COMMENTS[language]}
          className="rounded-xl border border-border/40 shadow-inner transition-all duration-200"
          options={{
            minimap: { enabled: minimap },
            fontSize: fontSize,
            renderLineHighlight: "all",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: wordWrap ? "on" : "off",
            lineNumbers: lineNumbers ? "on" : "off",
            tabSize: tabSize,
            bracketPairColorization: {
              enabled: bracketPairs,
            },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoIndent: "full",
            dragAndDrop: true,
            links: true,
            mouseWheelZoom: true,
            folding: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            padding: { top: 24, bottom: 24 },
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              alwaysConsumeMouseWheel: false,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            renderLineHighlightOnlyWhenFocus: true,
            contextmenu: true,
            fontLigatures: true,
            renderWhitespace: "selection",
            roundedSelection: true,
            letterSpacing: 0.5,
            lineHeight: 1.6,
          }}
          onMount={(editor) => {
            editorRef.current = editor;
            const savedCode = localStorage.getItem(`code-${language}`);
            if (savedCode) {
              editor.setValue(savedCode);
            }
          }}
        />
      </div>
    </div>
  );
}
