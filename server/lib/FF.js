const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs/promises");
const { progressEmitter } = require('../lib/ProgressEmitter');

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
      "-nostats",
      "-progress",
      "pipe:1",
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

    ffmpeg.stdout.on("data", (data) => {
      const filteredArray = data
        .toString("utf-8")
        .split("\n")
        .filter(el => el.includes('out_time_ms') || el.includes('progress'));

      progressEmitter.emit('progressUpdate', filteredArray);
    });
  });
};

module.exports = {
  modifyPitch,
  convertToWav,
  convertToMp3,
};
