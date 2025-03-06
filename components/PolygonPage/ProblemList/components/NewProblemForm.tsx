import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, AlertCircle, Check, HelpCircle, Loader2 } from "lucide-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/api/Readfirebase";
import { useToast } from "@/components/ui/use-toast";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { debounce } from "lodash";

interface NewProblemFormProps {
  onSuccess: () => void;
  children?: React.ReactNode;
}

function generateSearchableTerms(title: string): string[] {
  const terms = [];
  const normalizedTitle = title.toLowerCase();
  
  // Generate all possible substrings
  for (let i = 0; i < normalizedTitle.length; i++) {
    for (let j = i + 1; j <= normalizedTitle.length; j++) {
      terms.push(normalizedTitle.slice(i, j));
    }
  }
  
  return Array.from(new Set(terms)); // Remove duplicates
}

export function NewProblemForm({ onSuccess, children }: NewProblemFormProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const [uid, setUid] = useState("");
  
  // Form validation states
  const [problemId, setProblemId] = useState("");
  const [displayTitle, setDisplayTitle] = useState("");
  const [idError, setIdError] = useState<string | null>(null);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [idExists, setIdExists] = useState(false);
  
  // Validate problem ID format: lowercase letters and single hyphens only
  const validateProblemId = (id: string): boolean => {
    // Check if empty
    if (!id.trim()) {
      setIdError("Problem ID cannot be empty");
      return false;
    }
    
    // Check for invalid characters
    if (!/^[a-z-]+$/.test(id)) {
      setIdError("Only lowercase letters and hyphens are allowed");
      return false;
    }
    
    // Check for consecutive hyphens
    if (id.includes("--")) {
      setIdError("Consecutive hyphens (--) are not allowed");
      return false;
    }
    
    // Check for starting/ending with hyphen
    if (id.startsWith("-") || id.endsWith("-")) {
      setIdError("ID cannot start or end with a hyphen");
      return false;
    }
    
    // Check if ID already exists
    if (idExists) {
      setIdError("This ID is already in use");
      return false;
    }
    
    // All validations passed
    setIdError(null);
    return true;
  };

  // Debounced function to check if problem ID already exists
  const checkIdExists = useCallback(
    debounce(async (id: string) => {
      if (id && id.trim().length > 2 && !/^[a-z-]+$/.test(id) === false) {
        setIsCheckingId(true);
        try {
          const problemRef = doc(db, "problems", id);
          const problemDoc = await getDoc(problemRef);
          setIdExists(problemDoc.exists());
          if (problemDoc.exists()) {
            setIdError("This ID is already in use");
          }
        } catch (error) {
          console.error("Error checking ID:", error);
        } finally {
          setIsCheckingId(false);
        }
      }
    }, 500),
    []
  );

  const addProblemOnServer = async (problemId: string) => {
    const form = new FormData();
    form.append("name", problemId);
    form.append("time_limit", "1000");
    form.append("memory_limit", "256");
    form.append("short_name", problemId);
    form.append("type_of_judging", "AC");
    
    return axios.post(
      process.env.NEXT_PUBLIC_JUDGE0_API_KEY + "/problems/add",
      form
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!validateProblemId(problemId)) {
      return; // Stop submission if ID format is invalid
    }
    
    setLoading(true);

    try {
      // Double check if problem already exists
      const problemRef = doc(db, "problems", problemId);
      const problemDoc = await getDoc(problemRef);

      if (problemDoc.exists()) {
        toast({
          title: "Error",
          description: "A problem with this ID already exists",
          variant: "destructive",
        });
        setIdExists(true);
        setIdError("This ID is already in use");
        setLoading(false);
        return;
      }
      
      // Create problem on judge server
      await addProblemOnServer(problemId);

      const searchableTitle = generateSearchableTerms(displayTitle);

      // Create new problem in Firestore
      const newProblem = {
        owner: uid,
        createdAt: Date.now(),
        displayTitle: displayTitle,
        searchableTitle
      };

      await setDoc(problemRef, newProblem);
      toast({
        title: "Success",
        description: "Problem created successfully",
      });
      
      // Reset form
      setProblemId("");
      setDisplayTitle("");
      setIdExists(false);
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating problem:", error);
      toast({
        title: "Error",
        description: "Failed to create problem",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Run validation and ID existence check when the ID changes
  useEffect(() => {
    if (problemId) {
      const basicValid = validateProblemId(problemId);
      if (basicValid) {
        checkIdExists(problemId);
      }
    } else {
      setIdExists(false);
      setIdError(null);
    }
    
    // Cancel debounced checks on unmount
    return () => {
      checkIdExists.cancel();
    };
  }, [problemId, checkIdExists]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Problem
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Problem</DialogTitle>
          <DialogDescription>
            Add a new problem to the problem bank.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id" className="flex items-center justify-between">
              Problem ID
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format example: breed-counting, two-sum</p>
                    <p className="text-xs mt-1">Use lowercase letters and hyphens only.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <Input 
                id="id" 
                value={problemId}
                onChange={(e) => {
                  const value = e.target.value;
                  setProblemId(value);
                }}
                placeholder="breed-counting"
                className={idError ? "border-destructive pr-10" : ""}
                required 
              />
              {isCheckingId && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isCheckingId && problemId && !idError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
              )}
              {!isCheckingId && idError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
              )}
            </div>
            {idError && (
              <p className="text-xs text-destructive mt-1">{idError}</p>
            )}
            {idExists && (
              <p className="text-xs text-destructive mt-1">
                This ID is already in use. Please choose a different one.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Use kebab-case with lowercase letters and hyphens (e.g., breed-counting)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayTitle">Problem Title</Label>
            <Input 
              id="displayTitle" 
              value={displayTitle}
              onChange={(e) => setDisplayTitle(e.target.value)}
              placeholder="Two Sum"
              required 
            />
            <p className="text-xs text-muted-foreground">
              This will be the display name for your problem
            </p>
          </div>
          
          <div className="flex justify-center pt-2">
            <Button 
              type="submit" 
              disabled={loading || !!idError || isCheckingId || idExists || !problemId || !displayTitle}
              className="w-full"
            >
              {loading ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <span className="animate-pulse">•</span>
                </>
              ) : (
                "Create Problem"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}