"use server"

import { db } from "@/api/Readfirebase";
import { doc, collection, getDocs, getDoc, documentId } from "firebase/firestore";

interface Problem {
    id: number;
    status: 'completed' | 'not-started';
    title: any;
    category: string;
    difficulty: number;
    acceptance: number;
    description: string;
  }

export default async function getProblems(): Promise<Problem[] | { notFound: boolean }> {
  try {
    const problemsCollection = collection(db, "problems");
    const problemsSnapshot = await getDocs(problemsCollection);
    
    // Handle the case where no problems are found
    if (problemsSnapshot.empty) {
      return Promise.resolve({
        notFound: true
      });
    }

    // Map through the documents and return the required fields
    const problems: Problem[] = problemsSnapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: parseInt(document.id), // Use the Firestore document ID as the 'id'
        status: data.status,
        title: data.title,
        category: data.category,
        difficulty: data.difficulty,
        acceptance: data.acceptance,
        description: data.description,
      };
    });
    
    return problems;
  } catch (error) {
    console.error("Error fetching problems from Firestore:", error);
    return Promise.resolve({
      notFound: true
    });
  }
}
