import { useEffect, useState } from "react";

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

interface UseTransformations {
  latestTransformation: Transformation | null;
  loadingTransform: boolean;
  handleTransform: (selectedFile: File, voiceModelId: number) => Promise<void>;
  transformations: Transformation[];
  loadingList: boolean;
  errorList: string | null;
  fetchAllTransformations: () => Promise<Transformation[]>;
  deleteTransformation: (id: string) => Promise<void>;
}

export function useTransformations(): UseTransformations {
  const [latestTransformation, setLatestTransformation] =
    useState<Transformation | null>(null);
  const [loadingTransform, setLoadingTransform] = useState(false);

  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState<string | null>(null);


  useEffect(() => {
    if (!latestTransformation) return;

    if (latestTransformation.status !== "success") {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(
            `http://localhost:4000/api/transformations/${latestTransformation._id}`,
            { credentials: "include" }
          );
          if (!res.ok) return;
          const updated = await res.json();
          setLatestTransformation(updated);

          if (updated.status !== "running") {
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Error polling transformation:", err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [latestTransformation]);

  async function handleTransform(selectedFile: File, voiceModelId: number) {
    setLoadingTransform(true);
    try {
      const formData = new FormData();
      formData.append("soundFile", selectedFile);
      formData.append("voiceModelId", String(voiceModelId));

      const res = await fetch("http://localhost:4000/api/transformations", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to create transformation job.");
      }

      const newTransformation: Transformation = await res.json();
      setLatestTransformation(newTransformation);
    } catch (err) {
      console.error("Error in handleTransform:", err);
      alert("Failed to transform. Check console for details.");
    } finally {
      setLoadingTransform(false);
    }
  }

 
  async function fetchAllTransformations(): Promise<Transformation[]> {
    setLoadingList(true);
    setErrorList(null);
    try {
      const res = await fetch("http://localhost:4000/api/transformations", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch transformations. Status: ${res.status}`
        );
      }
      const json = await res.json();
      const data = json.data || [];
      setTransformations(data);
      return data; 
    } catch (err: any) {
      console.error("Error fetching transformations:", err);
      setErrorList(err.message || "Failed to fetch transformations.");
      return [];
    } finally {
      setLoadingList(false);
    }
  }

  async function deleteTransformation(id: string): Promise<void> {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transformation?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/transformations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Delete failed with status: ${res.status}`);
      }
      setTransformations((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting transformation:", err);
      alert("Failed to delete transformation.");
    }
  }

  return {
    latestTransformation,
    loadingTransform,
    handleTransform,
    transformations,
    loadingList,
    errorList,
    fetchAllTransformations,
    deleteTransformation,
  };
}
