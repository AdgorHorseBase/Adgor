//use strict";

// URL for the automatically starded backend server with admin panel OR link to the github hosted url
//TODO: Fix raw CONFIG_URL after the new file structure is implemented
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/"; // URL for the automatically started backend server with admin panel OR link to the github hosted url

export const GITHUB_LOCATION = "AdgorHorseBase/Adgor"
export const GITHUB_URL = `https://raw.githubusercontent.com/${GITHUB_LOCATION}/refs/heads/main/public/server/files/`;

export const VALID_CONFIG_CATEGORY_NAMES = ["images", "uploads", "videos", "config"];
export const VALID_CONFIG_FILE_NAMES = ["products.json", "structure.json", "vouchers.json"];


export const getContent = async (filePath) => {
    let content_output = "Error: No content found";

    const { category, fileName } = splitFilePathToCategoryAndFileName(filePath);
    
    checkValidFileWithCategory(category, fileName);
    
    if (process.env.ActiveAdmin) {
        content_output = await requestFileFromAdmin(category, fileName); // Remove category prefix
    } else {
        // TODO: TESTING
        // content_output = await getPublicFile(category, fileName);
        // content_output = await requestFileFromGithub(category, fileName); // Remove category prefix
        console.log("getContent requesting item")
        content_output = await requestFileFromAdmin(category, fileName);
    }
    
    if (!content_output) {
        console.log("getContent Error: No content found for the given file path");
        console.log(`Category: ${category}, File Name: ${fileName}`);
        console.log(`File Path: ${filePath}`);
        throw new Error("Invalid file path or file not found");
    }

    return content_output;
}

export const getUrlForFile = (filePath) => {
    if (!filePath || typeof filePath !== "string") {
        console.log(`getUrlForFile Error: Invalid file path provided: ${filePath}`);
        throw new Error("Invalid file path");
    }

    const { category, fileName } = splitFilePathToCategoryAndFileName(filePath);
    
    checkValidFileWithCategory(category, fileName);

    if (process.env.ActiveAdmin) {
        console.log("Using admin backend URL for file access");
        return `${BACKEND_URL}${category}?name=${fileName}`;
    } else {
        //TODO: Remove
        console.log("Using public backend URL for file access");
        // return `/files/${category}/${fileName}`;
        // return `${GITHUB_URL}${category}/${fileName}`;
        return `${BACKEND_URL}${category}?name=${fileName}`;
    }
}


const splitFilePathToCategoryAndFileName = (filePath) => {
    while (filePath.startsWith("/")) {
        filePath = filePath.substring(1); // Remove leading slash if present
    }
    
    while (filePath.endsWith("/")) {
        filePath = filePath.slice(0, -1); // Remove trailing slash if present
    }

    let category = filePath.split("/")[0]; // Extract the first part as category
    let fileName = filePath.split("/").slice(1).join("/"); // Join the rest as file name

    return { category, fileName };
}


const checkValidFileWithCategory = (category, filePath) => {
    if (!category || typeof category !== "string") {
        throw new Error("Invalid category name. Not correct category type");
    }
    if (!VALID_CONFIG_CATEGORY_NAMES.includes(category)) {
        throw new Error("Invalid category name. Category name not included");
    }

    if (!filePath || typeof filePath !== "string") {
        console.log(`checkValidFileWithcategory Error: Invalid category provided: ${category}`);
        console.log(`checkValidFileWithcategory Error: Invalid file path provided: ${filePath}`);
        throw new Error("Invalid file path");
    }

    if (category === "config" && !VALID_CONFIG_FILE_NAMES.includes(filePath)) {
        throw new Error("Invalid file name");
    }

    return true;
}


const requestFileFromAdmin = async (category, fileName) => {
    checkValidFileWithCategory(category, fileName);

    const response = await fetch(`${BACKEND_URL}${category}?name=${fileName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    let content = await response.text();
    try {
        return JSON.parse(content); 
    } catch (error) {
        return content; // Fallback to text if JSON parsing fails
    }
}


// TODO: UNUSED FOR NOW && NOT TESTED
const requestFileFromGithub = async (category, fileName) => {
    checkValidFileWithCategory(category, fileName);

    const response = await fetch(`${GITHUB_LOCATION}${category}/${fileName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    let content = await response.text();
    try {
        return JSON.parse(content); 
    } catch (error) {
        return content; // Fallback to text if JSON parsing fails
    }
}


const getPublicFile = async (category, fileName) => {
    checkValidFileWithCategory(category, fileName);

    const response = fetch(`/files/${category}/${fileName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    let content = await response.text();
    try {
        return JSON.parse(content); 
    } catch (error) {
        return content; // Fallback to text if JSON parsing fails
    }
}
