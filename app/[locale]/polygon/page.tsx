"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PolygonProgram from "@/components/PolygonPage/Problem/Polygon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/api/Readfirebase";

async function createEmptyProblem(id: string) {
  const docRef = doc(collection(db, "problems"), id);
  await setDoc(docRef, {
    id,
    displayTitle: "",
    category: "",
    difficulty: 0,
    content: {
      title: { en: "", vi: "", "zh-CN": "" },
      description: { en: "", vi: "", "zh-CN": "" },
      solution: { en: "", vi: "", "zh-CN": "" }
    }
  });
}

export default function Polygon() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showInitialModal, setShowInitialModal] = useState(!searchParams.get("problem"));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProblemId, setNewProblemId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (id: string) => {
    router.push(`/polygon?problem=${id}`);
    setShowInitialModal(false);
  };

  const handleCreate = async () => {
    if (!newProblemId.trim()) return;
    setIsLoading(true);
    try {
      // Create new problem in Firebase
      await createEmptyProblem(newProblemId);
      router.push(`/polygon?problem=${newProblemId}`);
      setShowCreateModal(false);
      setShowInitialModal(false);
    } catch (error) {
      console.error("Error creating problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={showInitialModal} onOpenChange={setShowInitialModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to Polygon</DialogTitle>
            <DialogDescription>
              Choose what you want to do
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="w-full"
            >
              Create New Problem
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="w-full"
            >
              Search Existing Problem
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Problem</DialogTitle>
            <DialogDescription>
              Enter a unique identifier for your problem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="problem-id">Problem ID</Label>
              <Input
                id="problem-id"
                value={newProblemId}
                onChange={(e) => setNewProblemId(e.target.value)}
                placeholder="e.g., breed-counting"
              />
            </div>
            <Button onClick={handleCreate} disabled={isLoading}>
              Create Problem
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PolygonProgram />
    </>
  );
}