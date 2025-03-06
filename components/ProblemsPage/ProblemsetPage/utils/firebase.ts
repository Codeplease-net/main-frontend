"use client";
import { db } from "@/api/Readfirebase";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Problem, ProblemFilters } from "../types/interfaces";


export async function getProblems(filters?: ProblemFilters): Promise<{
    problems: Problem[];
    total: number;
    notFound?: boolean;
  }> {
    try {
      let q = collection(db, "problems");
      let constraints = [];
  
      // Build query constraints based on filters
      if (filters) {
        if (filters.categories && filters.categories.length > 0) {
          filters.categories.forEach((category) => {
            constraints.push(where(`categories.${category}`, "==", true));
          });
        }
  
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          constraints.push(
            where("searchableTitle", "array-contains", searchTerm)
          );
        }
      }
  
      // Get total count first
      const countQuery = constraints.length > 0 ? query(q, ...constraints) : q;
      const totalSnapshot = await getDocs(countQuery);
      const total = totalSnapshot.size;
  
      // Add pagination constraints
      if (filters?.limit) {
        if (filters?.page == 1) {
          constraints.push(limit(filters.limit));
        } else if (filters?.page !== undefined) {
          const lastVisibleRef = query(
            q,
            ...constraints,
            limit((filters.page - 1) * filters.limit)
          );
          const lastVisibleSnapshot = await getDocs(lastVisibleRef);
          const lastVisible =
            lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
  
          // Then use startAfter with the last document
          if (lastVisible) {
            constraints.push(startAfter(lastVisible));
          }
  
          // Finally add the limit
          constraints.push(limit(filters.limit));
        }
      }
  
      // Apply all constraints
      const queryRef = constraints.length > 0 ? query(q, ...constraints) : q;
      const problemsSnapshot = await getDocs(queryRef);
  
      if (problemsSnapshot.empty) {
        return { problems: [], total: 0 };
      }
  
      const problems = problemsSnapshot.docs.map((document) => {
        const data = document.data();
        const categoriesObj = data.categories || {};
        const activeCategories = Object.entries(categoriesObj)
          .filter(([_, isActive]) => isActive === true)
          .map(([category]) => category);
        return {
          id: document.id,
          status: data.status,
          displayTitle: data.displayTitle,
          categories: activeCategories,
          difficulty: data.difficulty,
        };
      });
  
      return { problems, total };
    } catch (error) {
      console.error("Error fetching problems from Firestore:", error);
      return { problems: [], total: 0, notFound: true };
    }
  }
  