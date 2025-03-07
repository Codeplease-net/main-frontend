import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { FileUp, ZapIcon, FolderOpen } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
    inputFile: null as File | null,
    outputFile: null as File | null,
    score: 0,
  });

  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [batchTestCases, setBatchTestCases] = useState<Array<{
    input: string, 
    output: string, 
    inputFile: File | null,
    outputFile: File | null,
    score: number
  }>>([]);

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
      form.append("test_case_index", index.toString());

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

  const addToBatch = () => {
    // Validate current test case
    if ((!newTestCase.input && !newTestCase.inputFile) || 
        (!newTestCase.output && !newTestCase.outputFile)) {
      toast({
        title: "Incomplete test case",
        description: "Both input and output are required for test cases",
        variant: "destructive",
      });
      return;
    }
    
    // Add to batch
    setBatchTestCases([...batchTestCases, { ...newTestCase }]);
    
    // Reset form for next test case
    setNewTestCase({
      input: "",
      output: "",
      inputFile: null,
      outputFile: null,
      score: newTestCase.score, // Keep the same score for convenience
    });
    
    toast({
      title: "Added to batch",
      description: `Test case added to batch (${batchTestCases.length + 1} total)`,
    });
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have a batch or single test case
    const hasBatch = batchTestCases.length > 0;
    
    // If we have a batch but the current form also has data, ask to add it
    if (hasBatch && (newTestCase.input || newTestCase.output || 
        newTestCase.inputFile || newTestCase.outputFile)) {
      // Ask if user wants to include the current form in the batch
      if (confirm("Would you like to add the current test case to the batch before uploading?")) {
        addToBatch();
      }
    }
    
    // If we're uploading a single test case with no batch
    if (!hasBatch) {
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
    } 
    // If we have a batch to upload
    else {
      setIsUploadingBulk(true);
      
      try {
        // Upload each test case in sequence
        for (let i = 0; i < batchTestCases.length; i++) {
          const testCase = batchTestCases[i];
          
          const form = new FormData();
          form.append("name", problemId);
          
          // Input file handling
          if (testCase.inputFile) {
            form.append("input_file", testCase.inputFile);
          } else if (testCase.input) {
            const inputBlob = new Blob([testCase.input], { type: 'text/plain' });
            const inputFile = new File([inputBlob], 'input.txt', { type: 'text/plain' });
            form.append("input_file", inputFile);
          }
          
          // Output file handling
          if (testCase.outputFile) {
            form.append("output_file", testCase.outputFile);
          } else if (testCase.output) {
            const outputBlob = new Blob([testCase.output], { type: 'text/plain' });
            const outputFile = new File([outputBlob], 'output.txt', { type: 'text/plain' });
            form.append("output_file", outputFile);
          }
          
          form.append("score", testCase.score.toString());
          
          await axios.post(
            `${process.env.NEXT_PUBLIC_JUDGE0_API_KEY}/testcases/add`,
            form
          );
          
          // Update progress toast
          toast({
            title: "Progress",
            description: `Uploaded test case ${i + 1} of ${batchTestCases.length}`,
          });
        }
        
        toast({
          title: "Success",
          description: `Successfully uploaded ${batchTestCases.length} test cases`,
        });
        
        // Reset form and close dialog
        setBatchTestCases([]);
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
        console.error("Error adding test cases:", error);
        toast({
          title: "Error",
          description: "Failed to add test cases",
          variant: "destructive",
        });
      } finally {
        setIsUploadingBulk(false);
      }
    }
  };

  const removeBatchTestCase = (index: number) => {
    const updated = [...batchTestCases];
    updated.splice(index, 1);
    setBatchTestCases(updated);
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
        <div className="flex items-center">
          <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
              // When closing dialog, clear the batch
              setBatchTestCases([]);
            }
            setOpen(isOpen);
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Test Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Test Cases</DialogTitle>
                <DialogDescription>
                  Create one or multiple test cases with input, output and score.
                </DialogDescription>
              </DialogHeader>
              
              <form className="space-y-6" onSubmit={handleAddTest}>
                {/* Current Test Case Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">
                      {batchTestCases.length > 0 ? "Add Another Test Case" : "New Test Case"}
                    </h3>
                    {batchTestCases.length > 0 && (
                      <Badge variant="secondary" className="font-mono">
                        {batchTestCases.length} in batch
                      </Badge>
                    )}
                  </div>
                  
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
                          disabled={isAddingTestCase || isUploadingBulk}
                        />
                        <div className="my-2 text-center text-xs text-muted-foreground">— OR —</div>
                      </div>
                      
                      <Textarea
                        id="input"
                        placeholder="Enter test case input..."
                        value={newTestCase.input}
                        onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                        className="font-mono min-h-[140px]"
                        disabled={isAddingTestCase || isUploadingBulk}
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
                          disabled={isAddingTestCase || isUploadingBulk}
                        />
                        <div className="my-2 text-center text-xs text-muted-foreground">— OR —</div>
                      </div>
                      
                      <Textarea
                        id="output"
                        placeholder="Enter expected output..."
                        value={newTestCase.output}
                        onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
                        className="font-mono min-h-[140px]"
                        disabled={isAddingTestCase || isUploadingBulk}
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
                            disabled={isAddingTestCase || isUploadingBulk}
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
                            disabled={isAddingTestCase || isUploadingBulk}
                          />
                          <span className="absolute right-3 text-xs text-muted-foreground">points</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add to Batch Button */}
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addToBatch}
                      disabled={isAddingTestCase || isUploadingBulk || 
                        (!newTestCase.input && !newTestCase.inputFile) || 
                        (!newTestCase.output && !newTestCase.outputFile)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Batch
                    </Button>
                  </div>
                </div>
                
                {/* Batch Preview Section */}
                {batchTestCases.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium">Batch Test Cases ({batchTestCases.length})</h3>
                      {batchTestCases.length > 3 && (
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          Scroll to see all {batchTestCases.length} test cases
                        </span>
                      )}
                    </div>
                    
                    <div className="border rounded-md">
                      <div className="max-h-[300px] overflow-auto">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-card shadow-sm z-10">
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-medium">#</th>
                              <th className="text-left py-2 px-3 font-medium">Input Preview</th>
                              <th className="text-left py-2 px-3 font-medium">Output Preview</th>
                              <th className="text-left py-2 px-3 font-medium">Score</th>
                              <th className="text-right py-2 px-3 font-medium">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {batchTestCases.map((testCase, index) => (
                              <tr key={index} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                                <td className="py-2 px-3">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                    {index + 1}
                                  </div>
                                </td>
                                <td className="py-2 px-3">
                                  <div className="max-w-[150px] truncate font-mono text-xs">
                                    {testCase.inputFile ? 
                                      `[File] ${testCase.inputFile.name}` : 
                                      (testCase.input || "(empty)")}
                                  </div>
                                </td>
                                <td className="py-2 px-3">
                                  <div className="max-w-[150px] truncate font-mono text-xs">
                                    {testCase.outputFile ? 
                                      `[File] ${testCase.outputFile.name}` : 
                                      (testCase.output || "(empty)")}
                                  </div>
                                </td>
                                <td className="py-2 px-3">
                                  <Badge variant="outline" className="font-mono">
                                    {testCase.score}
                                  </Badge>
                                </td>
                                <td className="py-2 px-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeBatchTestCase(index)}
                                    disabled={isUploadingBulk}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Batch summary footer */}
                      <div className="bg-muted/20 p-3 border-t flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Total: {batchTestCases.length} test case{batchTestCases.length !== 1 && 's'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setBatchTestCases([])}
                          disabled={isUploadingBulk}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter className="pt-2">
                  {batchTestCases.length > 0 ? (
                    <Button 
                      type="submit" 
                      disabled={isAddingTestCase || isUploadingBulk}
                    >
                      {isUploadingBulk ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading {batchTestCases.length} test cases...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Upload {batchTestCases.length} Test Cases
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isAddingTestCase || 
                        (!newTestCase.input && !newTestCase.inputFile) || 
                        (!newTestCase.output && !newTestCase.outputFile)}
                    >
                      {isAddingTestCase ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        "Create Test Case"
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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