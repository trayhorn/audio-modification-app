const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const multer = require("multer");
const process = require("node:process");
const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const FF = require("../lib/FF");
const { progressEmitter } = require("../lib/ProgressEmitter");

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

// --- Routing starts here ---

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
    const fileDir = await fs.readdir(`./storage/${audioId}`);

    const origFileName = fileDir[0];
    const inputPath = `./storage/${audioId}/${origFileName}`;

    let { dir, name, ext } = path.parse(inputPath);
    const modifiedName = name + "_output" + pitch + ext;

    if (fileDir.includes(modifiedName)) {
      const error = new Error("The file with same pitch already exists");
      error.status = 400;
      throw error;
    }

    const wavFilePath = await FF.convertToWav(inputPath);
    const modifiedWavPath = await FF.modifyPitch(wavFilePath, pitch);
    const outputMp3Path = await FF.convertToMp3(modifiedWavPath);

    await fs.unlink(wavFilePath);
    await fs.unlink(modifiedWavPath);

    res.set("X-File-Name", path.basename(outputMp3Path));
    res.set("Access-Control-Expose-Headers", "X-File-Name");

    res.status(200).sendFile(path.join(__dirname, "../", outputMp3Path));
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Get modification progress route

router.get("/progress:jobId", async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: Connected to server\n\n`);

    progressEmitter.on('progressUpdate', (data) => {
      res.write(`data: ${data}\n\n`);
    })

    req.on("close", () => {
      res.end();
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
