import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  progress: { out_time_ms: string; progress: string } | null;
  totalDurationMs: number;
};

export default function ProgressBar({
  progress,
  totalDurationMs,
}: ProgressBarProps) {
  const progressPercentage = progress
    ? (Number(progress.out_time_ms) / totalDurationMs) * 100
    : 0;

  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.bar}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div>
        Current progress: {Math.ceil(progressPercentage)}%
      </div>
    </>
  );
}
