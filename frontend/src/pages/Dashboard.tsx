import React, { useState, useEffect } from "react";
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
    usedTransformations?: number;
  };
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  conversionsPerMonth: number;
  voiceModelLimit: number;
  downloadTime: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const { voiceModels, pageMeta, page, setPage, loadingModels } =
    useVoiceModels();
  const { latestTransformation, loadingTransform, handleTransform } =
    useTransformations();

  const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.subscriptionPlan) return;
      try {
        setLoadingPlan(true);
        const res = await fetch("http://localhost:4000/api/plans", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch plans: ${res.status}`);
        }
        const allPlans: Plan[] = await res.json();
        const foundPlan = allPlans.find(
          (p) => p.name === user.subscriptionPlan
        );
        if (foundPlan) setPlan(foundPlan);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [user]);

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

  if (!user) {
    return;
  }

  return (
    <div className="dashboard-page">
      <div className="plan-info">
        {loadingPlan ? (
          <div className="dashboard-message">Loading your plan info...</div>
        ) : plan ? (
          <>
            {plan.conversionsPerMonth === 99999 ? (
              <>
                <p>
                  You are on the <strong>{plan.name}</strong> plan with
                  unlimited conversions.
                </p>
                <p>
                  Conversions used:{" "}
                  <strong>{user.usedTransformations || 0}</strong>
                </p>
              </>
            ) : (
              <>
                <p>
                  You are on the <strong>{plan.name}</strong> plan.
                </p>
                <p>
                  Conversions used:{" "}
                  <strong>{user.usedTransformations || 0}</strong> /{" "}
                  <strong>{plan.conversionsPerMonth}</strong>
                </p>
              </>
            )}
          </>
        ) : (
          <div className="dashboard-message">
            Could not find your plan details.
          </div>
        )}
      </div>

      <div className="transformation-wrapper">
        <FileDropBox
          selectedFile={selectedFile}
          onFileSelected={(file) => setSelectedFile(file)}
        />
        <div className="button-info-box">
          {" "}
          <div
            className="transform-button"
            onClick={!loadingTransform ? handleTransformClick : undefined}
            style={{ cursor: loadingTransform ? "not-allowed" : "pointer" }}
          >
            {loadingTransform ? "Transforming..." : "3.Transform"}
          </div>
        </div>

        <div className="file-output-box">
          <OutputBox status={status} outputFileUrl={outputFileUrl} />
        </div>
      </div>

      <div className="model-list-wrapper">
        <h3>2.Select Vocal Model</h3>
        <div className="model-list">
          {loadingModels ? (
            Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="model-skeleton" />
            ))
          ) : voiceModels.length === 0 ? (
            <p className="dashboard-message">No voice models found.</p>
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
