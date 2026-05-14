const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const multer = require("multer");
const process = require("node:process");
const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const FF = require("../lib/FF");

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
    audioId,
  });
});

// Modify pitch route
router.post("/modify_pitch", async (req, res, next) => {
  try {
    const { audioId, pitch } = req.body;
    const pitchFactor = Math.pow(2, pitch / 12);

    const filename = await fs.readdir(`./storage/${audioId}`);

    let { name, ext } = path.parse(filename[0]);
    const modifiedName = name + "_output" + pitch + ext;

    const inputPath = `./storage/${audioId}/${filename[0]}`;
    const outputPath = `./storage/${audioId}/${modifiedName}`;
    await FF.modifyPitch(inputPath, pitchFactor, outputPath);

    res.set('X-File-Name', path.basename(outputPath));
    res.set('Access-Control-Expose-Headers', 'X-File-Name');

    res.status(200).sendFile(path.join(__dirname, "../", outputPath));
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;