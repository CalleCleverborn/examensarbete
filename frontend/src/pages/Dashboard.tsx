import { useEffect, useState } from "react";

interface Transformation {
  _id: string;
  status: string;
  jobId: number;
}

interface TransformationsResponse {
  data: Transformation[];
}

interface User {
  name?: string;
  email?: string;
  subscriptionPlan?: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/transformations", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch transformations. Status: ${res.status}`
          );
        }

        const json: TransformationsResponse = await res.json();
        setTransformations(json.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransformations();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("soundFile", selectedFile);
    formData.append("voiceModelId", "2");

    try {
      const res = await fetch("http://localhost:4000/api/transformations", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to create transformation. Status: ${res.status}`
        );
      }

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
