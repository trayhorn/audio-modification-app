import { useState, useEffect } from "react";
import "./App.css";
import UploadForm from "./components/UploadForm/UploadForm.js";
import AudioMenu from "./components/AudioMenu/AudioMenu.tsx";
import { uploadAudioReq, modifyPitchReq } from "./api.ts";
import PitchControls from "./components/PitchControls/PitchControls.tsx";
import ProgressBar from "./components/ProgressBar/ProgressBar.tsx";

function App() {
  const [audioFile, setAudioFile] = useState<File[]>([]);
  const [audioId, setAudioId] = useState<string>("");
  const [modifiedFile, setModifiedFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<{
    out_time_ms: string;
    progress: string;
  } | null>(null);
  const [totalDurationMs, setTotalDurationMs] = useState<number>(0);

  const handleSetAudioFile = (audioFile: File) => {
    const url = URL.createObjectURL(audioFile);
    const audio = new Audio(url);

    audio.addEventListener("loadedmetadata", () => {
      setTotalDurationMs(audio.duration * 1_000_000);
      URL.revokeObjectURL(url);
    });
    setAudioFile([audioFile]);
  };

  const handleModifyPitch = async (pitch: number) => {
    if (pitch === 0) {
      alert("Please select a pitch value other than 0.");
      return;
    }
    try {
      setIsLoading(true);

      const eventSource = new EventSource(
        `http://localhost:3000/audio/progress:${audioId}`,
      );

      eventSource.onmessage = function (event) {
        const data = event.data;
        const progressData = Object.fromEntries(
          new URLSearchParams(data.split(",").join("&")),
        );
        setProgress(progressData);
        if (progressData.progress === "end") {
          eventSource.close();
          setProgress(null);
        }
      };

      eventSource.onerror = function (event) {
        console.log("Error occurred:", event);
      };

      const file = await modifyPitchReq(audioId, pitch);

      if (!file) throw Error("No file");
      setModifiedFile((prev) => [...prev, file]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (!audioFile.length) return;

      const formData = new FormData();
      formData.append("audioFile", audioFile[0]);
      try {
        const res = await uploadAudioReq(formData);
        setAudioId(res.audioId);
      } catch (e) {
        console.log(e);
      }
    };

    uploadFile();
  }, [audioFile]);

  return (
    <>
      <header>
        <h1>Audio Modification App</h1>
      </header>
      <UploadForm handleFormChange={handleSetAudioFile} />
      {audioFile.length > 0 && (
        <PitchControls modifyPitch={handleModifyPitch} reqPending={isLoading} />
      )}
      {audioFile.length > 0 && <AudioMenu files={audioFile} />}
      {modifiedFile.length > 0 && (
        <AudioMenu files={modifiedFile} isModified={true} />
      )}
      {progress && (
        <ProgressBar progress={progress} totalDurationMs={totalDurationMs} />
      )}
    </>
  );
}

export default App;
