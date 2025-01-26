import { db } from "@/api/Readfirebase";
import { doc, getDoc } from "firebase/firestore";
export  async function fetchProblemById(id: string) {
    try {
      const docRef = doc(db, "problems", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) 
        return docSnap.data();
      console.log("No Documents Found !")
      return null;
    } catch (error) {
      console.error("Error fetching document: ", error);
      return null;
    }
  };

  export async function fetchSubmissionsById(id: number) {
    const docRef = doc(db, "submissions", id.toString());
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
