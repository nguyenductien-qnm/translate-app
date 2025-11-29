import React from "react";
import { Github, Code2, Server, Database, Zap } from "lucide-react";

export default function TranslationHeader() {
  return (
    <div className="w-full max-w-7xl mb-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10">
          {/* Header with GitHub link */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                🌐 Translation App
                <span className="text-lg font-normal bg-white/20 px-3 py-1 rounded-full text-sm">
                  v1.0
                </span>
              </h1>
              <p className="text-blue-100 text-lg">
                Crafted with 💻 by{" "}
                <span className="font-semibold text-white">NguyenDucTien</span>
              </p>
            </div>

            {/* GitHub Button */}
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

          {/* Tech Stack with Icons */}
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

          {/* Bottom section */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <p className="text-sm text-blue-200 italic flex items-center gap-2">
              <span>✨</span>A small project with big learning
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
  );
}
