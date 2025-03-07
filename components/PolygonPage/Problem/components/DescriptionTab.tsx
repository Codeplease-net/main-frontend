"use client";

import { useState, useEffect } from "react";
import { Problem } from "../types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SUPPORTED_LANGUAGES, LanguageCode } from "../types/language";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, Save, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { FitEditorLatex } from "@/components/ui/description/fit-editor";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, FileText, Lightbulb, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onPreviewChange: (content: contentProps, lang: LanguageCode) => void;
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
  const [activeTab, setActiveTab] = useState<string>("description");
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [localContent, setLocalContent] = useState({
    title: problem.content.title[language] || "",
    description: problem.content.description[language] || "",
    solution: problem.content.solution[language] || "",
  });

  // Update localContent when language changes
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
      setIsSaving(true);
      setSaveSuccess(null);
      
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
      
      // Set success state
      setSaveSuccess(true);
      
      toast({
        title: "Success",
        description: `Content in ${currentLanguageName} updated successfully`,
      });
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
      
    } catch (error) {
      setSaveSuccess(false);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentLanguageName = SUPPORTED_LANGUAGES[language]?.name || language;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-auto bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
        {/* Header with Breadcrumbs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Editor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit problem content in multiple languages
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 min-w-[140px] h-10"
                size="sm"
              >
                <Globe className="h-4 w-4" />
                {SUPPORTED_LANGUAGES[language]?.icon}
                <span>{currentLanguageName}</span>
                <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <DropdownMenuItem
                  key={code}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer",
                    code === language && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => handleLanguageChange(code)}
                >
                  {lang.icon}
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title Card */}
        <Card className="shadow-md border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary/80" />
              Problem Title
            </CardTitle>
            <CardDescription>
              The main title shown to users in {currentLanguageName}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Input
                className="px-4 py-2.5 font-medium text-base focus-visible:ring-primary/30 h-11 transition-all border-border/60"
                value={localContent.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder={`Enter problem title in ${currentLanguageName}...`}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs Card */}
        <Card className="shadow-md border-border/60">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="border-b pb-0 px-0 pt-0">
              <TabsList className="w-full rounded-none grid grid-cols-2 bg-muted/50">
                <TabsTrigger 
                  value="description" 
                  className="data-[state=active]:bg-background rounded-none border-r border-border/30 py-3 data-[state=active]:shadow-none p-4"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="solution"
                  className="data-[state=active]:bg-background rounded-none py-3 data-[state=active]:shadow-none p-4"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Solution
                  </div>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-6">
              <TabsContent value="description" className="mt-0 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
                    Problem Description
                    <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                      {currentLanguageName}
                    </span>
                  </Label>
                    <FitEditorLatex
                      minLine={15}
                      content={localContent.description}
                      onChange={(value) => handleContentChange("description", value)}
                    />
                  <p className="text-xs text-muted-foreground mt-3 ml-1">
                    Use Markdown and LaTeX for formatting. Include problem constraints and examples.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="mt-0 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
                    Problem Solution
                    <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                      {currentLanguageName}
                    </span>
                  </Label>
                  <div className="border rounded-md border-border/60 overflow-hidden transition-all focus-within:ring-1 focus-within:ring-primary/30">
                    <FitEditorLatex
                      minLine={15}
                      content={localContent.solution}
                      onChange={(value) => handleContentChange("solution", value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 ml-1">
                    Explain the solution approach, algorithm, and complexity analysis.
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full bg-card border border-border/60 rounded-lg px-4 py-3 shadow-md">
          <div className="text-sm text-muted-foreground order-2 sm:order-1 text-center sm:text-left">
            <p><span className="font-medium text-foreground">Note:</span> Changes will only affect content in {currentLanguageName}.</p>
            <p className="text-xs mt-1">You can switch languages using the dropdown menu.</p>
          </div>
          
          <div className="order-1 sm:order-2 w-full sm:w-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={isLoading || isSaving}
                  className={cn(
                    "flex items-center gap-2 w-full sm:w-auto h-10 px-6",
                    "transition-all duration-200 relative overflow-hidden",
                    saveSuccess === true && "bg-emerald-600 hover:bg-emerald-700",
                    saveSuccess === false && "bg-destructive hover:bg-destructive/90",
                    isSaving && "opacity-80",
                    "shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.98]"
                  )}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess === true ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Saved Successfully</span>
                      {/* Success animation overlay */}
                      <span className="absolute inset-0 bg-emerald-500/20 animate-pulse-once" />
                    </>
                  ) : saveSuccess === false ? (
                    <>
                      <X className="h-4 w-4" />
                      <span>Save Failed - Retry</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will update problem content in {currentLanguageName} language. Other language versions will remain unchanged.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel 
                    disabled={isSaving}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      isSaving && "opacity-80 cursor-not-allowed"
                    )}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}