"use server"

import { db } from "@/api/Readfirebase";
import { collection, getDocs } from "firebase/firestore";

interface Problem {
    id: string;
    status: 'completed' | 'not-started';
    displayTitle: any;
    category: string;
    difficulty: number;
    acceptance: number;
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
        id: document.id, // Use the Firestore document ID as the 'id'
        status: data.status,
        displayTitle: data.displayTitle,
        category: data.category,
        difficulty: data.difficulty,
        acceptance: ((data.totalSubmissions != undefined && data.totalSubmissions > 0) ? data.acceptedSubmissions / data.totalSubmissions : 0) * 100,
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
