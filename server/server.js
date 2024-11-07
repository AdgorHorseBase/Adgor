const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8080;

let structure, products, vouchers;
const productsFilePath = path.join(__dirname, 'files', 'products.json');
const vouchersFilePath = path.join(__dirname, 'files', 'vouchers.json');

// Middleware for parsing JSON requests and incoming form-data requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setting the CORS Policy
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}));

// Directory for storing pages
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Function to scan the uploads directory structure
function GetStructure() {
    const structure = {};

    function scanDirectory(dir, currentPath) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        const contents = [];
        let isFile = false;

        items.forEach(item => {
            const subPath = path.join(currentPath, item.name);

            if (item.isDirectory()) {
                // Recursively scan the subdirectory and add its name to contents
                scanDirectory(path.join(dir, item.name), subPath);
                contents.push(item.name);
            } else if (item.name === "index.html" || item.name === "schema.json") {
                // If the directory contains index.html or schema.json, mark it as a file
                isFile = true;
            }
        });

        if (isFile) {
            structure[currentPath] = { type: 'file' };
        } else if (contents.length > 0) {
            structure[currentPath] = {
                type: 'directory',
                contents: contents
            };
        }
    }

    // Start scanning from the root directory
    scanDirectory(UPLOADS_DIR, "/");

    // Clean up the structure: removing any directory's files that are already listed in contents
    const finalStructure = {};

    Object.keys(structure).forEach(key => {
        // Skip the root directory "/"
        if (key === "/") return;

        if (structure[key].type === 'file' || structure[key].type === 'directory') {
            // Avoid adding subdirectories that are already in their parent's contents
            const parentPath = path.dirname(key);
            if (structure[parentPath]?.contents?.includes(path.basename(key))) {
                return;
            }
            finalStructure[key] = structure[key];
        }
    });

    return finalStructure;
}

// Serve static HTML pages based on path
app.get("/page-get", (req, res) => {
    const pagePath = req.query.pagePath;
    const htmlFilePath = path.join(UPLOADS_DIR, pagePath, "index.html");
    const schemaFilePath = path.join(UPLOADS_DIR, pagePath, "schema.json");

    if (pagePath && fs.existsSync(htmlFilePath) && fs.existsSync(schemaFilePath)) {
        try {
            const htmlFileContent = fs.readFileSync(htmlFilePath, 'utf-8');
            const schemaContent = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8')).title;
            res.status(200).json({
                content: htmlFileContent,
                title: schemaContent
            });
        } catch (error) {
            res.status(500).json({ error: "Error reading schema" });
        }
    } else {
        res.status(404).json({ error: "Page not found" });
    }
});

// Serve the page's schema
app.get("/page-get-schema", (req, res) => {
    const pagePath = req.query.pagePath;
    const schemaFilePath = path.join(UPLOADS_DIR, pagePath, "schema.json");

    if(fs.existsSync(schemaFilePath)) {
        try {
            const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');
            res.status(200).json({
                schema: JSON.parse(schemaContent)
            });
        } catch (error) {
            res.status(500).json({ error: "Error reading schema" });
        }
    } else {
        res.status(404).json({ error: "Schema not found" });
    }
})

// Get the full directory structure
app.get("/structure", (req, res) => {
    res.status(200).json(structure);
});

// POST request to create/save a new page
const CreatePage = require("./routes/CreatePage");
app.use("/page", (req, res, next) => {
    req.UPLOADS_DIR = UPLOADS_DIR;
    next();
}, CreatePage, (req, res) => {
    structure = GetStructure();
    res.status(200).json(res.data);
});

// POST request to edit an existing page
const EditPage = require("./routes/EditPage");
app.use("/page/edit", (req, res, next) => {
    console.log("hello")
    req.UPLOADS_DIR = UPLOADS_DIR;
    next();
}, EditPage, (req, res) => {
    structure = GetStructure();
    res.status(200).json(res.data);
});

// POST request to rename a page
const RenamePage = require("./routes/RenamePage");
app.use("/page/rename", (req, res, next) => {
    req.UPLOADS_DIR = UPLOADS_DIR;
    console.log("hello")
    next();
}, RenamePage, (req, res) => {
    structure = GetStructure();
    res.status(200).json(res.data);
});

// DELETE request to delete a page
const DeletePage = require("./routes/DeletePage");
app.use("/delete/page", (req, res, next) => {
    req.UPLOADS_DIR = UPLOADS_DIR;
    next();
}, DeletePage, (req, res) => {
    structure = GetStructure();
    res.status(200).json(res.data);
});

const Image = require("./routes/Image");
app.use("/image", Image);

const Video = require("./routes/Video");
app.use("/video", Video);


// Products
app.get("/products", (req, res) => {
    res.status(200).json(products);
});

app.post("/products/edit", (req, res) => {
    const { newProducts } = req.body;

    if(!newProducts) {
        res.status(400).json({ error: "No products were given" });
    }

    try {
        products = newProducts;
        fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8');
        res.status(200).json({ message: "Products updated successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

// Vouchers
app.get("/vouchers", (req, res) => {
    res.status(200).json(vouchers);
});

app.post("/vouchers/edit", (req, res) => {
    const { newVouchers } = req.body;

    if(!newVouchers) {
        res.status(400).json({ error: "No vouchers were given" });
    }

    try {
        vouchers = newVouchers;
        fs.writeFileSync(vouchersFilePath, JSON.stringify(vouchers), 'utf-8');
        res.status(200).json({ message: "Vouchers updated successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    
    structure = GetStructure();
    console.log(structure);

    // Load Products
    if (!fs.existsSync(productsFilePath)) {
        // File doesn't exist, create it with an empty array
        fs.writeFileSync(productsFilePath, '[]', 'utf-8');
        console.log('Created products.json with empty array.');
    }

    try {
        const productsData = fs.readFileSync(productsFilePath, 'utf-8'); // Read the file synchronously
        products = JSON.parse(productsData); // Parse the JSON data
        console.log('Products loaded:', products); // Log the loaded products
    } catch (err) {
        console.error('Error reading or parsing products file:', err);
        products = []; // Fallback to an empty array in case of error
    }

    // Load Vouchers
    if (!fs.existsSync(vouchersFilePath)) {
        // File doesn't exist, create it with an empty array
        fs.writeFileSync(vouchersFilePath, '[]', 'utf-8');
        console.log('Created vouchers.json with empty array.');
    }

    try {
        const vouchersData = fs.readFileSync(vouchersFilePath, 'utf-8'); // Read the file synchronously
        vouchers = JSON.parse(vouchersData); // Parse the JSON data
        console.log('Vouchers loaded:', vouchers); // Log the loaded products
    } catch (err) {
        console.error('Error reading or parsing products file:', err);
        vouchers = []; // Fallback to an empty array in case of error
    }
});