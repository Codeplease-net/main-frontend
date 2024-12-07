"use client";

import { useState } from "react";
import { StringStoreInFirebase } from "./StringStoreInFirebase";
import { RenderMathJaxText } from "../ui/RenderMathJaxText";
import { encryptText } from "@/api/toStoreInFirebase";

export default function PolygonProgram() {
  const [descriptionValue, setDescriptionValue] = useState("");
  const [codeText, setCodeText] = useState("");

  const onChangeScript = (event: any) => {
    setDescriptionValue(event.target.value);
  };

  const onChangeCode = (event: any) =>{
    setCodeText(event.target.value)
  }

  return (
    <div className="flex w-full h-full p-4">
      <div className="flex-1 overflow-auto p-4">
        <div className="font-bold">Description: </div>
        <textarea
          className="text-black w-full p-2 mt-4"
          style={{height: '20rem'}}
          value={descriptionValue}
          onChange={onChangeScript}
        />
        <div className="font-bold">Code: </div>
        <textarea
          className="text-black w-full p-2 mt-4"
          style={{height: '12rem'}}
          value={codeText}
          onChange={onChangeCode}
        />
      </div>
      <div className="flex-1 p-4" >
        <div className="font-bold">Results: </div>
        <div className="overflow-auto mt-2" style={{height: '35rem'}}>
            <RenderMathJaxText content={descriptionValue}/>
            <StringStoreInFirebase description="Description in Firebase" text={encryptText(descriptionValue)}/>
            <StringStoreInFirebase description="Code in Firebase" text={encryptText(codeText)}/>
        </div>
      </div>
    </div>
  );
}
