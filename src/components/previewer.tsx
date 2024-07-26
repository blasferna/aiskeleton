"use client";

import { useEffect, useRef } from "react";
import React from "react";

interface PreviewerProps {
  code: string;
}

const Previewer: React.FC<PreviewerProps> = ({ code }) => {
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

export default Previewer;
