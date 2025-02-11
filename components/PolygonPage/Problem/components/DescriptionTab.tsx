"use client";

import { useState, useEffect } from "react";
import { Problem } from "../types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SUPPORTED_LANGUAGES, LanguageCode } from "../types/language";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import FitEditor, {
  FitEditorXML,
} from "@/components/ui/description/fit-editor";

interface contentProps {
  title: string;
  description: string;
  solution: string;
}

interface DescriptionTabProps {
  problem: Problem;
  language: LanguageCode;
  isLoading: boolean;
  onUpdate: (updates: Partial<Problem>) => Promise<void>;
  onPreviewChange: (content: contentProps, lang: LanguageCode) => void; // Add this
}

export function DescriptionTab({
  problem,
  language,
  isLoading,
  onUpdate,
  onPreviewChange,
}: DescriptionTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localContent, setLocalContent] = useState({
    title: problem.content.title[language] || "",
    description: problem.content.description[language] || "",
    solution: problem.content.solution[language] || "",
  });

  // Add useEffect to update localContent when language changes
  useEffect(() => {
    setLocalContent({
      title: problem.content.title[language] || "",
      description: problem.content.description[language] || "",
      solution: problem.content.solution[language] || "",
    });
  }, [language, problem.content]);

  const handleLanguageChange = (newLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    router.push(`?${params.toString()}`);
  };

  const handleContentChange = (
    field: keyof typeof localContent,
    value: string
  ) => {
    const newContent = {
      ...localContent,
      [field]: value,
    };
    setLocalContent(newContent);
    onPreviewChange(newContent, language);
  };

  const handleUpdate = async () => {
    try {
      await onUpdate({
        content: {
          ...problem.content,
          title: { ...problem.content.title, [language]: localContent.title },
          description: {
            ...problem.content.description,
            [language]: localContent.description,
          },
          solution: {
            ...problem.content.solution,
            [language]: localContent.solution,
          },
        },
      });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] overflow-auto">
      <div className="mx-auto w-full px-6 py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground mb-2">Title</Label>
            <Input
              value={localContent.title}
              onChange={(e) => handleContentChange("title", e.target.value)}
              placeholder={`Enter title in ${language}...`}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col items-end gap-2">
            <Label className="text-sm text-muted-foreground">Language</Label>
            <div className="flex gap-1 p-1 rounded-md border bg-background/50">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors",
                    code === language
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {lang.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <FitEditorXML
            content={localContent.description}
            onChange={(value) => handleContentChange("description", value)}
          />
        </div>

        {/* Solution */}
        <div className="space-y-2">
          <Label>Solution</Label>
          <FitEditorXML
            content={localContent.solution}
            onChange={(value) => handleContentChange("solution", value)}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isLoading}>Save Changes</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Save Changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Update content for {language} language?
              </AlertDialogDescription>
              <div className="flex justify-end gap-2 mt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdate}>
                  Save
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
