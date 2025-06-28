const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


router.get("/", (req, res) => {
    let { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: "No name provided" });
    }

    if (name.includes("..")) {
        return res.status(400).json({ error: "Invalid file name" });
    }

    if (name.startsWith("/")) {
        name = name.substring(1); // Remove leading slash if present
    }

    const filePath = path.join(__dirname, "..", "files", "uploads", name);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return res.status(400).json({ error: "File doesn't exist" });
    }
});

module.exports = router;
