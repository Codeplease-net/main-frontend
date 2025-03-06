import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { submitCode } from '../api/submission';

interface UseEditorOptions {
  problemId: string;
  userId: string;
  onTabChange: (tab: string) => void;
  setDisplaySubmission: (id: string) => void;
}

export function useEditor({ problemId, userId, onTabChange, setDisplaySubmission }: UseEditorOptions) {
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
  const editorRef = useRef<any>(null);

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
      const response = await submitCode(
        problemId, 
        code, 
        userId, 
        language
      );

      setDisplaySubmission(response);
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

  return {
    theme,
    setTheme,
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
    isSubmitting,
    handleSubmit
  };
}