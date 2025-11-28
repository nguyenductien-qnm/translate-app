"use client";

import { useState } from "react";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";

const URL = "https://api.nguyenductien.cloud/";

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

async function getTranslations() {
  try {
    const result = await fetch(URL, { method: "GET" });
    const rtnData = (await result.json()) as Array<ITranslateDBObject>;
    return rtnData;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

function convertToClientTime(utcTime: string) {
  const date = new Date(utcTime);
  return date.toLocaleString();
}

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [inputLang, setInputLang] = useState<string>("");
  const [outputLang, setOutputLang] = useState<string>("");
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);
  const [all, setAll] = useState<
    Array<
      ITranslateResponse &
        ITranslateRequest & {
          timestamp: string;
        }
    >
  >([]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
      {/* Header */}
      <div className="w-full max-w-7xl mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-xl text-white">
          <h1 className="text-3xl font-extrabold mb-3">🌐 Translation App</h1>
          <p className="text-blue-100 mb-4">
            Crafted with 💻 by{" "}
            <span className="font-semibold">NguyenDucTien</span>. A serverless
            mini project to explore cloud architecture and API development.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
              Serverless
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
              Lambda
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
              API Gateway
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
              DynamoDB
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
              Learning Project
            </span>
          </div>
          <p className="mt-4 text-sm text-blue-200 italic">
            A small project with big learning 🚀
          </p>
        </div>
      </div>

      {all.length === 0 ? (
        <div className="w-full max-w-lg">
          <form
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
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
              <label
                htmlFor="inputText"
                className="mb-1 font-medium text-gray-700"
              >
                Input Text
              </label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none w-full min-h-[120px]"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="inputLang"
                className="mb-1 font-medium text-gray-700"
              >
                Input Language
              </label>
              <input
                id="inputLang"
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
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
                className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition-colors w-full font-medium"
            >
              Translate
            </button>

            <button
              type="button"
              onClick={async () => {
                const data = await getTranslations();
                setAll(data);
              }}
              className="bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition-colors w-full font-medium"
            >
              Get All Translations
            </button>

            {outputText && (
              <div className="flex flex-col mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Translation Result:
                </h3>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1 mt-2">
                    {outputText.targetText}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full max-w-7xl flex gap-6">
          {/* Cột trái - Form */}
          <div className="flex-1 max-w-[40%] h-[77vh]">
            <form
              className="bg-white p-6 rounded-lg shadow-md space-y-4 sticky top-6 h-full overflow-auto"
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
                <label
                  htmlFor="inputText"
                  className="mb-1 font-medium text-gray-700"
                >
                  Input Text
                </label>
                <textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none w-full min-h-[120px]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="inputLang"
                  className="mb-1 font-medium text-gray-700"
                >
                  Input Language
                </label>
                <input
                  id="inputLang"
                  value={inputLang}
                  onChange={(e) => setInputLang(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
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
                  className="border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition-colors w-full font-medium"
              >
                Translate
              </button>

              <button
                type="button"
                onClick={async () => {
                  const data = await getTranslations();
                  setAll(data);
                }}
                className="bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition-colors w-full font-medium"
              >
                Refresh Translations
              </button>

              {outputText && (
                <div className="flex flex-col mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Translation Result:
                  </h3>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1 mt-2">
                      {outputText.targetText}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Cột phải - History */}
          <div className="flex-1 max-w-[60%] h-[77vh]">
            <div className="bg-white p-6 rounded-lg shadow-md h-full overflow-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Translation History
              </h2>

              <div className="space-y-3">
                {all.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {item.sourceLang} → {item.targetLang}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {convertToClientTime(item.timestamp)}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Original:
                        </p>
                        <p className="text-gray-700">{item.sourceText}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Translated:
                        </p>
                        <p className="text-gray-900 font-medium">
                          {item.targetText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
