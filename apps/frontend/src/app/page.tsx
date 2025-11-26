"use client";

import { useState } from "react";

const URL = "https://322mas5z70.execute-api.ap-southeast-1.amazonaws.com/prod/";

function translateText({
  inputLang,
  outputLang,
  inputText,
}: {
  inputLang: string;
  outputLang: string;
  inputText: string;
}) {
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      sourceLang: inputLang,
      targetLang: outputLang,
      text: inputText,
    }),
  })
    .then((result) => result.json())
    .catch((e) => e.toString());
}

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<any>(null);
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
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
          setOutputText(result.TranslatedText);
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

        {outputText && outputText?.trim() != "" && (
          <div className="flex flex-col">
            <label
              htmlFor="outputLang"
              className="mb-1 font-medium text-gray-700"
            >
              Output Text
            </label>
            <input
              readOnly
              id="outputLang"
              value={outputText}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
        )}
      </form>
    </main>
  );
}
