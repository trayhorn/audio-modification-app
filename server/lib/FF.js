const { spawn } = require("node:child_process");

const modifyPitch = (inputName, pitchFactor, outputName) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputName,
      "-af",
      `rubberband=pitch=${pitchFactor}`,
      outputName,
    ]);

    ffmpeg.on('close', (code) => {
      if(code === 0) {
        resolve();
      } else {
        reject(`Rejected with error code ${code}`);
      }
    })

    ffmpeg.on('error', (error) => {
      reject(error);
    })
  });
};

module.exports = {
  modifyPitch
};
