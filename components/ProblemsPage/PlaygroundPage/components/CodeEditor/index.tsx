import React from "react";
import { Editor, loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Settings, Loader2, Upload } from "lucide-react";
import CopyButton from "@/components/ui/copy-button";
import { INITIAL_COMMENTS, THEMES } from "./constants";
import { useEditor } from "../../hooks/useEditor";
import { EditorSettings } from "./EditorSettings";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";

// Initialize Monaco themes
loader.init().then((monaco) => {
  Object.entries(THEMES).forEach(([name, theme]) => {
    monaco.editor.defineTheme(name, theme as any);
  });
});

interface CodeEditorProps {
  problemId: string;
  user: User | null;
  onTabChange: (tab: string) => void;
  setDisplaySubmission: (id: string) => void;
}

export function CodeEditor({ problemId, user, setDisplaySubmission, onTabChange }: CodeEditorProps) {
  const t = useTranslations("playground");
  
  const {
    theme,
    setTheme,
    isSubmitting,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    minimap,
    setMinimap,
    wordWrap,
    setWordWrap,
    lineNumbers,
    setLineNumbers,
    autoSave,
    setAutoSave,
    tabSize,
    setTabSize,
    bracketPairs,
    setBracketPairs,
    editorRef,
    handleSubmit,
  } = useEditor({
    problemId,
    userId: user?.uid || "",  // Pass the user ID safely
    onTabChange,
    setDisplaySubmission
  });

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
              <Button variant="ghost" size="icon" aria-label={t("settingsAriaLabel")}>
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <EditorSettings 
              theme={theme}
              setTheme={setTheme}
              fontSize={fontSize}
              setFontSize={setFontSize}
              tabSize={tabSize}
              setTabSize={setTabSize}
              minimap={minimap}
              setMinimap={setMinimap}
              wordWrap={wordWrap}
              setWordWrap={setWordWrap}
              lineNumbers={lineNumbers}
              setLineNumbers={setLineNumbers}
              autoSave={autoSave}
              setAutoSave={setAutoSave}
              bracketPairs={bracketPairs}
              setBracketPairs={setBracketPairs}
            />
          </Sheet>
        </div>

        <Button
          onClick={handleSubmit}
          className="gap-2 font-mono"
          disabled={isSubmitting || !user}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {t("submit")}
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 relative group">
        <CopyButton
          content={editorRef.current?.getValue()}
          classname="absolute top-3 right-3 z-10 
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200 ease-in-out
                    bg-background/70 backdrop-blur-md
                    hover:bg-background/90 hover:scale-105
                    shadow-lg border border-border/50
                    hover:border-border/80 hover:shadow-xl
                    active:scale-95"
        />

        <Editor
          height="100%"
          theme={theme}
          language={language}
          defaultValue={INITIAL_COMMENTS[language]}
          className="rounded-xl border border-border/40 shadow-inner transition-all duration-200"
          options={{
            scrollBeyondLastLine: false,
            minimap: { enabled: minimap },
            fontSize: fontSize,
            renderLineHighlight: "all",
            smoothScrolling: true,
            cursorBlinking: "smooth",
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
            const savedCodeKey = `code-${problemId}-${language}`;
            const savedCode = localStorage.getItem(savedCodeKey);
            if (savedCode) {
              editor.setValue(savedCode);
            }
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;