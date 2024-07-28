import CodeMirror from "@/components/codemirror";
import { htmlToJsx } from "@/lib/utils";
import { EditorLanguage, EditorTheme } from "@/types";
import React from "react";
import Previewer from "./previewer";

interface ResultOutputProps {
  activeTab: string;
  code: string;
  onCodeChange: (code: string) => void;
}

const ResultOutput: React.FC<ResultOutputProps> = ({
  activeTab,
  code,
  onCodeChange = () => {},
}) => {
  return (
    <React.Fragment>
      {activeTab === "preview" ? (
        <div
          className={`w-full h-full overflow-auto ${
            code && "p-4 bg-white rounded-md"
          }`}
        >
          <Previewer code={code} />
        </div>
      ) : (
        <div className="w-full h-full rounded-md overflow-auto">
          <CodeMirror
            code={activeTab === "html" ? code : htmlToJsx(code, "Skeleton")}
            editorTheme={EditorTheme.DRACULA}
            onCodeChange={onCodeChange}
            editable={false}
            language={
              activeTab === "html"
                ? EditorLanguage.HTML
                : EditorLanguage.JAVASCRIPT
            }
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ResultOutput;
