import styles from "./ProgressBar.module.css";
import { useState, useEffect } from "react";

type Progress = {
  out_time_ms: string;
  progress: string;
};

type ProgressBarProps = {
  audioId: string;
  audioFile: File;
};

export default function ProgressBar({ audioId, audioFile }: ProgressBarProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [totalDurationMs, setTotalDurationMs] = useState<number>(0);

  useEffect(() => {
    if (!audioFile) return;
    const url = URL.createObjectURL(audioFile);
    const audio = new Audio(url);

    let eventSource: EventSource | null = null;

    const handleLoadedMetadata = () => {
      setTotalDurationMs(audio.duration * 1_000_000);

      eventSource = new EventSource(
        `http://localhost:3000/audio/progress/${audioId}`,
      );

      eventSource.onmessage = function (event) {
        const data = event.data;

        if (data === "Preparing..." || data === "Finalizing...") {
          console.log("Setting status:", data);
          setStatus(data);
          setProgress(null);
        } else {
          const progressData = Object.fromEntries(
            new URLSearchParams(data.split(",").join("&")),
          ) as Progress;
          setStatus(null);
          setProgress(progressData);
        }

        if (data === "Finished") {
          eventSource?.close();
          setProgress(null);
          setStatus(null);
        }
      };

      eventSource.onerror = function (event) {
        console.log("Error occurred:", event);
      };
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      URL.revokeObjectURL(url);
      if (eventSource) eventSource.close();
    };
  }, [audioId, audioFile]);

  const percentage = progress
    ? (Number(progress.out_time_ms) / totalDurationMs) * 100
    : 0;

  return (
    <>
      {status && <div>{status}</div>}
      {progress && (
        <>
          <div className={styles.container}>
            <div
              className={styles.bar}
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>
          <div>Current progress: {Math.ceil(percentage)}%</div>
        </>
      )}
    </>
  );
}
