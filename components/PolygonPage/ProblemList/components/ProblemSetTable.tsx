import React, { useState } from "react";
import Link from "next/link";
import { 
  Loader2, 
  Trash2, 
  ExternalLink,
  Calendar, 
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/api/Readfirebase";
import { useToast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import axios from "axios";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRelativeTime = (timestamp: number): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diff = timestamp - now.getTime();
  
  // Convert to absolute values for comparison
  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  // Create appropriate signed values for formatting
  const sign = diff < 0 ? -1 : 1;
  
  if (days > 30) {
    return formatDate(timestamp);
  } else if (days > 0) {
    return rtf.format(sign * days, 'day');
  } else if (hours > 0) {
    return rtf.format(sign * hours, 'hour');
  } else if (minutes > 0) {
    return rtf.format(sign * minutes, 'minute');
  } else {
    return 'just now';
  }
};

interface Problem {
  id: string;
  owner: string;
  createdAt: number;
  numberOfTestCases: number;
  displayTitle?: string;
}

interface ProblemSetTableProps {
  showedproblems: Problem[];
  onDelete: () => void;
}

export default function ProblemSetTable({ showedproblems, onDelete }: ProblemSetTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (problemId: string) => {
    setIsDeleting(problemId);
    try {
      const form = new FormData();
      form.append('name', problemId);
      await axios.post(
        process.env.NEXT_PUBLIC_JUDGE0_API_KEY+"/problems/delete", 
        form
      );
      
      const problemRef = doc(db, "problems", problemId);
      await deleteDoc(problemRef);
      toast({
        title: "Problem deleted",
        description: "The problem has been successfully deleted.",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast({
        title: "Error",
        description: "Failed to delete the problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[40%]">Problem</TableHead>
            <TableHead className="w-[20%] hidden md:table-cell">Owner</TableHead>
            <TableHead className="w-[25%] hidden sm:table-cell">Created</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showedproblems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2 opacity-50" />
                  <p>No problems found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            showedproblems.map((problem) => (
              <TableRow
                key={problem.id}
                className={`group transition-colors hover:bg-muted/50`}
              >
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <Link
                      href={`/polygon/${problem.id}`}
                      className="font-medium hover:text-primary transition-colors flex items-center"
                    >
                      {problem.displayTitle || problem.id}
                      <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                    </Link>
                    {problem.displayTitle && (
                      <span className="text-xs text-muted-foreground mt-0.5">{problem.id}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3 hidden md:table-cell">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-xs font-medium">
                      {problem.owner.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{problem.owner}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 hidden sm:table-cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {getRelativeTime(problem.createdAt)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {formatDate(problem.createdAt)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 group-hover:opacity-100"
                      asChild
                    >
                      <Link href={`/polygon/${problem.id}`}>
                        Edit
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                          disabled={isDeleting === problem.id}
                        >
                          {isDeleting === problem.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete problem: {problem.displayTitle || problem.id}</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the problem and all associated test cases from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(problem.id);
                            }}
                          >
                            {isDeleting === problem.id ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                              </span>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}