import { BsSkipBackward } from "react-icons/bs";
import { MdOutlineReplay10, MdForward10 } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";

type PlayerControlsProps = {
  isPlaying: boolean;
  isReady: boolean;
  handlePlayPause: () => void;
  volume: number;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

export default function PlayerControls(props: PlayerControlsProps) {
  const { isPlaying, isReady, handlePlayPause, volume, handleVolumeChange, audioRef } = props;

  if(!audioRef.current) {
    return null;
  }

  const seek = (offsetSeconds: number | "start") => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = offsetSeconds === "start" ? 0 : audio.currentTime + offsetSeconds;
  };

  return (
    <div className="controls">
      <div className="main">
        <button onClick={() => seek("start")}>
          <BsSkipBackward style={{ display: "block" }} size={25} />
        </button>
        <button onClick={() => seek(-10)}>
          <MdOutlineReplay10 style={{ display: "block" }} size={30} />
        </button>
        <button
          className="tape-controls"
          data-playing={isPlaying ? "true" : "false"}
          role="switch"
          aria-checked={isPlaying}
          onClick={handlePlayPause}
          disabled={!isReady}
        >
          {isPlaying ? (
            <FaPause aria-hidden="false" size={25} />
          ) : (
            <FaPlay aria-hidden="true" size={25} />
          )}
        </button>
        <button onClick={() => seek(10)}>
          <MdForward10 style={{ display: "block" }} size={30} />
        </button>
      </div>

      <input
        type="range"
        id="volume"
        min={0}
        max={2}
        value={volume}
        step={0.01}
        onChange={handleVolumeChange}
        style={{ width: "100%" }}
      />
    </div>
  );
}
