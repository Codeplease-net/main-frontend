"use client";

import { db } from "@/api/Readfirebase";
import { collection, getDocs } from "firebase/firestore";

interface Contest {
    id: number;
    name: string;
    date: string;
    duration: string;
  }

export default async function getContests(): Promise<Contest[] | { notFound: boolean }> {
    try {
        const contestsCollection = collection(db, "contests");
        const contestsSnapshot = await getDocs(contestsCollection);
    
        // Handle the case where no contests are found
        if (contestsSnapshot.empty) {
        return Promise.resolve({
            notFound: true
        });
        }
    
        // Map through the documents and return the required fields
        const contests: Contest[] = contestsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: parseInt(doc.id), // Use the Firestore document ID as the 'id'
            name: data.name,
            date: data.date,
            duration: data.duration,
        };
        });
    
        return contests;
    } catch (error) {
        console.error("Error fetching contests from Firestore:", error);
        return Promise.resolve({
        notFound: true
        });
    }}