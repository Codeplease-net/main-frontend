import { db } from "@/api/Readfirebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { fetchProblemById, fetchProblemTextById } from "../PlaygroundPage/GetProblemById";
import { decryptText } from "@/api/toStoreInFirebase";

export function splitString(str: string) {
    const pattern = /\{([^{}]*)\}/g;

    let matches = [];
    let match;
    while ((match = pattern.exec(str)) !== null) matches.push(match[0]);

    matches = matches.map(text => text.slice(1, -1))
    return matches
}


function getRandomNumber(n: number): number {
  return Math.floor(Math.random() * n) + 1;
}

export const checkExist = async (str: string) => {
  try {
    const subcollectionRef = doc(db, 'problems', str);
    const querySnapshot = await getDoc(subcollectionRef);
    return querySnapshot.exists();
  } catch (error) {
    console.error('Error fetching subcollection count:', error);
  }
}

export const searchProblem = async(locale: string, problemId: string, setInternationalTitle: (value: string) => void, setDifficulty: (value: number) => void, setTitle: (value: string) => void, setTags: (value: string) => void, setDescriptionValue: (value: string) => void, setSolutionValue: (value: string) => void, setCodeText: (value: string) => void) => {
  try {
    const result = await fetchProblemById(parseInt(problemId));
        const description = await fetchProblemTextById(parseInt(problemId), "description", locale);
        const localeTitle = await fetchProblemTextById(parseInt(problemId), "title", locale);
        const solutionDescription = await fetchProblemTextById(parseInt(problemId), "solution", locale);
        const sampleCode = await fetchProblemTextById(parseInt(problemId), "solution", "code");
        if (!result) {
          throw new Error("Fetched data is not an array");
        }
        // const problem = {
        //   id: parseInt(problemId),
        //   title: title,
        //   category: result.category,
        //   difficulty: result.difficulty,
        //   acceptance: result.acceptance,
        //   status: result.status,
        //   description: description,
        //   solutionDescription: solutionDescription,
        //   sampleCode
        // };
        setInternationalTitle(result.title)
        setDifficulty(result.difficulty)
        setTitle(localeTitle)
        setTags(result.category)
        setDescriptionValue(decryptText(description))
        setSolutionValue(decryptText(solutionDescription))
        setCodeText(decryptText(sampleCode))

      console.log("Fetch successfully !")
  } catch (error) {
    console.log(error)
  }
}

export const getNewIndex = async () => {
  let ret: string = getRandomNumber(1e4).toString();
  while (await checkExist(ret)) 
    ret = getRandomNumber(1e4).toString();
  return ret;
};

export const insertProblem = async (problemId: string) => {
  try {
    if (problemId == "") problemId = await getNewIndex();
    // Reference to the main collection
    const docRef = doc(collection(db, "problems"), problemId);

    // Define the document data
    const mainDocData = {
      acceptance: 0,
      category: "math",
      difficulty: 1,
      title: "Math Problem",
    };

    // Set the main document
    await setDoc(docRef, mainDocData);

    // Add subcollections (description, solution, title)
    await setDoc(doc(collection(docRef, "text"), "description"), {
      "en": "",
      "de": "",
      "vi": "",
      "ko": "",
      "zh-CN": ""
    });
    await setDoc(doc(collection(docRef, "text"), "solution"), {
        "en": "",
        "de": "",
        "vi": "",
        "ko": "",
        "zh-CN": "",
        "code": ""
      });
    await setDoc(doc(collection(docRef, "text"), "title"),{
        "en": "",
        "de": "",
        "vi": "",
        "ko": "",
        "zh-CN": "",
        "code": ""
      });

    alert("Document successfully written!");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
