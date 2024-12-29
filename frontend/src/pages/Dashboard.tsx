import "../styles/_Dashboard.scss";

export const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <header>
        <h1>VocalFlow</h1>
        <nav>
          <ul>
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="#">Plan</a>
            </li>
            <li>
              <a href="#">Logout</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="content-wrapper">
        <div className="transformation-wrapper">
          <div className="file-drop-box">
            1.Drop Vocal Here (mp3, wav, flac)
          </div>
          <div className="transform-button">3.Transform</div>
          <div className="file-output-box">Output</div>
        </div>
        <div className="model-list-wrapper">
          <h3>2.Select Vocal Model</h3>
          <div className="model-list">
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
            <div className="model">
              <h2>Sandra</h2>
              <p>
                This voice is perfect for upgrading low quality vocals, making
                compelling pop demos or just hearing what you would sound like
                as a pop star.
              </p>
              <img></img>
            </div>
          </div>
          <div className="page-numbers">
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// interface VoiceModel {
//   id: number;
//   name: string;
//   description: string;
// }

// interface Transformation {
//   _id: string;
//   status: string;
//   jobId: number;
//   outputFileUrl?: string;
// }

// interface User {
//   name?: string;
//   email?: string;
//   subscriptionPlan?: string;
// }

// interface DashboardProps {
//   user: User;
// }

// const Dashboard: React.FC<DashboardProps> = ({ user }) => {
//   const [transformations, setTransformations] = useState<Transformation[]>([]);
//   const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
//   const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(
//     null
//   );
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchVoiceModels = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:4000/api/transformations/voice-models",
//           {
//             credentials: "include",
//           }
//         );

//         if (!res.ok)
//           throw new Error(
//             `Failed to fetch voice models. Status: ${res.status}`
//           );

//         const json = await res.json();
//         const mappedModels: VoiceModel[] = json.data.map((model: any) => ({
//           id: model.id,
//           name: model.title,
//           description: model.tags ? model.tags.join(", ") : "",
//         }));

//         setVoiceModels(mappedModels);
//       } catch (error) {
//         console.error("Error fetching voice models:", error);
//       }
//     };

//     const fetchTransformations = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/transformations", {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch transformations");
//         const json = await res.json();
//         setTransformations(json.data || []);
//       } catch (error) {
//         console.error("Error fetching transformations:", error);
//         setTransformations([]);
//       }
//     };

//     fetchVoiceModels();
//     fetchTransformations();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       for (const t of transformations) {
//         if (t.status !== "success") {
//           try {
//             const res = await fetch(
//               `http://localhost:4000/api/transformations/${t._id}`,
//               {
//                 credentials: "include",
//               }
//             );
//             if (res.ok) {
//               const updated = await res.json();
//               setTransformations((prev) =>
//                 prev.map((item) => (item._id === updated._id ? updated : item))
//               );
//             }
//           } catch (error) {
//             console.error("Error updating transformation:", error);
//           }
//         }
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [transformations]);

//   const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) setSelectedFile(file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !selectedVoiceModel) {
//       alert("Please select a file and a voice model.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("soundFile", selectedFile);
//     formData.append("voiceModelId", selectedVoiceModel.toString());

//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:4000/api/transformations", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error("Failed to upload file.");

//       const result: Transformation = await res.json();
//       setTransformations((prev) => [result, ...prev]);
//     } catch (error) {
//       console.error("Error during upload:", error);
//       alert("Failed to upload and transform the file. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1>Welcome, {user.name || "User"}!</h1>

//       <div className="controls">
//         {/* Voice Model Selection */}
//         <select
//           onChange={(e) => setSelectedVoiceModel(Number(e.target.value))}
//           value={selectedVoiceModel || ""}
//           className="voice-models"
//         >
//           <option value="" disabled>
//             {voiceModels.length === 0
//               ? "No Voice Models Available"
//               : "Select a Voice Model"}
//           </option>
//           {voiceModels.map((model) => (
//             <option key={model.id} value={model.id}>
//               {model.name} - {model.description}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="drag-drop-area">
//         {/* Drag-and-Drop Box */}
//         <div
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleFileDrop}
//           className="drag-box"
//         >
//           {selectedFile ? (
//             <p>{selectedFile.name}</p>
//           ) : (
//             <p>Drag and drop a file here</p>
//           )}
//         </div>

//         {/* Download Section */}
//         <div className="download-box">
//           <h2>Download Latest Transformed File</h2>
//           {loading && (
//             <p>
//               Processing... <span className="spinner">⏳</span>
//             </p>
//           )}
//           {transformations.length > 0 &&
//           transformations[0].status === "success" &&
//           transformations[0].outputFileUrl ? (
//             <a
//               href={transformations[0].outputFileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Download File
//             </a>
//           ) : (
//             <p>No recent transformations available yet.</p>
//           )}
//         </div>
//       </div>

//       <button
//         onClick={handleUpload}
//         disabled={!selectedFile || !selectedVoiceModel || loading}
//         className="upload-button"
//       >
//         {loading ? "Uploading..." : "Upload and Transform"}
//       </button>

//       <div className="transformation-list">
//         <h2>All Transformations</h2>
//         {transformations.map((t) => (
//           <div key={t._id} className="transformation-item">
//             <p>ID: {t._id}</p>
//             <p>Status: {t.status}</p>
//             {t.outputFileUrl && (
//               <a
//                 href={t.outputFileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Download
//               </a>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

export default Dashboard;
