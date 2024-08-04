"use client";

import { useEffect, useRef } from "react";
import React from "react";
import { FileSearch } from 'lucide-react';

interface PreviewerProps {
  code: string;
}

const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-center p-8 max-w-lg bg-gray-800 rounded-lg border border-gray-700">
        <FileSearch size={64} className="text-blue-400 mb-6 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          No Skeletons Yet
        </h2>
        <p className="text-gray-300 mb-6">
          This is where your AI-generated skeletons will appear. Let&apos;s get started!
        </p>
        <div className="space-y-4 mb-6">
          <Step number={1} text="Paste your code in the left panel" />
          <Step number={2} text='Click the "Generate" button' />
          <Step number={3} text="Watch your skeleton come to life here!" />
        </div>
        <p className="text-gray-400 text-sm italic bg-gray-700 p-3 rounded">
          Pro tip: The generator works best with Tailwind CSS classes. 
        </p>
      </div>
    </div>
  );
};

const Step: React.FC<{ number: number; text: string }> = ({ number, text }) => (
  <div className="flex items-center text-left">
    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-gray-100 rounded-full flex items-center justify-center font-bold mr-3">
      {number}
    </div>
    <p className="text-gray-300">{text}</p>
  </div>
);

const Previewer: React.FC<PreviewerProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeDocument = iframeRef.current?.contentDocument;
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
    <div className="h-full">
      {code ? (
        <iframe ref={iframeRef} className="w-full h-full border-0"></iframe>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Previewer;