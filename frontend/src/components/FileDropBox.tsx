import React from "react";
import "./_FileDropBox.scss";

interface FileDropBoxProps {
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
}

const FileDropBox: React.FC<FileDropBoxProps> = ({
  selectedFile,
  onFileSelected,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div
      className="file-drop-box"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {selectedFile
        ? `Selected: ${selectedFile.name}`
        : "1.Drop Vocal Here (mp3, wav, flac)"}
    </div>
  );
};

export default FileDropBox;
