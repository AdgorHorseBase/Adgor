import { useEffect, useState } from "react";
import Editor from "./Editor";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import ProductsManager from "./ProductsManager";
import VouchersManager from "./VouchersManager";

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

function AdminPanel() {
    const [structure, setStruct] = useState({});
    const [directorySort, setDirectorySort] = useState({});

    useEffect(() => {
        const fetchStructure = async () => {
            try {
                const response = await axios.get(`${URL}/structure`);
                setStruct(response.data);
                sortDirectories(response.data);
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchStructure();
    }, []);

    const sortDirectories = (struct) => {
        const sorted = {};
        Object.entries(struct).forEach(([path, info]) => {
            if (info.type === "directory") {
                sorted[path] = info.place || 0;
            }
        });
        setDirectorySort(sorted);
    };

    useEffect(() => {
        const setPlaces = async () => {

            try {
                await axios.post(`${URL}/set-places`, {
                    places: directorySort
                });
            } catch (err) {
                alert("Error setting places:", err);
            }
        }

        if(directorySort && directorySort != {}) {
            setPlaces();
        }
    }, [directorySort]);

    // Function to rename a file or directory
    const handleRename = async (oldPath) => {
        const newName = prompt("Enter the new name for the file or directory:", oldPath);
        if (!newName) {
            return; // If no name is entered, do nothing
        }

        try {
            await axios.put(`${URL}/page/rename`, {
                oldPagePath: oldPath,
                newPagePath: newName,
            });
            alert("Renamed successfully!");
            // Fetch the updated structure after renaming
            const response = await axios.get(`${URL}/structure`);
            setStruct(response.data);
            sortDirectories(response.data);
        } catch (err) {
            console.error("Error renaming:", err);
            alert("Error renaming file or directory.");
        }
    };

    const handleDelete = async (pagePath) => {
        if(window.confirm("Are you sure?") === false) {
            return;
        }

        if(!pagePath) {
            return;
        }

        let path = pagePath;

        if(pagePath[0] === "/") {
            path = pagePath.slice(1);
        }

        try {
            await axios.delete(URL+"/delete/page", {
                params: {pagePath: path}
            });

            alert("Deleted successfully");

            const response = await axios.get(`${URL}/structure`);
            setStruct(response.data);
            sortDirectories(response.data);
        } catch (err) {
            console.error("Error deleting:", err);
            alert("Error deleting file or directory");
        }
    }

    const renderStructure = (struct) => {
        return Object.entries(struct).map(([path, info]) => {
            // Replace backslashes with forward slashes for consistency
            const cleanPath = path.replace(/\\/g, '/');
    
            if (info.type === "directory") {
                return (
                    <div key={cleanPath} style={{margin: "0", padding: "0", marginLeft: "16px"}}>
                        {/* Display directory name */}
                        <input type="number" style={{width: "30px"}} value={directorySort[cleanPath.replace(/^\//, "\\")]} onChange={(e) => {
                            setDirectorySort({
                                ...directorySort,
                                [cleanPath.replace(/^\//, "\\")]: parseInt(e.target.value)
                            });
                        }} />
                        <strong style={{marginRight: "12px", fontSize: "20px"}}>{cleanPath}:</strong>
                        <button style={{margin: "4px 8px"}} onClick={() => handleRename(cleanPath)}>Rename</button>
                        <button style={{margin: "4px 8px"}} onClick={() => handleDelete(cleanPath)}>Delete</button>
                        <div style={{ paddingLeft: "20px" }}>
                            {/* Render subdirectories and files */}
                            {info.contents && info.contents.map((fileName) => {
                                const fullPath = `${cleanPath}/${fileName.page}`;
                                return (
                                    <div key={fullPath}>
                                        <a href={`/page${fullPath}`} style={{marginRight: "12px", fontSize: "20px"}}>{fileName.page}</a>
                                        <button style={{margin: "4px 8px"}} onClick={() => handleRename(fullPath)}>Rename</button>
                                        <button style={{margin: "4px 8px"}} onClick={() => {document.location.href = `/admin/edit${fullPath}`}}>Edit</button>
                                        <button style={{margin: "4px 8px"}} onClick={() => handleDelete(fullPath)}>Delete</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            } else if (info.type === "file") {
                return (
                    <div key={cleanPath} style={{marginLeft: "16px"}}>
                        <a href={`/page${cleanPath}`} style={{marginRight: "12px", fontSize: "20px"}}>{cleanPath}</a>
                        <button style={{margin: "4px 8px"}} onClick={() => handleRename(cleanPath)}>Rename</button>
                        <button style={{margin: "4px 8px"}} onClick={() => {document.location.href = `/admin/edit${cleanPath}`}}>Edit</button>
                        <button style={{margin: "4px 8px"}} onClick={() => handleDelete(cleanPath)}>Delete</button>
                    </div>
                );
            }
            return null;
        });
    };

    const Structure = () => {
        return (
            <div style={{marginLeft: "10%"}}>
                <button onClick={() => {document.location.href = "/admin/create"}}>Create</button>
                <button onClick={() => {document.location.href = "/admin/products"}}>Products</button>
                <button onClick={() => {document.location.href = "/admin/vouchers"}}>Vouchers</button>
                <h2 id="PageStructure" style={{marginLeft: "0"}}>Page Structure</h2>
                {/* {structure == true ? renderStructure(structure) : <h3>Empty</h3>} */}
                {renderStructure(structure)}
            </div>
        );
    }

    return (
        <div>
            <h1 id="title" style={{marginLeft: "0"}}>Admin Panel</h1>
            <Routes>
                <Route path="/" element={<Structure />} />
                <Route path="/create" element={<Editor structure={structure} />} />
                <Route path="/edit/*" element={<Editor structure={structure} />} />
                <Route path="/products" element={<ProductsManager />} />
                <Route path="/vouchers" element={<VouchersManager />} />
            </Routes>
        </div>
    );
}

export default AdminPanel;