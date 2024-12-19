import { useEffect, useState } from "react";

interface VoiceModel {
  id: number;
  name: string;
  description: string;
}

interface Transformation {
  _id: string;
  status: string;
  jobId: number;
  outputFileUrl?: string;
}

interface TransformationsResponse {
  data: Transformation[];
}

const Dashboard: React.FC = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
  const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchVoiceModels = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/transformations/voice-models",
        {
          credentials: "include",
        }
      );

      if (!res.ok)
        throw new Error(`Failed to fetch voice models. Status: ${res.status}`);

      const json = await res.json();
      const mappedModels: VoiceModel[] = json.data.map((model: any) => ({
        id: model.id,
        name: model.title,
        description: model.tags ? model.tags.join(", ") : "",
      }));

      setVoiceModels(mappedModels);
    } catch (error) {
      console.error("Error fetching voice models:", error);
    }
  };

  const fetchTransformations = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transformations", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch transformations");
      const json: TransformationsResponse = await res.json();
      setTransformations(json.data);
    } catch (error) {
      console.error("Error fetching transformations:", error);
    }
  };

  useEffect(() => {
    fetchVoiceModels();
    fetchTransformations();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      for (const t of transformations) {
        if (t.status !== "success") {
          try {
            const res = await fetch(
              `http://localhost:4000/api/transformations/${t._id}`,
              {
                credentials: "include",
              }
            );
            if (res.ok) {
              const updated = await res.json();
              setTransformations((prev) =>
                prev.map((item) => (item._id === updated._id ? updated : item))
              );
            }
          } catch (error) {
            console.error("Error updating transformation:", error);
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transformations]);

  const handleUpload = async () => {
    if (!selectedFile || !selectedVoiceModel) {
      alert("Please select a file and a voice model.");
      return;
    }

    const formData = new FormData();
    formData.append("soundFile", selectedFile);
    formData.append("voiceModelId", selectedVoiceModel.toString());

    try {
      const res = await fetch("http://localhost:4000/api/transformations", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create transformation");
      const result: Transformation = await res.json();
      setTransformations((prev) => [result, ...prev]);
    } catch (error) {
      console.error("Error creating transformation:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <select
        onChange={(e) => setSelectedVoiceModel(Number(e.target.value))}
        value={selectedVoiceModel || ""}
      >
        <option value="" disabled>
          Select a Voice Model
        </option>
        {voiceModels.length > 0 ? (
          voiceModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} - {model.description}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No models available
          </option>
        )}
      </select>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload and Transform</button>

      <h2>Your Transformations</h2>
      <ul>
        {transformations.map((t) => (
          <li key={t._id}>
            ID: {t._id}, Status: {t.status}, Job ID: {t.jobId}
            {t.status === "success" && t.outputFileUrl && (
              <div>
                <a
                  href={t.outputFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Converted File
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
