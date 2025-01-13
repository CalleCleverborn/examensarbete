import React from "react";
import { VoiceModel } from "../hooks/useVoiceModels";
import CustomAudioPlayer from "./CustomAudioPlayer";
import "./_TransformationItem.scss";

interface Transformation {
  _id: string;
  jobId: number;
  status: string;
  outputFileUrl?: string;
  originalFilename?: string;
  voiceModelId?: number;
  voiceModelName?: string;
  jobStartTime?: string;
  jobEndTime?: string;
}

interface TransformationItemProps {
  transformation: Transformation;
  onDelete: (id: string) => Promise<void>;
  voiceModels: VoiceModel[];
}

const TransformationItem: React.FC<TransformationItemProps> = ({
  transformation,
  onDelete,
  voiceModels,
}) => {
  let modelName =
    transformation.voiceModelName && transformation.voiceModelName.trim() !== ""
      ? transformation.voiceModelName
      : "Unknown model";

  if (modelName === "Unknown model" && transformation.voiceModelId) {
    const found = voiceModels.find(
      (vm) => vm.id === transformation.voiceModelId
    );
    if (found && found.title.trim() !== "") {
      modelName = found.title;
    }
  }

  const fileName =
    transformation.originalFilename &&
    transformation.originalFilename.trim() !== ""
      ? transformation.originalFilename
      : "Unknown file";

  const dateStr = transformation.jobStartTime
    ? new Date(transformation.jobStartTime).toLocaleDateString()
    : "";

  const statusClass = transformation.status.toLowerCase();

  return (
    <div className="transformation-item">
      <div className="left-section">
        <div className="original-file">{fileName}</div>
        <div className="voice-model-id">Model: {modelName}</div>
        <div className="date-and-status">
          <span className={`status ${statusClass}`}>
            {transformation.status}
          </span>
          {dateStr && <span className="job-start-time"> | {dateStr}</span>}
        </div>
      </div>

      <div className="right-section">
        {transformation.status === "success" && transformation.outputFileUrl ? (
          <CustomAudioPlayer src={transformation.outputFileUrl} />
        ) : (
          <div className="fallback-info">
            {transformation.status === "running"
              ? "Processing..."
              : transformation.status === "failed"
                ? "Failed"
                : "No preview"}
          </div>
        )}

        <button
          className="delete-button"
          onClick={() => onDelete(transformation._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransformationItem;
