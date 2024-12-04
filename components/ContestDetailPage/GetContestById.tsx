import { db } from "@/api/Readfirebase";
import { doc, getDoc } from "firebase/firestore";
export default async function fetchContestById(id: number) {
    try {
      const docRef = doc(db, "contests", id.toString());
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