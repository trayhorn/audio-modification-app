import { useEffect, useState } from "react";

type AudioMenuType = {
  files: File[];
};

export default function AudioMenu({ files }: AudioMenuType) {
  const [audioSrc, setAudioSrc] = useState<string[]>([]);

  useEffect(() => {
    const src = files.map((file) => URL.createObjectURL(file));
    setAudioSrc(src);

    return () => {
      src.forEach(URL.revokeObjectURL);
    };
  }, [files]);

  const formatSize = (sizeInBytes: number): string => {
    return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <>
      {files.map((f, i) => {
        return (
          <section className="audioMenu">
            <div>
              <span>{f.name}</span>
              <span>{formatSize(f.size)}</span>
            </div>
            <audio controls src={audioSrc[i]} />
          </section>
        );
      })}
    </>
  );
}
