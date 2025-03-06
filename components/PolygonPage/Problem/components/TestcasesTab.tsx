import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Database, FileText, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, Scale, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestcasesTabProps {
  problemId: string;
}

interface TestCasesProps {
  index: number;
  input: string;
  output: string;
  score: number;
}

interface ConfigProps {
  memory_limit: number;
  time_limit: number;
  type_of_judging: string;
  short_name: string;
  test_cases: TestCasesProps[];
}

export function TestcasesTab({ problemId }: TestcasesTabProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const null_config: ConfigProps = {
    memory_limit: 0,
    time_limit: 0,
    type_of_judging: "AC",
    short_name: "",
    test_cases: [],
  };

  const [config, setConfig] = useState<ConfigProps>(null_config);
  const [isAddingTestCase, setIsAddingTestCase] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    input: "",
    output: "",
    inputFile: null,
    outputFile: null,
    score: 0,
  });

  // Common score presets for quick selection
  const scorePresets = [0, 5, 10, 20, 25, 33, 50, 100];
  
  const Process = (data: any) => {
    let t = data;
    for (let i: number = 0; i < t.test_cases.length; i++) {
      t.test_cases[i].score = parseInt(t.test_cases[i].score);
    }
    return t;
  };

  const fetchConfig = () => {
    setIsLoading(true);
    setLoadingError(null);
    
    const form = new FormData();
    form.append("name", problemId);
    axios
      .post(
        process.env.NEXT_PUBLIC_JUDGE0_API_KEY + "/problems/get_problem_config",
        form
      )
      .then((response) => {
        setConfig(Process(response.data));
        console.log(Process(response.data));
      })
      .catch((err) => {
        console.log(err);
        setLoadingError("Failed to load test cases. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = async (index: number) => {
    setIsDeleting(index);
    try {
      const form = new FormData();
      form.append("name", problemId);
      form.append("test_case_index", index);

      await axios.post(
        `${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/testcases/delete`,
        form
      );

      toast({
        title: "Test case deleted",
        description: "The test case has been successfully deleted.",
      });

      fetchConfig(); // Refresh the test cases
    } catch (error) {
      console.error("Error deleting test case:", error);
      toast({
        title: "Error",
        description: "Failed to delete the test case.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingTestCase(true);
    
    try {
      const form = new FormData();
      form.append("name", problemId);
      if (newTestCase.inputFile) {
        form.append("input_file", newTestCase.inputFile);
      } else if (newTestCase.input) {
        const inputBlob = new Blob([newTestCase.input], { type: 'text/plain' });
        const inputFile = new File([inputBlob], 'input.txt', { type: 'text/plain' });
        form.append("input_file", inputFile);
      }
  
      // Handle output - use file if provided, otherwise convert textarea content to file
      if (newTestCase.outputFile) {
        form.append("output_file", newTestCase.outputFile);
      } else if (newTestCase.output) {
        const outputBlob = new Blob([newTestCase.output], { type: 'text/plain' });
        const outputFile = new File([outputBlob], 'output.txt', { type: 'text/plain' });
        form.append("output_file", outputFile);
      }
  
      form.append("score", newTestCase.score.toString());

      await axios.post(
        `${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/testcases/add`,
        form
      );

      toast({
        title: "Success",
        description: "Test case added successfully",
      });

      // Reset form and close dialog
      setNewTestCase({
        input: "",
        output: "",
        inputFile: null,
        outputFile: null,
        score: 0,
      });
      setOpen(false);
      fetchConfig(); // Refresh the test cases list
    } catch (error) {
      console.error("Error adding test case:", error);
      toast({
        title: "Error",
        description: "Failed to add test case",
        variant: "destructive",
      });
    } finally {
      setIsAddingTestCase(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Loading screen component
  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center bg-dot-pattern p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-semibold">Loading test cases...</h3>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            This may take a moment as we're fetching all test case data. Large test cases may take longer to load.
          </p>
        </div>
      </div>
    );
  }

  // Error screen component
  if (loadingError) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center bg-dot-pattern p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold">Error Loading Test Cases</h3>
          <p className="text-muted-foreground">{loadingError}</p>
          <Button onClick={fetchConfig}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-auto bg-muted/5 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Test Cases</h1>
        <p className="text-muted-foreground">Configure test cases and judging parameters for this problem.</p>
      </div>
      
      {/* Problem Configuration Card */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Problem Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Limit */}
            <div className="flex items-center space-x-4 p-3 rounded-md bg-muted/40">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Time Limit</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold">{config.time_limit}</span>
                  <span className="text-sm text-muted-foreground">ms</span>
                </div>
              </div>
            </div>
            
            {/* Memory Limit */}
            <div className="flex items-center space-x-4 p-3 rounded-md bg-muted/40">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Memory Limit</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold">{config.memory_limit}</span>
                  <span className="text-sm text-muted-foreground">MB</span>
                </div>
              </div>
            </div>
            
            {/* Judging Type */}
            <div className="flex items-center space-x-4 p-3 rounded-md bg-muted/40">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Judging Type</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold">{config.type_of_judging}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Section */}
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-lg font-medium">Test Cases ({config.test_cases.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Test Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Test Case</DialogTitle>
              <DialogDescription>
                Create a new test case with input, output and score.
              </DialogDescription>
            </DialogHeader>
            
            <form className="space-y-4" onSubmit={handleAddTest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="input" className="text-sm font-medium">Input</Label>
                    <Badge variant="outline" className="font-normal">Required</Badge>
                  </div>
                  
                  <div className="relative">
                    <Input
                      type="file"
                      onChange={(e) => setNewTestCase({...newTestCase, inputFile: e.target.files?.[0] || null})}
                      className="w-full"
                      accept=".txt,.in,.inp"
                      disabled={isAddingTestCase}
                    />
                    <div className="my-2 text-center text-xs text-muted-foreground">— OR —</div>
                  </div>
                  
                  <Textarea
                    id="input"
                    placeholder="Enter test case input..."
                    value={newTestCase.input}
                    onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                    className="font-mono min-h-[200px]"
                    disabled={isAddingTestCase}
                  />
                </div>

                {/* Right Column - Output */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="output" className="text-sm font-medium">Expected Output</Label>
                    <Badge variant="outline" className="font-normal">Required</Badge>
                  </div>
                  
                  <div className="relative">
                    <Input
                      type="file"
                      onChange={(e) => setNewTestCase({...newTestCase, outputFile: e.target.files?.[0] || null})}
                      className="w-full"
                      accept=".txt,.out"
                      disabled={isAddingTestCase}
                    />
                    <div className="my-2 text-center text-xs text-muted-foreground">— OR —</div>
                  </div>
                  
                  <Textarea
                    id="output"
                    placeholder="Enter expected output..."
                    value={newTestCase.output}
                    onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
                    className="font-mono min-h-[200px]"
                    disabled={isAddingTestCase}
                  />
                </div>
              </div>

              {/* Score Input */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="score" className="text-sm">Score</Label>
                    <span className="text-xs text-muted-foreground">Default: 0</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {scorePresets.map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        size="sm"
                        variant={newTestCase.score === preset ? "default" : "outline"}
                        className="h-8 px-3"
                        onClick={() => setNewTestCase({...newTestCase, score: preset})}
                        disabled={isAddingTestCase}
                      >
                        {preset}
                      </Button>
                    ))}
                    <div className="relative flex items-center max-w-[160px]">
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        placeholder="Custom score..."
                        value={!scorePresets.includes(newTestCase.score) && newTestCase.score !== 0 ? newTestCase.score : ""}
                        onChange={(e) => {
                          const value = e.target.value.trim() === "" ? 0 : parseInt(e.target.value);
                          setNewTestCase({...newTestCase, score: isNaN(value) ? 0 : value})
                        }}
                        className="h-8 pr-16"
                        disabled={isAddingTestCase}
                      />
                      <span className="absolute right-3 text-xs text-muted-foreground">points</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={isAddingTestCase}>
                  {isAddingTestCase ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Test Case"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Test Cases Card */}
      <Card className="shadow-sm border-border/60">
        <CardContent className="p-0">
          {config.test_cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No test cases yet</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Test cases help validate solutions. Each test case consists of an input, expected output, and score.
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Your First Test Case
              </Button>
            </div>
          ) : (
            <div>
              {config.test_cases.map((testCase, index) => (
                <div key={index} className="border-b border-border/60 last:border-b-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="font-medium">Test Case #{index + 1}</div>
                      </div>
                      <Badge variant="secondary" className="font-mono">
                        Score: {testCase.score}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Input Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Input</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            asChild
                          >
                            <a
                              href={`${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/testcases/download?name=${problemId}&test_case_index=${testCase.index}&type=input`}
                              download
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </a>
                          </Button>
                        </div>
                        
                        <ScrollArea className="border rounded-md bg-background h-[100px]">
                          <pre className="p-3 text-xs font-mono whitespace-pre-wrap">
                            {testCase.input || <span className="text-muted-foreground italic">Empty input</span>}
                          </pre>
                        </ScrollArea>
                      </div>
                      
                      {/* Output Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Expected Output</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            asChild
                          >
                            <a
                              href={`${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/testcases/download?name=${problemId}&test_case_index=${testCase.index}&type=output`}
                              download
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </a>
                          </Button>
                        </div>
                        
                        <ScrollArea className="border rounded-md bg-background h-[100px]">
                          <pre className="p-3 text-xs font-mono whitespace-pre-wrap">
                            {testCase.output || <span className="text-muted-foreground italic">Empty output</span>}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end mt-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 border-destructive/30"
                            disabled={isDeleting === index}
                          >
                            {isDeleting === index ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Deleting...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </span>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Test Case #{index + 1}</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this test case? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(testCase.index)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}