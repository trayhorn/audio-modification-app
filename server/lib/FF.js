const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require('node:fs/promises');

const convertToWav = (inputPath) => {
  return new Promise((resolve, reject) => {
    let { dir, name } = path.parse(inputPath);
    const modifiedName = name + ".wav";
    const outputPath = path.join(dir, modifiedName);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-c:a",
      "pcm_s16le",
      outputPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(`FFmpegConvert rejected with error code ${code}`);
      }
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });
  });
};

const convertToMp3 = (inputPath) => {
  return new Promise((resolve, reject) => {
    let { dir, name } = path.parse(inputPath);
    const modifiedName = name + ".mp3";
    const outputPath = path.join(dir, modifiedName);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "320k",
      outputPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(`FFmpegConvert rejected with error code ${code}`);
      }
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });
  });
};

const modifyPitch = (inputPath, pitch) => {
  return new Promise((resolve, reject) => {
    const pitchFactor = Math.pow(2, pitch / 12);

    let { dir, name, ext } = path.parse(inputPath);
    const modifiedName = name + "_output" + pitch + ext;
    const outputPath = path.join(dir, modifiedName);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-af",
      `rubberband=pitch=${pitchFactor}`,
      outputPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(`Rejected with error code ${code}`);
      }
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = {
  modifyPitch,
  convertToWav,
  convertToMp3
};
