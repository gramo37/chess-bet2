import React, { useState } from "react";
import { FiCopy } from "react-icons/fi"; // Import copy icon from react-icons
// import { Tooltip } from "@headlessui/react"; // Optional for tooltip

interface CopyToClipboardProps {
  id: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* <span className="text-sm font-medium">ID: {id}</span> */}
      <button
        onClick={handleCopy}
        className="flex items-center space-x-1 px-2 text-white focus:outline-none"
      >
        <FiCopy className="text-lg" />
        <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
};

export default CopyToClipboard;
