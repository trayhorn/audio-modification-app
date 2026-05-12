import PitchControls from "../PitchControls/PitchControls";

type AudioMenuType = {
  file: File;
  modifyPitch: (pitch: number) => {}
};

export default function AudioMenu({ file, modifyPitch }: AudioMenuType) {
  const { name, size } = file;

  const formatSize = (sizeInBytes: number): string => {
    return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const audioSrc = URL.createObjectURL(file);

  return (
    <section className="audioMenu">
      <PitchControls modifyPitch={modifyPitch} />
      <div>
        <span>{name}</span>
        <span>{formatSize(size)}</span>
      </div>
      <audio controls src={audioSrc}></audio>
    </section>
  );
}
