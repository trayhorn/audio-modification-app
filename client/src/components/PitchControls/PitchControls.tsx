import { useState } from "react";
import { FaPlus, FaMinus  } from "react-icons/fa";

type PitchControlsType = {
  modifyPitch: (pitch: number) => {},
  reqPending: boolean
}

export default function PitchControls({modifyPitch, reqPending}: PitchControlsType) {
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
      <button className="minus" onClick={handleMinus}>
        <FaMinus style={{display: "block"}} size={20} />
      </button>
      <span className="value">{pitch}</span>
      <button className="plus" onClick={handlePlus}>
        <FaPlus style={{display: "block"}} size={20} />
      </button>
      <button className="btn-modify" onClick={() => modifyPitch(pitch)} disabled={reqPending || pitch === 0}>
        {reqPending ? 'Processing...' : 'Modify'}
      </button>
    </div>
  );
}