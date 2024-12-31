import { useEffect, useState } from "react";

interface Transformation {
  _id: string;
  jobId: number;
  status: string;
  outputFileUrl?: string;
}

export function useTransformations() {
  const [latestTransformation, setLatestTransformation] =
    useState<Transformation | null>(null);
  const [loadingTransform, setLoadingTransform] = useState(false);


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

  return {
    latestTransformation,
    loadingTransform,
    handleTransform,
  };
}
