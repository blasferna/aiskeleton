import React from 'react';
import CodeMirror from "@/components/codemirror";
import { EditorTheme } from "@/types";

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange }) => {
  return (
    <div className="w-full h-full rounded-md overflow-auto">
    <CodeMirror
      code={code}
      editorTheme={EditorTheme.DRACULA}
      onCodeChange={onCodeChange}
    />
  </div>
  );
};

export default CodeInput;
