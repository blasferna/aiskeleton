"use client";

import CodeInput from "@/components/code-input";
import { GitHubIcon } from "@/components/icons";
import ResultOutput from "@/components/result-output";
import TabSwitcher from "@/components/tab-switcher";
import { useToast } from "@/components/ui/use-toast";
import { htmlToJsx } from "@/lib/utils";
import { useCompletion } from "ai/react";
import { CheckCircleIcon, Copy, LoaderCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function SkeletonGenerator() {
  const [activeTab, setActiveTab] = useState("preview");
  const [htmlCode, setHtmlCode] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const { toast } = useToast();

  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/generate-skeleton",
    onFinish: () => setActiveTab("preview"),
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  }, [error]);

  const code = completion.replace(/^```html\n/, "").replace(/\n```$/, "");

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-50">
            Skeleton Generator
          </h1>
          <a
            href="https://github.com/blasferna/aiskeleton"
            target="_blank"
            rel="noopener"
            className="text-gray-300 hover:text-gray-50"
          >
            <GitHubIcon />
          </a>
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden bg-gray-900">
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden rounded-none border-t lg:border-r border-gray-700">
            <div className="flex flex-row items-center justify-between space-y-0 pt-4 pb-0 px-4">
              <div className="text-lg font-bold text-gray-50">
                Paste Your HTML Code
              </div>
              <button
                className={`
                  bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded 
                  inline-flex items-center transition-colors duration-200 ease-in-out
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={async () => {
                  setActiveTab("html");
                  await complete(htmlCode);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                    Generating
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>
            </div>
            <div className="flex-grow p-4 overflow-hidden">
              <CodeInput
                code={htmlCode}
                onCodeChange={(code) => setHtmlCode(code)}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden rounded-none border border-gray-700 border-b-0 border-r-0 border-l-0 lg:border-t">
            <div className="flex flex-row items-center justify-between space-y-0 pt-4 pb-0 px-4">
              <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
              <button
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-50 font-medium text-sm py-2 px-4 rounded inline-flex items-center transition-colors duration-200 ease-in-out"
                onClick={() => {
                  navigator.clipboard.writeText(
                    activeTab === "html" ? code : htmlToJsx(code)
                  );
                  setCopyLabel("Copied!");
                  setTimeout(() => setCopyLabel("Copy"), 1500);
                }}
              >
                {copyLabel === "Copied!" ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copyLabel}
              </button>
            </div>
            <div className="flex-grow p-4 overflow-hidden">
              <ResultOutput
                activeTab={activeTab}
                code={code}
                onCodeChange={(code) => {}}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
