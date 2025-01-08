import React, { useEffect } from "react";
import { useTransformations } from "../hooks/useTransformations";
import { useVoiceModels } from "../hooks/useVoiceModels";
import "./_MyTransformations.scss";

const MyTransformations: React.FC = () => {
  const {
    transformations,
    loadingList,
    errorList,
    fetchAllTransformations,
    deleteTransformation,
  } = useTransformations();

  const { voiceModels, loadingModels } = useVoiceModels();

  useEffect(() => {
    fetchAllTransformations();
  }, []);

  if (loadingList || loadingModels) {
    return <p>Loading transformations...</p>;
  }

  if (errorList) {
    return <p style={{ color: "red" }}>{errorList}</p>;
  }

  if (transformations.length === 0) {
    return <p>No transformations found.</p>;
  }

  return (
    <div className="transformation-list">
      {transformations.map((t) => {
        const fileName =
          t.originalFilename && t.originalFilename.trim() !== ""
            ? t.originalFilename
            : "Unknown file";

        let modelName = "Unknown model";
        if (t.voiceModelId) {
          const found = voiceModels.find((vm) => vm.id === t.voiceModelId);
          if (found && found.title.trim() !== "") {
            modelName = found.title;
          }
        }

        const dateStr = t.jobStartTime
          ? new Date(t.jobStartTime).toLocaleDateString()
          : "";

        const statusClass = t.status.toLowerCase();

        return (
          <div key={t._id} className="transformation-item">
            <div className="left-section">
              <div className="original-file">{fileName}</div>
              <div className="voice-model-id">Model: {modelName}</div>
              <div className="date-and-status">
                <span className={`status ${statusClass}`}>{t.status}</span>
                {dateStr && (
                  <span className="job-start-time"> | {dateStr}</span>
                )}
              </div>
            </div>

            <div className="right-section">
              {t.status === "success" && t.outputFileUrl ? (
                <audio className="audio-preview" controls src={t.outputFileUrl}>
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="fallback-info">
                  {t.status === "running"
                    ? "Processing..."
                    : t.status === "failed"
                      ? "Failed"
                      : "No preview"}
                </div>
              )}

              <button
                className="delete-button"
                onClick={() => deleteTransformation(t._id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyTransformations;
