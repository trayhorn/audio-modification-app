import styles from "./ProgressBar.module.css";
import type { Progress } from "../../App.tsx";
import { useState, useEffect } from "react";

export default function ProgressBar({
  audioId,
  audioFile,
}: {
  audioId: string;
  audioFile: File | undefined;
}) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [totalDurationMs, setTotalDurationMs] = useState<number>(0);

  useEffect(() => {
    if (!audioFile) return;
    const url = URL.createObjectURL(audioFile);
    const audio = new Audio(url);

    let eventSource: EventSource | null = null;

    const handleLoadedMetadata = () => {
      setTotalDurationMs(audio.duration * 1_000_000);
      URL.revokeObjectURL(url);

      eventSource = new EventSource(
        `http://localhost:3000/audio/progress:${audioId}`,
      );

      eventSource.onmessage = function (event) {
        const data = event.data;
        const progressData = Object.fromEntries(
          new URLSearchParams(data.split(",").join("&")),
        );
        setProgress(progressData);

        if (progressData.progress === "end") {
          eventSource?.close();
          setProgress(null);
        }
      };

      eventSource.onerror = function (event) {
        console.log("Error occurred:", event);
      };
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      URL.revokeObjectURL(url);
      if(eventSource) eventSource.close();
    };
  }, [audioId, audioFile]);

  const percentage = progress
    ? (Number(progress.out_time_ms) / totalDurationMs) * 100
    : 0;

  return (
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
  );
}
