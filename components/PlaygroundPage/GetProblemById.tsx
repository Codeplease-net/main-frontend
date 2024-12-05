import { db } from "@/api/Readfirebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
export  async function fetchProblemById(id: number) {
    try {
      const docRef = doc(db, "problems", id.toString());
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return null;
    }
  };
export async function fetchProblemTextById(id: number, tr: string, locale: string) {
    try {
      const docRef = doc(db, "problems", id.toString(), "text", tr);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.get(locale);
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return null;
    }
  };