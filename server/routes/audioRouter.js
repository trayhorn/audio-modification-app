const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const multer = require("multer");
const process = require("node:process");
const { spawn } = require("node:child_process");
const crypto = require('node:crypto');

const uploadDir = path.join(process.cwd(), "/tmp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const newName = file.originalname.replaceAll(" ", "_");
    cb(null, newName);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Test route
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "The route it working correctly",
  });
});

// Upload audio file route
router.post("/upload", upload.single("audioFile"), async (req, res, next) => {
  const audioId = crypto.randomUUID();
  const newPath = path.join(__dirname, "../storage", audioId);
  await fs.mkdir(newPath);
  await fs.rename(req.file.path, path.join(newPath, req.file.filename));

  res.status(200).json({
    message: "Success",
    audioId
  });
});

// Modify pitch route
router.post("/change_pitch", (req, res, next) => {
  const { pitch } = req.body;
  const pitchFactor = Math.pow(2, pitch / 12);

  spawn("ffmpeg", [
    "-i",
    "input.mp3",
    "-af",
    "rubberband=pitch=1.05946",
    "output.mp3",
  ]);

  res.status(200).json({
    message: "Success",
  });
});

module.exports = router;
