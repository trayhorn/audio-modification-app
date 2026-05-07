const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const multer = require('multer');

const upload = multer({
  dest: './storage/uploads',
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'The route it working correctly'
  })
})

router.post('/upload', upload.single('audioFile'), (req, res, next) => {
  console.log('We are inside /upload');
  console.log("File: ", req.file);

  res.status(200).json({
    message: 'Success'
  });
});

module.exports = router;