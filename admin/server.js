const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8080;

let structure = {}, products, vouchers;
const productsFilePath = path.join(__dirname, 'files', 'config', 'products.json');
const vouchersFilePath = path.join(__dirname, 'files', 'config', 'vouchers.json');
const structureFilePath = path.join(__dirname, 'files', 'config', 'structure.json');


// Middleware for parsing JSON requests and incoming form-data requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setting the CORS Policy
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}));

// Directory for storing pages
const UPLOADS_DIR = path.join(__dirname, "files", "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}


function scanDirectory(dir, currentPath) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    const contents = [];

    items.forEach(item => {
        const subPath = path.join(currentPath, item.name);
        const itemPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            // Recursively scan the subdirectory
            const subDirContents = scanDirectory(itemPath, subPath);
            const pageHtmlPath = path.join(itemPath, 'page.html');

            if (fs.existsSync(pageHtmlPath)) {
                // If the directory contains page.html, treat it as a page
                const schemaPath = path.join(itemPath, 'schema.json');
                let titleBg = '';
                let titleEn = '';
                let directoryBg = 'Directory';

                if (fs.existsSync(schemaPath)) {
                    try {
                        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
                        titleBg = schema.titleBg;
                        titleEn = schema.titleEn;
                        directoryBg = schema.directoryBg ?? "Directory";
                    } catch (err) {
                        console.error(`Error reading or parsing schema file for ${subPath}:`, err);
                    }
                }

                contents.push({
                    page: item.name,
                    titleBg: titleBg,
                    titleEn: titleEn,
                    directoryBg: directoryBg,
                    place: 1
                });
            } else {
                // Otherwise, treat it as a directory
                if (fs.readdirSync(itemPath).length === 0) {
                    fs.rmdirSync(itemPath);
                    return;
                }

                let directoryBg = 'Directory';

                fs.readdirSync(itemPath).forEach(file => {
                    const schemaPath = path.join(itemPath, file, 'schema.json');
                    if (fs.existsSync(schemaPath)) {
                        try {
                            const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
                            directoryBg = schema.directoryBg ?? "Directory";
                        } catch (err) {
                            console.error(`Error reading or parsing schema file for ${subPath}:`, err);
                        }
                    }
                });

                contents.push({
                    directory: item.name,
                    directoryBg: directoryBg,
                    contents: subDirContents,
                    place: 1
                });
            }
        }
    });
    return contents;
}


// Function to scan the uploads directory structure
function GetStructure() {
    // Start scanning from the root directory
    // structure["/"] = []
    // structure["/"] = scanDirectory(UPLOADS_DIR, "/");
    structure = scanDirectory(UPLOADS_DIR, "/");

    if (fs.existsSync(structureFilePath)) {
        try {
            const existingStructure = JSON.parse(fs.readFileSync(structureFilePath, 'utf-8'));
            // TODO: needs a check if the existing structure is valid array
            existingStructure.forEach((elem, index) => {
                if (existingStructure[index].place) {
                    if (!structure[index]) {
                        structure.splice(index, 1);
                    } else {
                        structure[index].place = existingStructure[index].place;
                    }
                }

                if (existingStructure[index].contents) {
                    existingStructure[index].contents.forEach(existingContent => {
                        if (Array.isArray(structure[index]?.contents)) {
                            const matchingContent = structure[index].contents.find(content => {
                                if (content.directory) {
                                    return content.directory === existingContent.directory;
                                } else {
                                    return content.page === existingContent.page;
                                }
                            });
                            if (matchingContent) {
                                matchingContent.place = existingContent.place;
                            }

                            if (existingContent.contents) {
                                existingContent.contents.forEach(existingSubContent => {
                                    const matchingSubContent = matchingContent?.contents?.find(content => {
                                        if (content.directory) {
                                            return content.directory === existingSubContent.directory;
                                        } else {
                                            return content.page === existingSubContent.page;
                                        }
                                    });
                                    if (matchingSubContent) {
                                        matchingSubContent.place = existingSubContent.place;
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (err) {
            console.error('Error reading or parsing structure file:', err);
        }
    }

    // Save the final structure to a JSON file
    fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2), 'utf-8');

    return structure;
}

// Serve static HTML pages based on path
app.get("/page-get", (req, res) => {
    const pagePath = req.query.pagePath.replace(/%20/g, " ").replace(/%2F/g, "/").replace(/%5C/g, "\\");
    const htmlFilePath = path.join(UPLOADS_DIR, pagePath, "page.html");
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

    if (fs.existsSync(schemaFilePath)) {
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

// POST request to edit an existing page
const EditPage = require("./routes/EditPage");
app.use("/page/edit", (req, res, next) => {
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
    next();
}, RenamePage, (req, res) => {
    structure = GetStructure();
    res.status(200).json(res.data);
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
app.use("/images", Image);

const Video = require("./routes/Video");
app.use("/videos", Video);

const Config = require("./routes/Config");
app.use("/config", Config);

const Uploads = require("./routes/Uploads");
app.use("/uploads", Uploads);


// Products
app.get("/products", (req, res) => {
    res.status(200).json(products);
});

app.post("/products/edit", (req, res) => {
    const { newProducts } = req.body;

    if (!newProducts) {
        res.status(400).json({ error: "No products were given" });
    }

    try {
        products = newProducts;
        fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8');
        res.status(200).json({ message: "Products updated successfully" });
    } catch (err) {
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

    if (!newVouchers) {
        res.status(400).json({ error: "No vouchers were given" });
    }

    try {
        vouchers = newVouchers;
        fs.writeFileSync(vouchersFilePath, JSON.stringify(vouchers), 'utf-8');
        res.status(200).json({ message: "Vouchers updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.post("/set-places", async (req, res) => {
    const { places } = req.body;

    if (!places) {
        res.status(400).json({ error: "No places were given" });
    }

    Object.keys(places).forEach(placeName => {
        if (structure[placeName] && structure[placeName].contents) {
            structure[placeName].place = places[placeName];
        }
    });

    try {
        fs.writeFileSync(structureFilePath, JSON.stringify(structure), 'utf-8');
        structure = GetStructure();

        return res.status(200).json({ message: "Places set successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/place-change", async (req, res) => {
    const { state } = req.body;

    if (!Array.isArray(state) || state.length === 0) {
        return res.status(400).json({ error: "No state was given" });
    }

    try {
        if (state.length === 2) {
            const [newPlace, objectName] = state;

            if (newPlace <= Object.values(structure).length && structure[objectName]) {
                const elementWithNewPlace = Object.values(structure).find(item => item.place === newPlace);
                if (elementWithNewPlace) {
                    elementWithNewPlace.place = structure[objectName].place;
                }
                structure[objectName].place = newPlace;
            }
        } else if (state.length === 4) {
            if (state[2] === 'directory') {
                const [newPlace, objectName, type, subDirectory] = state;
                structure[objectName].contents.forEach(content => {
                    if (newPlace <= structure[objectName].contents.length && content.directory === subDirectory) {
                        const contentWithNewPlace = structure[objectName].contents.find(content2 => content2.place === newPlace);
                        if (contentWithNewPlace) {
                            contentWithNewPlace.place = content.place;
                        }
                        content.place = newPlace;
                    }
                });
            } else if (state[2] === 'page') {
                const [newPlace, objectName, type, page] = state;
                structure[objectName].contents.forEach(content => {
                    if (newPlace <= structure[objectName].contents.length && content.page === page) {
                        const contentWithNewPlace = structure[objectName].contents.find(content2 => content2.place === newPlace);
                        if (contentWithNewPlace) {
                            contentWithNewPlace.place = content.place;
                        }
                        content.place = newPlace;
                    }
                });
            }
        } else if (state.length === 5) {
            const [newPlace, objectName, type, subDirectory, page] = state;
            structure[objectName].contents.forEach(content => {
                if (content.directory === subDirectory) {
                    content.contents.forEach(subContent => {
                        if (newPlace <= content.contents.length && subContent.page === page) {
                            const contentWithNewPlace = content.contents.find(content2 => content2.place === newPlace);
                            if (contentWithNewPlace) {
                                contentWithNewPlace.place = subContent.place;
                            }
                            subContent.place = newPlace;
                        }
                    });
                }
            });
        }

        fs.writeFileSync(structureFilePath, JSON.stringify(structure, null, 2), 'utf-8');
        structure = GetStructure();

        return res.status(200).json({ message: "Places set successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);

    GetStructure();

    if (!fs.existsSync(structureFilePath)) {
        // File doesn't exist, create it with an empty object
        fs.writeFileSync(structureFilePath, '{}', 'utf-8');
        console.log('Created structure.json with empty object.');
    }

    try {
        const structureData = fs.readFileSync(structureFilePath, 'utf-8'); // Read the file synchronously
        structure = JSON.parse(structureData); // Parse the JSON data
        console.log(structure); // Log the loaded structure
    } catch (err) {
        console.error('Error reading or parsing structure file:', err);
        structure = {}; // Fallback to an empty object in case of error
    }

    // Load Products
    if (!fs.existsSync(productsFilePath)) {
        // File doesn't exist, create it with an empty array
        fs.writeFileSync(productsFilePath, '[]', 'utf-8');
        console.log('Created products.json with empty array.');
    }

    try {
        const productsData = fs.readFileSync(productsFilePath, 'utf-8'); // Read the file synchronously
        products = JSON.parse(productsData); // Parse the JSON data
        // console.log('Products loaded:', products); // Log the loaded products
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
        // console.log('Vouchers loaded:', vouchers); // Log the loaded products
    } catch (err) {
        console.error('Error reading or parsing products file:', err);
        vouchers = []; // Fallback to an empty array in case of error
    }
});