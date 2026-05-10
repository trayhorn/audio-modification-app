import { useState, useEffect } from "react";
import "./App.css";
import UploadForm from "./components/UploadForm/UploadForm.jsx";
import AudioMenu from "./components/AudioMenu/AudioMenu.tsx";
import { uploadAudioReq } from "./api.ts";

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioId, setAudioId] = useState<string>('');

  const handleSetAudioFile = (audioFile: File) => {
    setAudioFile(audioFile);
  };

  useEffect(() => {
    const uploadFile = async () => {
      if(!audioFile) return;

      const formData = new FormData();
      formData.append("audioFile", audioFile);
      console.log(audioFile);
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
      <section>
        <UploadForm handleFormChange={handleSetAudioFile} />
      </section>
      {audioFile && <AudioMenu file={audioFile} />}
    </>
  );
}

export default App;
