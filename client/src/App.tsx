import { useState, useEffect } from "react";
import "./App.css";
import UploadForm from "./components/UploadForm/UploadForm.js";
import AudioMenu from "./components/AudioMenu/AudioMenu.tsx";
import { uploadAudioReq, modifyPitchReq } from "./api.ts";
import PitchControls from "./components/PitchControls/PitchControls.tsx";

function App() {
  const [audioFile, setAudioFile] = useState<File[]>([]);
  const [audioId, setAudioId] = useState<string>('');
  const [modifiedFile, setModifiedFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSetAudioFile = (audioFile: File) => {
    setAudioFile([audioFile]);
  };

  const handleModifyPitch = async (pitch: number) => {
    if(pitch === 0) {
      alert('Please select a pitch value other than 0.');
      return;
    }
    try {
      setIsLoading(true);
      const file = await modifyPitchReq(audioId, pitch);
      if(!file) throw Error('No file');
      setModifiedFile((prev) => [...prev, file]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const uploadFile = async () => {
      if(!audioFile.length) return;

      const formData = new FormData();
      formData.append("audioFile", audioFile[0]);
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
      <UploadForm handleFormChange={handleSetAudioFile} />
      {audioFile.length > 0 && <PitchControls modifyPitch={handleModifyPitch} reqPending={isLoading} />}
      {audioFile.length > 0 && <AudioMenu files={audioFile} />}
      {modifiedFile.length > 0 && <AudioMenu files={modifiedFile} />}
    </>
  );
}

export default App;
