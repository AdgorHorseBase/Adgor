import { useEffect, useState } from "react";
import Editor from "./Editor";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import ProductsManager from "./ProductsManager";
import VouchersManager from "./VouchersManager";
import { IoIosCreate } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp, FaHome, FaRegTrashAlt } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { BiRename } from "react-icons/bi";

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

function AdminPanel() {
    const [structure, setStruct] = useState({});

    useEffect(() => {
        const fetchStructure = async () => {
            try {
                const response = await axios.get(`${URL}/structure`);
                setStruct(response.data);
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchStructure();
    }, []);

    const handlePlaceChange = async (e) => {
        try {
            await axios.post(`${URL}/place-change`, {
                state: e,
            });
        } catch (err) {
            alert("Error changing place:", err);
        }
    }

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
        } catch (err) {
            console.error("Error deleting:", err);
            alert("Error deleting file or directory");
        }
    }

    const renderStructure = (struct) => {
        return Object.entries(struct)
            .sort((a, b) => (a[1].place || 0) - (b[1].place || 0))
            .map(([path, info]) => {
            // Replace backslashes with forward slashes for consistency
            const cleanPath = path.replace(/\\/g, '/');
    
            if (info.type === "directory") {
                return (
                    <div key={cleanPath} style={{margin: "0", padding: "0", marginLeft: "16px"}}>
                        <div class="structureNav">
                            <div>
                                <input type="number" style={{width: "30px"}} value={struct[path].place} onChange={(e) => {
                                    handlePlaceChange([parseInt(e.target.value), cleanPath.replace(/^\//, "\\")]);
                                }} />
                                <strong style={{marginRight: "12px", fontSize: "20px"}}>{cleanPath}:</strong>
                            </div>

                            <div>
                                <button className="adminArrow" style={{ marginTop: "0" }}>
                                    <FaChevronUp />
                                </button>
                                <button className="adminArrow" style={{ marginTop: "0" }}>
                                    <FaChevronDown />
                                </button>
                                <button className="adminDelete" style={{margin: "4px 8px"}} onClick={() => handleDelete(cleanPath)}><FaRegTrashAlt /></button>
                            </div>
                        </div>
                        <div style={{ paddingLeft: "8px", marginLeft: "8px", borderLeft: "1px solid rgba(0, 0, 0, 0.2)" }}>
                            {/* Render subdirectories and files */}
                            {info.contents && info.contents.sort((a, b) => a.place - b.place).map((content) => {
                                if(content.directory) {
                                    return (
                                        <div key={content.directory}>
                                            <div className="structureNav">
                                                <div>
                                                    <input type="number" style={{width: "30px"}} value={content.place} onChange={(e) => {
                                                        handlePlaceChange([parseInt(e.target.value), cleanPath.replace(/^\//, "\\"), "directory", content.directory]);
                                                    }} />
                                                    <strong style={{marginRight: "12px", fontSize: "20px"}}>{content.directory}:</strong>
                                                </div>
                                                <div>
                                                    <button className="adminArrow" style={{ marginTop: "0" }}>
                                                        <FaChevronUp />
                                                    </button>
                                                    <button className="adminArrow" style={{ marginTop: "0" }}>
                                                        <FaChevronDown />
                                                    </button>
                                                    <button className="adminDelete" style={{margin: "4px 8px"}} onClick={() => handleDelete(`${cleanPath}/${content.directory}`)}><FaRegTrashAlt /></button>
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: "8px", paddingLeft: "8px", borderLeft: "1px solid rgba(0, 0, 0, 0.2)" }}>
                                                {content.contents && content.contents.sort((a, b) => a.place - b.place).map((page) => {
                                                    const fullPath = `${cleanPath}/${content.directory}/${page.page}`;
                                                    return (
                                                        <div key={fullPath} className="structureNav">
                                                            <div>
                                                                <input type="number" style={{width: "30px"}} value={page.place} onChange={(e) => {
                                                                    handlePlaceChange([parseInt(e.target.value), cleanPath.replace(/^\//, "\\"), "directory", content.directory, page.page]);
                                                                }} />
                                                                <a href={`/page${fullPath}`} style={{marginRight: "12px", fontSize: "20px"}}>{page.page}</a>
                                                            </div>
                                                            <div>
                                                                <button className="adminArrow" style={{ marginTop: "0" }}>
                                                                    <FaChevronUp />
                                                                </button>
                                                                <button className="adminArrow" style={{ marginTop: "0" }}>
                                                                    <FaChevronDown />
                                                                </button>
                                                                <button className="adminRename" style={{margin: "4px 8px"}} onClick={() => handleRename(fullPath)}><BiRename /></button>
                                                                <button className="adminEdit" style={{margin: "4px 8px"}} onClick={() => {document.location.href = `/admin/edit${fullPath}`}}><GrEdit /></button>
                                                                <button className="adminDelete" style={{margin: "4px 8px"}} onClick={() => handleDelete(fullPath)}><FaRegTrashAlt /></button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                } else if(content.page) {
                                    const fullPath = `${cleanPath}/${content.page}`;
                                    return (
                                        <div key={fullPath} className="structureNav">
                                            <div>
                                                <input type="number" style={{width: "30px"}} value={content.place} onChange={(e) => {
                                                    handlePlaceChange([parseInt(e.target.value), cleanPath.replace(/^\//, "\\"), "page", content.page]);
                                                }} />
                                                <a href={`/page${fullPath}`} style={{marginRight: "12px", fontSize: "20px"}}>{content.page}</a>
                                            </div>
                                            <div>
                                                <button className="adminArrow" style={{ marginTop: "0" }}>
                                                    <FaChevronUp />
                                                </button>
                                                <button className="adminArrow" style={{ marginTop: "0" }}>
                                                    <FaChevronDown />
                                                </button>
                                                <button className="adminRename" style={{margin: "4px 8px"}} onClick={() => handleRename(fullPath)}><BiRename /></button>
                                                <button className="adminEdit" style={{margin: "4px 8px"}} onClick={() => {document.location.href = `/admin/edit${fullPath}`}}><GrEdit /></button>
                                                <button className="adminDelete" style={{margin: "4px 8px"}} onClick={() => handleDelete(fullPath)}><FaRegTrashAlt /></button>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                );
            } else if (info.type === "file") {
                return (
                    <div key={cleanPath} style={{marginLeft: "16px"}} className="structureNav">
                        <div>
                            <input type="number" style={{width: "30px"}} value={struct[path].place} onChange={(e) => {
                                handlePlaceChange([parseInt(e.target.value), cleanPath.replace(/^\//, "\\")]);
                            }} />
                            <a href={`/page${cleanPath}`} style={{marginRight: "12px", fontSize: "20px"}}>{cleanPath}</a>
                        </div>
                        <div>
                            <button className="adminArrow" style={{ marginTop: "0" }}>
                                <FaChevronUp />
                            </button>
                            <button className="adminArrow" style={{ marginTop: "0" }}>
                                <FaChevronDown />
                            </button>
                            <button className="adminRename" style={{margin: "4px 8px"}} onClick={() => handleRename(cleanPath)}><BiRename /></button>
                            <button className="adminEdit" style={{margin: "4px 8px"}} onClick={() => {document.location.href = `/admin/edit${cleanPath}`}}><GrEdit /></button>
                            <button className="adminDelete" style={{margin: "4px 8px"}} onClick={() => handleDelete(cleanPath)}><FaRegTrashAlt /></button>
                        </div>
                    </div>
                );
            }
            return null;
        });
    };

    const Structure = () => {
        return (
            <div id="adminNav" style={{margin: "0 10%", marginBottom: "72px"}}>
                <button title="Create" onClick={() => {document.location.href = "/admin/create"}}><IoIosCreate /></button>
                <button title="Products" onClick={() => {document.location.href = "/admin/products"}}><FaCartShopping /></button>
                <button title="Open Site" onClick={() => {document.location.href = "/"}}><FaHome /></button>
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