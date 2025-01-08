import React, { useEffect, useState } from "react";

interface Transformation {
  _id: string;
  jobId: string;
  status: string;
  jobStartTime?: string;
  jobEndTime?: string;
  originalFileUrl?: string;
  outputFileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const MyTransformations: React.FC = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransformations = async () => {
      setLoading(true);
      setError(null);

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
        setTransformations(json.data || []);
      } catch (err: any) {
        console.error("Error fetching transformations:", err);
        setError(err.message || "Failed to fetch transformations");
      } finally {
        setLoading(false);
      }
    };

    fetchTransformations();
  }, []);

  return (
    <div>
      <h1>My Transformations</h1>

      {loading && <p>Loading transformations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && transformations.length === 0 && (
        <p>No transformations found.</p>
      )}

      {!loading && !error && transformations.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {transformations.map((t) => {
            const start = t.jobStartTime || t.createdAt;
            const startDate = start ? new Date(start) : null;

            return (
              <li
                key={t._id}
                style={{
                  margin: "15px 0",
                  border: "1px solid #444",
                  padding: "10px",
                }}
              >
                <p>
                  <strong>Status:</strong> {t.status}
                </p>
                <p>
                  <strong>Job Start:</strong>{" "}
                  {startDate ? startDate.toLocaleString() : "N/A"}
                </p>

                {t.outputFileUrl && t.status === "success" ? (
                  <p>
                    <strong>Output File:</strong>{" "}
                    <a href={t.outputFileUrl} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </p>
                ) : (
                  <p>
                    <strong>Output File:</strong> No output yet
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyTransformations;
