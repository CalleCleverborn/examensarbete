import React from "react";
import { VoiceModel } from "../hooks/useVoiceModels";
import "./_ModelCard.scss";

interface ModelCardProps {
  model: VoiceModel;
  isSelected: boolean;
  onSelect: () => void;
  imageLoaded: boolean;
  onImageLoad: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected,
  onSelect,
  imageLoaded,
  onImageLoad,
}) => {
  return (
    <div
      className={`model ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
      style={{ position: "relative" }}
    >
      <h2>{model.title}</h2>
      <p>{model.tags}</p>

      {!imageLoaded && <div className="avatar-skeleton" />}

      <img
        className="avatar"
        src={model.imageUrl}
        alt={model.title}
        loading="lazy"
        onLoad={onImageLoad}
      />
    </div>
  );
};

export default ModelCard;
