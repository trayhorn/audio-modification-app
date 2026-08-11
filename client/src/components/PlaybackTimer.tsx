type PlaybackTimerProps = {
  currentTime: string;
  totalDuration: string;
};

export default function PlaybackTimer({ currentTime, totalDuration }: PlaybackTimerProps) {
  return (
    <div className="duration-display">
      <span>{currentTime}</span>
      {" / "}
      <span>{totalDuration}</span>
    </div>
  );
}