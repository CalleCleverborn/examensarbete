import React from "react";
import "./_OutputBox.scss";
interface OutputBoxProps {
  status?: string;
  outputFileUrl?: string;
}

const OutputBox: React.FC<OutputBoxProps> = ({ status, outputFileUrl }) => {
  if (!status) {
    return <>Output</>;
  }

  if (status === "running") {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  if (status === "success" && outputFileUrl) {
    return (
      <a
        href={outputFileUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#eed202" }}
      >
        Download Result
      </a>
    );
  }

  if (status === "error") {
    return <>Failed to transform. Check logs.</>;
  }

  return <>Output (No link yet)</>;
};

export default OutputBox;
