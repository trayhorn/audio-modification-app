


type PlayerCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
};

export default function PlayerCanvas({ canvasRef, overlayRef, handleCanvasClick }: PlayerCanvasProps) {
  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        id="waveform-main"
        width={1000}
        height={100}
        onClick={handleCanvasClick}
        style={{ cursor: "pointer", display: "block" }}
      />
      <div ref={overlayRef} className="canvas-overlay" />
    </div>
  );
}
