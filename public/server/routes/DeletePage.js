const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.delete("/", (req, res, next) => {
    const { pagePath } = req.query;

    if (!pagePath) {
        return res.status(400).json({ error: "Missing page path." });
    }

    // pagePath = pagePath.replace(/%20/g, " ");

    const fullPath = path.join(req.UPLOADS_DIR, pagePath);
    
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        res.data = { message: "Page deleted successfully." };
        next();
    } else {
        return res.status(404).json({ error: "Page not found." });
    }
})

module.exports = router;