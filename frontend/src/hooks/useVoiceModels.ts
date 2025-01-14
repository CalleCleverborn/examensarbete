import { useEffect, useState } from "react";

export interface VoiceModel {
  id: number;
  title: string;
  tags: string;
  imageUrl?: string;
}

export interface PageMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

interface UseVoiceModelsResult {
  voiceModels: VoiceModel[];
  pageMeta: PageMeta | null;
  page: number;
  setPage: (page: number) => void;
  loadingModels: boolean;
}

export function useVoiceModels(shouldFetch: boolean = true): UseVoiceModelsResult {
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    const fetchVoiceModels = async () => {
      setLoadingModels(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          perPage: "8",
          order: "asc",
        });

        const res = await fetch(
          `https://backend-qrwq.onrender.com/api/transformations/voice-models?${query}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch voice models. Status: ${res.status}`);
        }

        const json = await res.json();
        const mapped = (json.data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          tags: item.tags,
          imageUrl: item.imageUrl,
        }));
        setVoiceModels(mapped);

        if (json.meta) {
          setPageMeta({
            currentPage: json.meta.currentPage,
            lastPage: json.meta.lastPage,
            perPage: json.meta.perPage,
            total: json.meta.total,
          });
        } else {
          setPageMeta(null);
        }
      } catch (error) {
        console.error("Error fetching voice models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchVoiceModels();
  }, [page, shouldFetch]);

  return {
    voiceModels,
    pageMeta,
    page,
    setPage,
    loadingModels,
  };
}
