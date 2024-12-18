import { useEffect, useState } from "react";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchTransformations = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transformations", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch transformations");
      const json: TransformationsResponse = await res.json();
      setTransformations(json.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    fetchTransformations();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("soundFile", selectedFile);
    formData.append("voiceModelId", "110784");

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
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
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
