"use client";

import { useState } from "react";
import { ITranslateRequest, ITranslateResponse } from "@sff/shared-types";

const URL = "https://322mas5z70.execute-api.ap-southeast-1.amazonaws.com/prod/";

async function translateText({
  inputLang,
  outputLang,
  inputText,
}: {
  inputLang: string;
  outputLang: string;
  inputText: string;
}) {
  try {
    const request: ITranslateRequest = {
      sourceLang: inputLang,
      targetLang: outputLang,
      sourceText: inputText,
    };

    const result = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(request),
    });

    const returnValue = (await result.json()) as ITranslateResponse;
    return returnValue;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await translateText({
            inputText,
            inputLang,
            outputLang,
          });
          setOutputText(result);
        }}
      >
        <div className="flex flex-col">
          <label htmlFor="inputText" className="mb-1 font-medium text-gray-700">
            Input Text
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none w-full"
            rows={4}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="inputLang" className="mb-1 font-medium text-gray-700">
            Input Language
          </label>
          <input
            id="inputLang"
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="outputLang"
            className="mb-1 font-medium text-gray-700"
          >
            Output Language
          </label>
          <input
            id="outputLang"
            value={outputLang}
            onChange={(e) => setOutputLang(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
        >
          Translate
        </button>

        {outputText && (
          <div className="flex flex-col">
            <label
              htmlFor="outputLang"
              className="mb-1 font-medium text-gray-700"
            >
              Output Text
            </label>
            <textarea
              readOnly
              id="outputLang"
              value={JSON.stringify(outputText, null, 2)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none w-full"
              rows={6}
            />
          </div>
        )}
      </form>
    </main>
  );
}
