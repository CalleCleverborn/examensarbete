import React, { useEffect, useState } from "react";
import { useTransformations } from "../hooks/useTransformations";
import { useVoiceModels } from "../hooks/useVoiceModels";
import "./_MyTransformations.scss";

import TransformationItem from "../components/TransformationItem";

const MyTransformations: React.FC = () => {
  const {
    transformations,
    loadingList,
    errorList,
    fetchAllTransformations,
    deleteTransformation,
  } = useTransformations();

  const [needVoiceModels, setNeedVoiceModels] = useState(false);

  const { voiceModels, loadingModels } = useVoiceModels(needVoiceModels);

  useEffect(() => {
    const doFetch = async () => {
      await fetchAllTransformations();

      const missingName = transformations.some(
        (t) => !t.voiceModelName || t.voiceModelName.trim() === ""
      );
      if (missingName) {
        setNeedVoiceModels(true);
      }
    };
    doFetch();
  }, []);

  if (loadingList || (needVoiceModels && loadingModels)) {
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
      {transformations.map((t) => (
        <TransformationItem
          key={t._id}
          transformation={t}
          onDelete={deleteTransformation}
          voiceModels={voiceModels}
        />
      ))}
    </div>
  );
};

export default MyTransformations;
