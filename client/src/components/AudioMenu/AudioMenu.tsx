import { useEffect, useState } from "react";
import WaveformPlayer from "../WaveformPlayer/WaveformPlayer";
import DownloadBtn from "../DownloadBtn";

type AudioMenuType = {
  file: File;
  isModified?: boolean;
};

const formatSize = (sizeInBytes: number) => {
  return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function AudioMenu({ file, isModified }: AudioMenuType) {
  const [audioSrc, setAudioSrc] = useState<string>("");

  useEffect(() => {
    const src = URL.createObjectURL(file);
    setAudioSrc(src);

    return () => {
      setAudioSrc("");
      URL.revokeObjectURL(src);
    };
  }, [file]);

  return (
    <section className="audioMenu">
      <div>
        <span>{file.name}</span>
        <span> {formatSize(file.size)}</span>
      </div>

      <div className="wrapper">
        <WaveformPlayer file={file} fileSrc={audioSrc} />
        {isModified && <DownloadBtn audioSrc={audioSrc} filename={file.name} />}
      </div>
    </section>
  );
}
