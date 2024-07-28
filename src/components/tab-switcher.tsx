import { Code, Eye } from "lucide-react";
import React from "react";
import ReactIcon from "@/components/icons";

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-gray-800 rounded-md p-1 inline-flex">
      <button
        className={`px-3 py-1 text-sm flex items-center gap-2 rounded ${
          activeTab === "preview"
            ? "bg-gray-700 text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => onTabChange("preview")}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        className={`px-3 py-1 text-sm flex items-center gap-2 rounded ${
          activeTab === "html"
            ? "bg-gray-700 text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => onTabChange("html")}
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        className={`px-3 py-1 text-sm flex items-center gap-2 rounded ${
          activeTab === "react"
            ? "bg-gray-700 text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => onTabChange("react")}
      >
        <ReactIcon />
      </button>
    </div>
  );
};

export default TabSwitcher;
