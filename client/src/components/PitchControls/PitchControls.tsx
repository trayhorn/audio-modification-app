import { useState } from "react";

type PitchControlsType = {
  modifyPitch: (pitch: number) => {}
}

export default function PitchControls({modifyPitch}: PitchControlsType) {
  const [pitch, setPitch] = useState(0);

  const handleMinus = () => {
    setPitch(prev => prev - 0.5);
  };

  const handlePlus = () => {
    setPitch(prev => prev + 0.5);
  };

  return (
    <div className="pitchControlsWrapper">
      <p>Pitch:</p>
      <button className="btn minus" onClick={handleMinus}>
        -
      </button>
      <span className="value">{pitch}</span>
      <button className="btn plus" onClick={handlePlus}>
        +
      </button>
      <button className="btn modify" onClick={() => modifyPitch(pitch)}>Modify</button>
    </div>
  );
}