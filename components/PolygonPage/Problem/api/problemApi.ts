import { db } from "@/api/Readfirebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Problem, defaultProblem } from "../types/problem";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchProblemById(id: string): Promise<ApiResponse<Problem>> {
  try {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { error: `Problem ${id} not found` };
    }

    const data = docSnap.data();
    return {
        data: {
            id: docSnap.id,
            displayTitle: data.displayTitle || "",
            category: data.category || "",
            difficulty: data.difficulty || 0,
            content: {
                title: data.title || defaultProblem.content.title,
                description: data.description || defaultProblem.content.description,
                solution: data.solution || defaultProblem.content.solution,
            },
        },
    };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return { error: "Failed to fetch problem" };
  }
}

export async function updateProblem(
  id: string,
  updates: Partial<Problem>
): Promise<ApiResponse<void>> {
  try {
    const docRef = doc(db, "problems", id);
    const updateData = {
      ...(updates.displayTitle && { displayTitle: updates.displayTitle }),
      ...(updates.category && { category: updates.category }),
      ...(updates.difficulty !== undefined && { difficulty: updates.difficulty }),
      ...(updates.content?.title && { title: updates.content.title }),
      ...(updates.content?.description && { description: updates.content.description }),
      ...(updates.content?.solution && { solution: updates.content.solution }),
    };

    await updateDoc(docRef, updateData);
    return {};
  } catch (error) {
    console.error("Error updating problem:", error);
    return { error: "Failed to update problem" };
  }
}

export async function checkProblemExists(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking problem existence:", error);
    return false;
  }
}