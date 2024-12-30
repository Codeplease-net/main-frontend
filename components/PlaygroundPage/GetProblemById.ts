import { db } from "@/api/Readfirebase";
import { doc, getDoc } from "firebase/firestore";
export  async function fetchProblemById(id: string) {
    try {
      const docRef = doc(db, "problems", id);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data())
      if (docSnap.exists()) 
        return docSnap.data();
      console.log("No Documents Found !")
      return null;
    } catch (error) {
      console.error("Error fetching document: ", error);
      return null;
    }
  };