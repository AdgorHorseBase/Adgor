const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

// Initialize the Multer middleware with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: "No name provided" });
    }

    const imagePath = path.join(__dirname, "..", "files", "images", name);

    if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
    } else {
        return res.status(400).json({ error: "Image doesn't exist" });
    }
});

// POST route for image upload
router.post("/", upload.single('image'), async (req, res) => {
    try {
        // The file will be available on req.file
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const outputFilename = `image-${Date.now()}.webp`;
        const outputPath = path.join(__dirname, "..", "files", "images", outputFilename);

        // Resize the image to a width of 1920 pixels and convert to WebP format
        await sharp(file.buffer)
            .resize({ width: 1920 })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Respond with the file information
        res.json({
            message: "Image uploaded, resized, and converted to WebP successfully.",
            image: outputFilename
        });
    } catch (err) {
        console.error('Error handling file upload:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;