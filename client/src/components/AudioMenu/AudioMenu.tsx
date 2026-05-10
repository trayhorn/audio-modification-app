import PitchControls from "../PitchControls/PitchControls";

type AudioMenu = {
  file: File;
};

export default function AudioMenu({ file }: AudioMenu) {
  const { name, size } = file;

  const formatSize = (sizeInBytes: number): string => {
    return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <section className="audioMenu">
      <PitchControls />
      <div>
        <span>{name}</span>
        <span>{formatSize(size)}</span>
      </div>
    </section>
  );
}
