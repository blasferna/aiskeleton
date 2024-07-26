"use client";

import CodeMirror from "@/components/codemirror";
import { useToast } from "@/components/ui/use-toast";
import { EditorTheme } from "@/types";
import { useCompletion } from "ai/react";
import {
  CheckCircleIcon,
  Code,
  Copy,
  Eye,
  LoaderCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
      console.log(error);
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
                  setActiveTab("code");
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
              <div className="w-full h-full rounded-md overflow-auto">
                <CodeMirror
                  code={htmlCode}
                  editorTheme={EditorTheme.DRACULA}
                  onCodeChange={(code) => {
                    setHtmlCode(code);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden rounded-none border border-gray-700 border-b-0 border-r-0 border-l-0 lg:border-t">
            <div className="flex flex-row items-center justify-between space-y-0 pt-4 pb-0 px-4">
              <div className="bg-gray-800 rounded-md p-1 inline-flex">
                <button
                  className={`px-3 py-1 text-sm flex items-center gap-2 rounded ${
                    activeTab === "preview"
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  className={`px-3 py-1 text-sm flex items-center gap-2 rounded ${
                    activeTab === "code"
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("code")}
                >
                  <Code className="w-4 h-4" />
                  Code
                </button>
              </div>
              <button
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-50 font-medium text-sm py-2 px-4 rounded inline-flex items-center transition-colors duration-200 ease-in-out"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopyLabel("Copied!");
                  setTimeout(() => setCopyLabel("Copy"), 3000);
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
              {activeTab === "preview" ? (
                <div className="w-full h-full p-4 bg-[#2d2f3f] rounded-md overflow-auto">
                  <Previewer code={code} />
                </div>
              ) : (
                <div className="w-full h-full rounded-md overflow-auto">
                  <CodeMirror
                    code={code}
                    editorTheme={EditorTheme.DRACULA}
                    onCodeChange={(code) => {}}
                    editable={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Previewer = ({ code }: { code: string }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeDocument = (iframeRef.current as HTMLIFrameElement | null)
      ?.contentDocument;
    if (!iframeDocument) return;
    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        ${code}
      </body>
      </html>
    `);
    iframeDocument.close();
  }, [code]);

  return (
    <div className="text-center text-gray-500 dark:text-gray-400 h-full">
      <iframe ref={iframeRef} className="w-full h-full border-0"></iframe>
    </div>
  );
};
