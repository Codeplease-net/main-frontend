import React, { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Editor, { loader, useMonaco } from '@monaco-editor/react';
import { Upload, Settings2, Copy, Download, Undo, Redo, Search, Save, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from "lucide-react";
import { toast } from '@/components/ui/use-toast';

const INITIAL_COMMENTS = {
  python: "# Write your Python solution here\n# Have fun coding!",
  cpp: "// Write your C++ solution here\n// Have fun coding!",
  java: "// Write your Java solution here\n// Have fun coding!"
};

const THEMES = {
  'custom-vs-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#020817',
      'editor.lineHighlightBackground': '#1a2234', 
      'editorCursor.foreground': '#7c85f3',
      'editor.selectionBackground': '#2a3957'
    }
  },
  'github-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0d1117',
      'editor.lineHighlightBackground': '#161b22',
      'editorCursor.foreground': '#58a6ff',
      'editor.selectionBackground': '#1f2937'
    }
  },
  'monokai': {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#272822',
      'editor.lineHighlightBackground': '#3e3d32',
      'editorCursor.foreground': '#f8f8f2',
      'editor.selectionBackground': '#49483e'
    }
  }
};

// Initialize Monaco themes
loader.init().then((monaco) => {
  Object.entries(THEMES).forEach(([name, theme]) => {
    monaco.editor.defineTheme(name, theme as any);
  });
});

export default function CodeEditor({ setDisplaySubmission, onTabChange }: { onTabChange: (value: string) => void, setDisplaySubmission: (submission: number) => void }) {
  const [theme, setTheme] = useState('custom-vs-dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<'python' | 'cpp' | 'java'>('cpp');
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [tabSize, setTabSize] = useState(4);
  const [bracketPairs, setBracketPairs] = useState(true);
  const editorRef = React.useRef<any>(null);
  const monaco = useMonaco();
  const [markers, setMarkers] = useState<any[]>([]);

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

  // Handle editor errors
  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    // Configure language diagnostics
    if (language === 'cpp') {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    }

    const updateMarkers = () => {
      const currentMarkers = monaco.editor.getModelMarkers({ resource: model.uri });
      setMarkers(currentMarkers);

      // Show toast for errors
      if (currentMarkers.length > 0) {
        const errorCount = currentMarkers.filter(m => m.severity === monaco.MarkerSeverity.Error).length;
        const warningCount = currentMarkers.filter(m => m.severity === monaco.MarkerSeverity.Warning).length;
        
        if (errorCount > 0 || warningCount > 0) {
          const errorMessages = currentMarkers
            .filter(m => m.severity === monaco.MarkerSeverity.Error)
            .map(m => m.message)
            .join('\n');

          // Add markers to show errors in the editor
          monaco.editor.setModelMarkers(model, 'owner', currentMarkers.map(marker => ({
            ...marker,
            severity: marker.severity,
            message: marker.message,
            startLineNumber: marker.startLineNumber,
            startColumn: marker.startColumn,
            endLineNumber: marker.endLineNumber,
            endColumn: marker.endColumn
          })));

          toast({
            title: "Code Issues Detected",
            description: (
              <div>
                <p>{`Found ${errorCount} errors and ${warningCount} warnings`}</p>
                {errorCount > 0 && (
                  <p className="mt-2 text-sm text-red-500">{errorMessages}</p>
                )}
              </div>
            ),
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        // Clear markers if no errors
        monaco.editor.setModelMarkers(model, 'owner', []);
      }
    };

    // Set up change event listener
    const changeDisposable = model.onDidChangeContent(() => {
      updateMarkers();
    });

    // Initial marker check
    updateMarkers();

    return () => {
      changeDisposable.dispose();
      monaco.editor.setModelMarkers(model, 'owner', []);
    };
  }, [monaco, language]);

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    
    // Check for errors before submitting
    if (markers.some(marker => marker.severity === (monaco?.MarkerSeverity.Error || 8))) {
      const errorMessages = markers
        .filter(m => m.severity === (monaco?.MarkerSeverity.Error || 8))
        .map(m => m.message)
        .join('\n');

      toast({
        title: "Cannot Submit Code",
        description: (
          <div>
            <p>Please fix all errors before submitting:</p>
            <p className="mt-2 text-sm text-red-500">{errorMessages}</p>
          </div>
        ),
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);

      const code = editorRef.current.getValue();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/submit`, {
        problem_id: "range-sum-queries",
        source: code,
        user_id: "lV1Ed1vQjKS60FpZsQETj7xmdKO2",
        lang: language === 'cpp' ? 'c++17' : language
      });
      
      setDisplaySubmission(response.data);
      onTabChange("submissions");
      toast({
        title: "Code submitted successfully!",
        description: "Your submission is being processed.",
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied to clipboard!",
      duration: 2000,
    });
  };

  const handleDownloadCode = () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${language}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!editorRef.current) return;
    editorRef.current.setValue(INITIAL_COMMENTS[language]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border">
        <div className="flex w-full justify-between items-center h-16 px-4" translate="no">
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(value: 'python' | 'cpp' | 'java') => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDownloadCode}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Code</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-5 w-5" />
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
                    <Switch checked={lineNumbers} onCheckedChange={setLineNumbers} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Save</Label>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Bracket Pair Colorization</Label>
                    <Switch checked={bracketPairs} onCheckedChange={setBracketPairs} />
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
      </div>

      <div className="flex-1 min-h-0" translate="no">
        <Editor
          height="100%"
          theme={theme}
          language={language}
          defaultValue={INITIAL_COMMENTS[language]}
          options={{
            minimap: { enabled: minimap },
            fontSize: fontSize,
            lineHeight: 1.6,
            padding: { top: 16 },
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
              enabled: bracketPairs
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
            }
          }}
          onMount={(editor) => (editorRef.current = editor)}
        />
      </div>
    </div>
  );
}