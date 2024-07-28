import React from "react";
import CodeMirror from "@/components/codemirror";
import { EditorTheme } from "@/types";
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
        <div className={`w-full h-full overflow-auto ${code&&"p-4  bg-white rounded-md"}`}>
          <Previewer code={code} />
        </div>
      ) : (
        <div className="w-full h-full rounded-md overflow-auto">
          <CodeMirror
            code={code}
            editorTheme={EditorTheme.DRACULA}
            onCodeChange={onCodeChange}
            editable={false}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ResultOutput;
