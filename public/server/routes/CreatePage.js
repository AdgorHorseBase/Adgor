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
    const htmlFilePath = path.join(fullPath, "page.html");
    const schemaFilePath = path.join(fullPath, "schema.json");

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    fs.writeFileSync(htmlFilePath, htmlContent);
    fs.writeFileSync(schemaFilePath, JSON.stringify(schema, null, 2));

    res.data = { message: "Page created successfully." };
    next();
})

module.exports = router;