import { useEffect, useState } from "react";
import { MdDownload } from "react-icons/md";
import WaveformPlayer from "../Player/Player";

type AudioMenuType = {
  file: File;
  isModified?: boolean;
};

export default function AudioMenu({ file, isModified }: AudioMenuType) {
  const [audioSrc, setAudioSrc] = useState<string>("");

  useEffect(() => {
    const src = URL.createObjectURL(file);
    setAudioSrc(src);

    return () => {
      URL.revokeObjectURL(src);
    };
  }, [file]);

  const formatSize = (sizeInBytes: number): string => {
    return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <section className="audioMenu">
      <div>
        <span>{file.name}</span>
        <span> {formatSize(file.size)}</span>
      </div>

      <div className="wrapper">
        <WaveformPlayer
          file={file}
          fileSrc={audioSrc}
        />

        {isModified && (
          <div className="audioDownload">
            <a href={audioSrc} download={file.name}>
              <MdDownload size={30} color="black" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
