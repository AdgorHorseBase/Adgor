const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.post("/", (req, res, next) => {
    const { pagePath, htmlContent, schema } = req.body;

    if (!pagePath || !htmlContent || !schema) {
        return res.status(400).json({ error: "Missing page path, HTML content, or schema." });
    }

    const fullPath = path.join(req.UPLOADS_DIR, pagePath);
    const htmlFilePath = path.join(fullPath, "index.html");
    const schemaFilePath = path.join(fullPath, "schema.json");

    if (!fs.existsSync(htmlFilePath) || !fs.existsSync(schemaFilePath)) {
        return res.status(404).json({ error: "Page not found." });
    }

    fs.writeFileSync(htmlFilePath, htmlContent);
    fs.writeFileSync(schemaFilePath, JSON.stringify(schema, null, 2));

    res.data = { message: "Page edited successfully." };
    next();
})

module.exports = router;