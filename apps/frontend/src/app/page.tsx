"use client";
import React, { useState } from "react";
import {
  Github,
  Code2,
  Server,
  Database,
  Zap,
  Languages,
  History,
  Send,
  RefreshCw,
  Sparkles,
  Delete,
} from "lucide-react";
import {
  ITranslateDBObject,
  ITranslateRequest,
  ITranslateResponse,
} from "@sff/shared-types";
import { useRouter } from "next/navigation";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

const URL = "https://api.nguyenductien.cloud";

export default function TranslationApp() {
  const [inputText, setInputText] = useState<string>("");
  const [inputLang, setInputLang] = useState<string>("en");
  const [outputLang, setOutputLang] = useState<string>("vi");

  // outputText ban đầu null → dùng union type
  const [outputText, setOutputText] = useState<ITranslateResponse | null>(null);

  // all là mảng của ITranslateDBObject
  const [all, setAll] = useState<ITranslateDBObject[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // API functions
  const userTranslateText = async ({
    inputText,
    inputLang,
    outputLang,
  }: {
    inputText: string;
    inputLang: string;
    outputLang: string;
  }): Promise<ITranslateResponse> => {
    try {
      const request: ITranslateRequest = {
        sourceLang: inputLang,
        targetLang: outputLang,
        sourceText: inputText,
      };

      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      console.log("authToken::", authToken);

      const result = await fetch(`${URL}/user`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const returnValue: ITranslateResponse = await result.json();
      return returnValue;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const translateText = async ({
    inputText,
    inputLang,
    outputLang,
  }: {
    inputText: string;
    inputLang: string;
    outputLang: string;
  }): Promise<ITranslateResponse> => {
    try {
      const request: ITranslateRequest = {
        sourceLang: inputLang,
        targetLang: outputLang,
        sourceText: inputText,
      };

      const result = await fetch(`${URL}/public`, {
        method: "POST",
        body: JSON.stringify(request),
      });

      const returnValue: ITranslateResponse = await result.json();
      return returnValue;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getTranslations = async (): Promise<ITranslateDBObject[]> => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

      const result = await fetch(`${URL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const rtnData: ITranslateDBObject[] = await result.json();
      return rtnData;
    } catch (e) {
      console.error("❌ getTranslations error:", e);
      throw e;
    }
  };

  const deleteTranslation = async (item: ITranslateDBObject) => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

      const result = await fetch(`${URL}/user`, {
        method: "DELETE",
        body: JSON.stringify({
          username: item.username,
          requestId: item.requestId,
        }),
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (result.status === 200)
        setAll((prev) => prev.filter((i) => i.requestId != item.requestId));
    } catch (e) {
      console.error("❌ getTranslations error:", e);
      throw e;
    }
  };

  const convertToClientTime = (timestamp: number | string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTranslate = async () => {
    setIsLoading(true);

    let user = null;
    try {
      user = await getCurrentUser();
    } catch {
      console.log("not authenticated");
    }

    try {
      let result = null;
      if (user) {
        result = await userTranslateText({
          inputText,
          inputLang,
          outputLang,
        });
      } else {
        result = await translateText({
          inputText,
          inputLang,
          outputLang,
        });
      }

      setOutputText(result);

      if (all.length > 0) {
        const data = await getTranslations();
        setAll(data);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getTranslations();
      setAll(data);
    } catch (error) {
      console.error("Failed to get history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="w-full max-w-7xl mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                  🌐 Translation App
                  <span className="text-lg font-normal bg-white/20 px-3 py-1 rounded-full text-sm">
                    v1.0
                  </span>
                  <button
                    onClick={() => {
                      router.push("/user");
                    }}
                    className="btn"
                  >
                    UserPage
                  </button>
                </h1>

                <p className="text-blue-100 text-lg">
                  Crafted with 💻 by{" "}
                  <span className="font-semibold text-white">
                    NguyenDucTien
                  </span>
                </p>
              </div>

              <a
                href="https://github.com/nguyenductien-qnm/translate-app.git"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30 group"
              >
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-semibold">View on GitHub</span>
              </a>
            </div>

            <p className="text-blue-100 mb-6 text-base">
              A serverless mini project to explore cloud architecture and API
              development using AWS CDK.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold text-sm">Serverless</span>
                </div>
                <p className="text-xs text-blue-100">Event-driven</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4" />
                  <span className="font-semibold text-sm">AWS Lambda</span>
                </div>
                <p className="text-xs text-blue-100">Compute</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-1">
                  <Server className="w-4 h-4" />
                  <span className="font-semibold text-sm">API Gateway</span>
                </div>
                <p className="text-xs text-blue-100">REST API</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="font-semibold text-sm">DynamoDB</span>
                </div>
                <p className="text-xs text-blue-100">NoSQL DB</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4" />
                  <span className="font-semibold text-sm">AWS CDK</span>
                </div>
                <p className="text-xs text-blue-100">IaC</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <p className="text-sm text-blue-200 italic flex items-center gap-2">
                <Sparkles className="w-4 h-4" />A small project with big
                learning
                <span>🚀</span>
              </p>
              <div className="flex gap-2">
                <span className="bg-green-500/30 px-3 py-1 rounded-full text-xs font-semibold border border-green-400/50">
                  Active
                </span>
                <span className="bg-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/50">
                  Learning Project
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {all.length === 0 ? (
        <div className="w-full max-w-2xl">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-3">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Start Translating
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your text and select languages
              </p>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="inputText"
                className="mb-2 font-semibold text-gray-700 flex items-center gap-2"
              >
                <span>Input Text</span>
                <span className="text-xs text-gray-400 font-normal">
                  (required)
                </span>
              </label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none w-full min-h-[140px] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="inputLang"
                  className="mb-2 font-semibold text-gray-700"
                >
                  From
                </label>
                <input
                  id="inputLang"
                  value={inputLang}
                  onChange={(e) => setInputLang(e.target.value)}
                  placeholder="e.g., en"
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="outputLang"
                  className="mb-2 font-semibold text-gray-700"
                >
                  To
                </label>
                <input
                  id="outputLang"
                  value={outputLang}
                  onChange={(e) => setOutputLang(e.target.value)}
                  placeholder="e.g., vi"
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Translate
                  </>
                )}
              </button>

              <button
                onClick={handleGetHistory}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <History className="w-5 h-5" />
                View History
              </button>
            </div>

            {outputText && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Translation Result
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {outputText.targetText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl flex gap-6">
          {/* Left Column - Form */}
          <div className="flex-1 max-w-[40%]">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6 sticky top-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-2">
                  <Languages className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  New Translation
                </h2>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="inputText2"
                  className="mb-2 font-semibold text-gray-700"
                >
                  Input Text
                </label>
                <textarea
                  id="inputText2"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none w-full min-h-[120px] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label
                    htmlFor="inputLang2"
                    className="mb-2 font-semibold text-gray-700 text-sm"
                  >
                    From
                  </label>
                  <input
                    id="inputLang2"
                    value={inputLang}
                    onChange={(e) => setInputLang(e.target.value)}
                    placeholder="e.g., en"
                    className="border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="outputLang2"
                    className="mb-2 font-semibold text-gray-700 text-sm"
                  >
                    To
                  </label>
                  <input
                    id="outputLang2"
                    value={outputLang}
                    onChange={(e) => setOutputLang(e.target.value)}
                    placeholder="e.g., vi"
                    className="border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 w-full font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Translate
                  </>
                )}
              </button>

              <button
                onClick={handleGetHistory}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 w-full font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh History
              </button>

              {outputText && (
                <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-gray-800">Latest Result</h3>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <p className="text-gray-800 leading-relaxed">
                      {outputText.targetText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - History */}
          <div className="flex-1 max-w-[60%]">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 h-[calc(100vh-200px)] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Translation History
                    </h2>
                    <p className="text-sm text-gray-500">
                      {all.length} translations saved
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                {all.map((item, index) => (
                  <div
                    key={index}
                    className="group p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm border border-gray-200">
                          {item.sourceLang} → {item.targetLang}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-medium">
                          {convertToClientTime(item.timestamp)}
                        </span>
                        <span className="text-xs text-red-500 font-medium">
                          <Delete onClick={() => deleteTranslation(item)} />
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                          Original
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {item.sourceText}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-lg text-white shadow-md">
                        <p className="text-xs font-bold mb-1 uppercase tracking-wide opacity-90">
                          Translated
                        </p>
                        <p className="font-medium leading-relaxed">
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
