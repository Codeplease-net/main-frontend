import { db } from "@/api/Readfirebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { fetchProblemById } from "../PlaygroundPage/GetProblemById";
import { base_null, langProps, textLangProps } from "./Polygon";

export const checkExist = async (str: string) => {
  try {
    const subcollectionRef = doc(db, "problems", str);
    const querySnapshot = await getDoc(subcollectionRef);
    return querySnapshot.exists();
  } catch (error) {
    console.error("Error fetching subcollection count:", error);
  }
};

export const searchProblem = async (
  problemId: string
): Promise<(problemInformationProps & generalInformationProps) | false> => {
  try {
    let result = await fetchProblemById(problemId);
    if (!result) return false;

    return {
      problemId,
      ...result,
    } as problemInformationProps & generalInformationProps;
  } catch (error) {
    console.log(error);
    return false;
  }
};

type generalInformationProps = {
  problemId: string;
  displayTitle: string;
  category: string;
  difficulty: number;
};

type problemInformationProps = {
  title: textLangProps;
  description: textLangProps;
  solution: textLangProps;
};

export const createNewProblem = async ({
  problemId,
  displayTitle,
  category,
  difficulty,
}: generalInformationProps) => {
  const docRef = doc(collection(db, "problems"), problemId);
  try {
    await setDoc(docRef, {
      category,
      difficulty,
      displayTitle,
      description: base_null,
      solution: base_null,
      title: base_null,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateGeneral = async ({
  problemId,
  displayTitle,
  category,
  difficulty,
}: generalInformationProps) => {
  try {
    const docRef = doc(db, "problems", problemId);
    await updateDoc(docRef, {
      displayTitle,
      category,
      difficulty,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const updateDescription = async ({
  problemId,
  title,
  description,
  solution,
}: { lang: langProps; problemId: string } & problemInformationProps) => {
  try {
    const docRef = doc(collection(db, "problems"), problemId);
    await updateDoc(docRef, {
      title,
      description,
      solution,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
