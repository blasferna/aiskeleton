"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCompletion } from "ai/react";
import {
  Code,
  Copy,
  Eye,
  Settings,
  LoaderCircle,
  CheckCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import CodeMirror from "@/components/codemirror";
import { EditorTheme } from "@/types";

export default function SkeletonGenerator() {
  const [activeTab, setActiveTab] = useState("preview");
  const [htmlCode, setHtmlCode] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");
  const { toast } = useToast();


  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate-skeleton",
    onFinish: () => setActiveTab("preview"),
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  const code = completion.replace(/^```html\n/, "").replace(/\n```$/, "");

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Skeleton Generator
          </h1>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden">
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <Card className="flex-1 m-2 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
              <CardTitle className="text-xl font-bold">
                Paste Your HTML Code
              </CardTitle>
              <Button
                size="sm"
                onClick={async () => {
                  setActiveTab("code");
                  await complete(htmlCode);
                }}
                {...(isLoading ? { disabled: true } : {})}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                    Generating
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-grow p-2 overflow-hidden">

                <div className="w-full h-full rounded-md overflow-auto">
                  <CodeMirror code={htmlCode} editorTheme={EditorTheme.ESPRESSO} onCodeChange={(code) => { setHtmlCode(code) }} />
                  </div>

            </CardContent>
          </Card>

          <Card className="flex-1 m-2 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
              <div className="flex space-x-1">
                <Button
                  variant={activeTab === "preview" ? "default" : "secondary"}
                  onClick={() => setActiveTab("preview")}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button
                  variant={activeTab === "code" ? "default" : "secondary"}
                  onClick={() => setActiveTab("code")}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Code className="w-4 h-4" />
                  Code
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopyLabel("Copied!");
                  setTimeout(() => setCopyLabel("Copy"), 3000);
                }}
              >
                {copyLabel === "Copied!" ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}

                {copyLabel}
              </Button>
            </CardHeader>
            <CardContent className="flex-grow p-2 overflow-hidden">
              
                {activeTab === "preview" ? (
                  <div className="w-full h-full p-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto">
                  <Previewer code={code} />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-md overflow-auto">
                  <CodeMirror code={code} editorTheme={EditorTheme.ESPRESSO} onCodeChange={(code) => {}} />
                  </div>
                )}
              
            </CardContent>
          </Card>
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
