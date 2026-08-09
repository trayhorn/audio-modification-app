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
    <>
      {/* {files.map((f, i) =>
          <section className="audioMenu" key={i}>
            <div>
              <span>{f.name}</span>
              <span> {formatSize(f.size)}</span>
            </div>

            <div className="wrapper">
              <WaveformPlayer
                file={f}
                fileSrc={audioSrc[i]}
              />

              {isModified && (
                <div className="audioDownload">
                  <a href={audioSrc[i]} download={f.name}>
                    <MdDownload size={30} color="black" />
                  </a>
                </div>
              )}
            </div>
          </section>
      )} */}
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
    </>
  );
}
