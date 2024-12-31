import React, { useState } from "react";
import { useVoiceModels } from "../hooks/useVoiceModels";
import { useTransformations } from "../hooks/useTransformations";
import ModelCard from "../components/ModelCard";
import Pagination from "../components/Pagination";
import OutputBox from "../components/OutputBox";
import FileDropBox from "../components/FileDropBox";
import type { VoiceModel } from "../hooks/useVoiceModels";

import "./_Dashboard.scss";
interface DashboardProps {
  user?: {
    name?: string;
    email?: string;
    subscriptionPlan?: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { voiceModels, pageMeta, page, setPage, loadingModels } =
    useVoiceModels();
  const { latestTransformation, loadingTransform, handleTransform } =
    useTransformations();

  const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  function handleImageLoad(modelId: number) {
    setImageLoaded((prev) => ({ ...prev, [modelId]: true }));
  }

  async function handleTransformClick() {
    if (!selectedFile || !selectedVoiceModel) {
      alert("Please select a file and a voice model first.");
      return;
    }
    await handleTransform(selectedFile, selectedVoiceModel);
  }

  const status = latestTransformation?.status;
  const outputFileUrl = latestTransformation?.outputFileUrl;
  const placeholderCount = 8;

  return (
    <div className="dashboard-page">
      <div className="transformation-wrapper">
        <FileDropBox
          selectedFile={selectedFile}
          onFileSelected={(file) => setSelectedFile(file)}
        />

        <div
          className="transform-button"
          onClick={!loadingTransform ? handleTransformClick : undefined}
          style={{ cursor: loadingTransform ? "not-allowed" : "pointer" }}
        >
          {loadingTransform ? "Transforming..." : "3.Transform"}
        </div>

        <div className="file-output-box">
          <OutputBox status={status} outputFileUrl={outputFileUrl} />
        </div>
      </div>

      <div className="model-list-wrapper">
        <h3>2.Select Vocal Model</h3>
        <div className="model-list">
          {loadingModels ? (
            Array.from({ length: placeholderCount }, (_, i) => (
              <div key={i} className="model-skeleton" />
            ))
          ) : voiceModels.length === 0 ? (
            <p style={{ color: "white" }}>No voice models found.</p>
          ) : (
            voiceModels.map((model: VoiceModel) => {
              const isSelected = model.id === selectedVoiceModel;
              const isImgLoaded = imageLoaded[model.id] === true;
              return (
                <ModelCard
                  key={model.id}
                  model={model}
                  isSelected={isSelected}
                  onSelect={() => setSelectedVoiceModel(model.id)}
                  imageLoaded={isImgLoaded}
                  onImageLoad={() => handleImageLoad(model.id)}
                />
              );
            })
          )}
        </div>

        {pageMeta && (
          <Pagination pageMeta={pageMeta} page={page} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
