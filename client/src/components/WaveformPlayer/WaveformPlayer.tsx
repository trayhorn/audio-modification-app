import { useEffect, useRef, useState, useCallback } from "react";
import WaveformWorker from "./Worker?worker";
import Loader from "../Loader/Loader";
import PlayerControls from "../PlayerControls";
import PlayerCanvas from "../PlayerCanvas";
import PlaybackTimer from "../PlaybackTimer";

interface WaveformPlayerProps {
  file: File;
  fileSrc: string;
}

interface WaveformBar {
  min: number;
  max: number;
}

export default function WaveformPlayer({ file, fileSrc }: WaveformPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Audio refs — never stored in state to avoid re-renders
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext>(null);
  const gainNodeRef = useRef<GainNode>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode>(null);

  const [isDrawing, setIsDrawing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [isReady, setIsReady] = useState(false);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const formatTime = (seconds: number): string =>
    `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  // ─── Draw waveform on canvas ──────────────────────────────────────────────────

  const drawWaveform = useCallback((audioBuffer: AudioBuffer): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const samples = audioBuffer.getChannelData(0);
    const barCount = 1000;

    const worker = new WaveformWorker();
    worker.postMessage({ samples, barCount }, [samples.buffer]);

    worker.onmessage = (event) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const data = event.data.data as WaveformBar[];

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "purple";
      const barWidth = width / data.length;

      for (let i = 0; i < data.length; i++) {
        const { min, max } = data[i];
        const x = i * barWidth;
        const yMin = (1 - min) * (height / 2);
        const yMax = (1 - max) * (height / 2);
        ctx.fillRect(x, yMax, barWidth, yMin - yMax);
      }

      setIsDrawing(false);
      worker.terminate();
    };
  }, []);

  // ─── Main setup effect — runs when file/fileSrc changes ──────────────────────

  useEffect(() => {
    if (!file || !fileSrc) return;

    // Teardown any previous session
    const prevAudio = audioRef.current;
    if (prevAudio) {
      prevAudio.pause();
      prevAudio.src = "";
      prevAudio.ontimeupdate = null;
      prevAudio.onloadedmetadata = null;
      prevAudio.onended = null;
    }

    setIsPlaying(false);
    setCurrentTime("0:00");
    setTotalDuration("0:00");
    setIsReady(false);

    // ── Build fresh AudioContext + GainNode ────────────────────────────────────
    const audioCtx = new AudioContext();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioCtx.destination);

    audioCtxRef.current = audioCtx;
    gainNodeRef.current = gainNode;

    // ── Decode audio for waveform drawing ─────────────────────────────────────
    file.arrayBuffer().then((buffer) => {
      audioCtx.decodeAudioData(buffer, (decoded) => {
        drawWaveform(decoded);
      });
    });

    // ── Create HTMLAudioElement (NOT in the DOM) ───────────────────────────────
    // Managed imperatively via ref — no <audio> JSX tag needed.
    const audio = new Audio(fileSrc);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // MediaElementSource must be created only once per Audio element
    const sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(gainNode);
    sourceNodeRef.current = sourceNode;

    // Resume context if the browser suspended it due to autoplay policy
    const handleCanPlay = async (): Promise<void> => {
      if (audioCtx.state === "suspended") await audioCtx.resume();
      setIsReady(true);
    };
    audio.addEventListener("canplay", handleCanPlay, { once: true });

    audio.onloadedmetadata = (): void => {
      setTotalDuration(formatTime(audio.duration));
      setCurrentTime("0:00");
    };

    audio.ontimeupdate = (): void => {
      setCurrentTime(formatTime(audio.currentTime));
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      if (canvas && overlay) {
        const pct = (audio.currentTime / audio.duration) * canvas.offsetWidth;
        overlay.style.width = `${pct}px`;
      }
    };

    audio.onended = (): void => setIsPlaying(false);

    // Cleanup on unmount or next file change
    return () => {
      audio.pause();
      audio.src = "";
      audio.ontimeupdate = null;
      audio.onloadedmetadata = null;
      audio.onended = null;
      audio.removeEventListener("canplay", handleCanPlay);
      audioCtx.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, fileSrc]);

  // ─── Play / Pause ─────────────────────────────────────────────────────────────

  const handlePlayPause = async (): Promise<void> => {
    const audio = audioRef.current;
    const audioCtx = audioCtxRef.current;
    if (!audio || !audioCtx) return;

    if (audioCtx.state === "suspended") await audioCtx.resume();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  // ─── Volume ───────────────────────────────────────────────────────────────────

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = val;
  };

  // ─── Seek on canvas click ─────────────────────────────────────────────────────

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (!file || !fileSrc) return null;

  return (
    <div className="waveform-wrapper">
      {isDrawing && <Loader />}
      <div
        className="custom-player"
        style={{ display: isDrawing ? "none" : "flex" }}
      >
        <PlayerControls
          isPlaying={isPlaying}
          isReady={isReady}
          handlePlayPause={handlePlayPause}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          audioRef={audioRef}
        />
        <PlayerCanvas
          canvasRef={canvasRef}
          overlayRef={overlayRef}
          handleCanvasClick={handleCanvasClick}
        />
        <PlaybackTimer currentTime={currentTime} totalDuration={totalDuration} />
      </div>
    </div>
  );
}
