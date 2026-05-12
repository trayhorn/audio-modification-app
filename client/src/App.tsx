import { useState, useEffect } from "react";
import "./App.css";
import UploadForm from "./components/UploadForm/UploadForm.jsx";
import AudioMenu from "./components/AudioMenu/AudioMenu.tsx";
import { uploadAudioReq, modifyPitchReq } from "./api.ts";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.tsx";

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioId, setAudioId] = useState<string>('');
  const [modifiedFile, setModifiedFile] = useState<File | null>(null);

  const handleSetAudioFile = (audioFile: File) => {
    setAudioFile(audioFile);
  };

  const handleModifyPitch = async (pitch: number) => {
    try {
      const file = await modifyPitchReq(audioId, pitch);
      if(!file) throw Error('No file');
      setModifiedFile(file);
    } catch (error) {
      console.log(error);
    }
  }

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
      {audioFile && <AudioMenu file={audioFile} modifyPitch={handleModifyPitch} />}
      {modifiedFile && <AudioPlayer file={modifiedFile} />}
    </>
  );
}

export default App;
