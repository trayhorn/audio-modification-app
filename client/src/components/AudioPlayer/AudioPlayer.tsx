type AudioPlayerType = {
  file: File
}

export default function AudioPlayer({file}: AudioPlayerType) {
  const audioUrl = URL.createObjectURL(file);

  return (
    <div>
      <audio controls src={audioUrl}></audio>
    </div>
  )
}