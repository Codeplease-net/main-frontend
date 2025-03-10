import { doc, getDoc, updateDoc } from "firebase/firestore";
import { defaultProblem, Problem } from "../types/problem";
import { db } from "@/api/Readfirebase";

export async function fetchProblemById(id: string): Promise<any> {
  try {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { error: `Problem ${id} not found` };
    }

    const data = docSnap.data();
    // Convert categories object to array of active categories
    const categoriesObj = data.categories || {};
    const activeCategories = Object.entries(categoriesObj)
      .filter(([_, isActive]) => isActive === true)
      .map(([category]) => category);
    console.log("data.title", (data.title == null || data.title === "") ? defaultProblem.content.title : data.title,)
    return {
      data: {
        id: docSnap.id,
        displayTitle: data.displayTitle || "",
        categories: activeCategories, // Now returns array of active categories
        difficulty: data.difficulty || 0,
        content: {
          title: (data.title == null || data.title === "") ? defaultProblem.content.title : data.title,
          description: (data.description == null || data.description === "") ? defaultProblem.content.description : data.description,
          solution: (data.solution == null || data.solution === "") ? defaultProblem.content.solution : data.solution,        
        }
      }
    };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return { error: "Failed to fetch problem" };
  }
}

export async function updateProblem(
  id: string,
  updates: Partial<Problem>
): Promise<any> {
  try {
    const docRef = doc(db, "problems", id);
    
    // Convert categories array to object with boolean values
    const categoriesUpdate = updates.categories 
      ? updates.categories.reduce((acc, category) => ({
          ...acc,
          [category]: true
        }), {})
      : undefined;

    const updateData = {
      ...(updates.displayTitle && { displayTitle: updates.displayTitle }),
      ...(updates.categories && { categories: categoriesUpdate }),
      ...(updates.difficulty !== undefined && { difficulty: updates.difficulty }),
      ...(updates.content?.title && { title: updates.content.title }),
      ...(updates.content?.description && { description: updates.content.description }),
      ...(updates.content?.solution && { solution: updates.content.solution }),
      ...(updates.searchableTitle && { searchableTitle: updates.searchableTitle }),
    };

    await updateDoc(docRef, updateData);
    return {};
  } catch (error) {
    console.error("Error updating problem:", error);
    return { error: "Failed to update problem" };
  }
}

// ... rest of the code ...