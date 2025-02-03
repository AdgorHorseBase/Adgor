import axios from "axios";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoClose } from "react-icons/io5";

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "times-new-roman",
  "courier-new",
  "verdana",
  "georgia",
  "trebuchet-ms",
  "comic-sans-ms",
  "impact",
];
Quill.register(Font, true);

const MyCustomToolbar = ({ id }) => (
  <div id={id}>
    <select className="ql-font">
      <option value="">Normal</option>
      <option value="arial">Arial</option>
      <option value="times-new-roman">Times New Roman</option>
      <option value="courier-new">Courier New</option>
      <option value="verdana">Verdana</option>
      <option value="georgia">Georgia</option>
      <option value="trebuchet-ms">Trebuchet MS</option>
      <option value="comic-sans-ms">Comic Sans MS</option>
      <option value="impact">Impact</option>
    </select>
    <select className="ql-header" defaultValue="">
      <option value="">Normal</option>
      <option value="1">Header 1</option>
      <option value="2">Header 2</option>
      <option value="3">Header 3</option>
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-link" />
    <select className="ql-align" defaultValue="">
      <option value="" />
      <option value="center" />
      <option value="right" />
      <option value="justify" />
    </select>
    <button className="ql-clean" />
  </div>
);

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: '',
        type: 'single',
        imagePath: '',
        nameBg: '',
        nameEn: '',
        descriptionBg: '',
        descriptionEn: '',
        price: ''
    });
    const [newGroup, setNewGroup] = useState({
        id: '',
        type: 'group',
        imagePath: '',
        nameBg: '',
        nameEn: '',
        descriptionBg: '',
        descriptionEn: '',
        price: '',
        products: []
    });
    const [newGroupProduct, setNewGroupProduct] = useState({
        id: '',
        imagePath: '',
        nameBg: '',
        nameEn: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editFiles, setEditFiles] = useState({}); // To track file changes for edited products
    const [descriptionOpen, setDescriptionOpen] = useState({});

    useEffect(() => {
        const getProducts = async () => {
            const response = await axios.get(URL + "/products");
            response.data.forEach(product => {
                if (product.descriptionBg) {
                    product.descriptionBg = product.descriptionBg.replace(/<p><br><\/p>/g, "\n");
                }
                if (product.descriptionEn) {
                    product.descriptionEn = product.descriptionEn.replace(/<p><br><\/p>/g, "\n");
                }
            });
            setProducts(response.data);
        };

        getProducts();
    }, []);

    // Handles the change in the input fields for the new product
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Handles the change in the input fields for the new group
    const handleGroupInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup({ ...newGroup, [name]: value });
    };

    // Handles the image file selection for new products
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handles the image file selection for new groups
    const handleGroupFileChange = (e) => {
        setNewGroup({ ...newGroup, imagePath: e.target.files[0] });
    };

    // Handles the image file selection for edited products
    const handleEditFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedEditFiles = { ...editFiles, [index]: file };
            setEditFiles(updatedEditFiles); // Track the new file for the product being edited
        }
    };

    // Handles the change for editing existing products (excluding images)
    const handleEditProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };
        setProducts(updatedProducts);
    };

    // Handles the change for editing existing group parent (excluding images)
    const handleEditGroupParentChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };
        setProducts(updatedProducts);
    };

    // Handles the change for editing existing products inside a group (excluding images)
    const handleEditGroupProductChange = (groupIndex, productIndex, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...products];
        updatedProducts[groupIndex].products[productIndex] = { ...updatedProducts[groupIndex].products[productIndex], [name]: value };
        setProducts(updatedProducts);
    };

    // Deletes an existing product
    const handleDeleteProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    // Deletes an existing group
    const handleDeleteGroup = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    // Deletes a product inside a group
    const handleDeleteGroupProduct = (groupIndex, productIndex) => {
        const updatedProducts = [...products];
        updatedProducts[groupIndex].products.splice(productIndex, 1);
        setProducts(updatedProducts);
    };

    const addProduct = async () => {
        newProduct.id = uuidv4();

        try {
            const formData = new FormData();
            if (selectedFile) {
                formData.append("image", selectedFile);
                const response = await axios.post(URL + "/image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                // Update the image path immediately after successful upload
                newProduct.imagePath = response.data.image;
                setProducts([...products, newProduct]); // Add new product to state
                setNewProduct({ id: '', type: 'single', imagePath: '', nameBg: '', nameEn: '', price: '' });
                setSelectedFile(null); // Clear the file input after adding
            } else {
                alert("No file selected for upload.");
            }
        } catch (err) {
            alert(err);
        }
    };

    const addGroup = async () => {
        newGroup.id = uuidv4();

        try {
            const formData = new FormData();
            if (newGroup.imagePath) {
                formData.append("image", newGroup.imagePath);
                const response = await axios.post(URL + "/image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                // Update the image path immediately after successful upload
                newGroup.imagePath = response.data.image;
                setProducts([...products, newGroup]); // Add new group to state
                setNewGroup({ id: '', type: 'group', imagePath: '', nameBg: '', nameEn: '', price: '', products: [] });
            } else {
                alert("No file selected for upload.");
            }
        } catch (err) {
            alert(err);
        }
    };

    // Handles the change in the input fields for the new product inside a group
    const handleNewGroupProductChange = (e) => {
        const { name, value } = e.target;
        setNewGroupProduct({ ...newGroupProduct, [name]: value });
    };

    // Handles the image file selection for new products inside a group
    const handleNewGroupProductFileChange = (e) => {
        setNewGroupProduct({ ...newGroupProduct, imagePath: e.target.files[0] });
    };

    // Handles the image file selection for edited products inside a group
    const handleEditGroupProductFileChange = (groupIndex, productIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedEditFiles = { ...editFiles, [`${groupIndex}-${productIndex}`]: file };
            setEditFiles(updatedEditFiles); // Track the new file for the product being edited inside the group
        }
    };

    // Adds a new product to a group
    const addGroupProduct = async (groupIndex) => {
        newGroupProduct.id = uuidv4();

        try {
            const formData = new FormData();
            if (newGroupProduct.imagePath) {
                formData.append("image", newGroupProduct.imagePath);
                const response = await axios.post(URL + "/image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                // Update the image path immediately after successful upload
                newGroupProduct.imagePath = response.data.image;
                const updatedProducts = [...products];
                updatedProducts[groupIndex].products.push(newGroupProduct);
                setProducts(updatedProducts); // Add new product to group
                setNewGroupProduct({ id: '', imagePath: '', nameBg: '', nameEn: '' });
            } else {
                alert("No file selected for upload.");
            }
        } catch (err) {
            alert(err);
        }
    };

    const saveProducts = async () => {
        try {
            // Handle image file upload for edited products if there are any changes
            const updatedProducts = [...products];

            for (let key in editFiles) {
                const file = editFiles[key];
                if (file) {
                    const formData = new FormData();
                    formData.append("image", file);
                    const response = await axios.post(URL + "/image", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });

                    // Update the image path immediately after successful upload
                    const [groupIndex, productIndex] = key.split('-');
                    if (productIndex !== undefined) {
                        updatedProducts[groupIndex].products[productIndex].imagePath = response.data.image;
                    } else {
                        updatedProducts[groupIndex].imagePath = response.data.image;
                    }
                }
            }

            await axios.post(URL + "/products/edit", {
                newProducts: updatedProducts
            });

            alert("Successfully saved products");
            setEditFiles({}); // Clear edited files after saving
            setProducts(updatedProducts); // Update the products state
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div style={{margin: "0 10%", marginBottom: "36px"}}>
            <h2 style={{fontSize: "48px", margin: "0"}}>Products Manager</h2>

            <button onClick={saveProducts}>Save</button>
            <button onClick={() => {document.location.href = "/admin"}}>Home</button>
            <br />
            <br />

            <div style={{display: "flex", alignContent: "start", flexWrap: "wrap", gap: "12px"}}>
                {/* Rendering existing products with editable fields */}
                {products.length > 0 ? products.map((item, index) => (
                    item.type !== 'group' ? (
                        <div key={index} style={{width: "300px"}}>
                            {item.imagePath && (
                                <img alt={item.nameEn} src={URL + "/image?name=" + item.imagePath} style={{width: "300px", height: "400px"}} />
                            )}
                            <br />
                            <label>
                                Change Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{marginTop: "0", marginBottom: "6px"}}
                                    onChange={(e) => handleEditFileChange(index, e)} // Handle image changes
                                />
                            </label>
                            <br />
                            <label>
                                Name (BG):
                                <input
                                    type="text"
                                    name="nameBg"
                                    value={item.nameBg}
                                    onChange={(e) => handleEditProductChange(index, e)}
                                />
                            </label>
                            <br />
                            <label>
                                Name (EN):
                                <input
                                    type="text"
                                    name="nameEn"
                                    value={item.nameEn}
                                    onChange={(e) => handleEditProductChange(index, e)}
                                />
                            </label>
                            <br />
                            <label className="description">
                                Description (BG)
                                <button
                                    name="descriptionBg"
                                    value={item.descriptionBg}
                                    onClick={(e) => {
                                        if(!e.target.closest(".description-content")) {
                                            setDescriptionOpen({...descriptionOpen, [item.id]: {bg: true, en: false}})
                                        }
                                    }}
                                    style={{height: "24px", width: "24px", border: "none", backgroundColor: ""}}
                                >
                                    <MdModeEdit />
                                    <div className="description-content" style={{display: descriptionOpen[item.id]?.bg ? "block" : "none"}}
                                        onClick={(e) => {
                                            if (!e.target.closest(".description-editor")) {
                                                setDescriptionOpen({ ...descriptionOpen, [item.id]: {bg: false, en: false} });
                                            }
                                        }}
                                    >
                                        <div className="description-close">
                                            <IoClose />
                                        </div>
                                        <div className="description-editor">
                                            {descriptionOpen[item.id]?.bg && (<>
                                                <MyCustomToolbar id={`toolbar-${item.id}-bg`} />
                                                <ReactQuill
                                                    value={item.descriptionBg}
                                                    onChange={(e) =>
                                                        handleEditProductChange(index, {target: {name: "descriptionBg", value: e.replace(/ style="[^"]*"/g, '')}})
                                                    }
                                                    modules={{
                                                        clipboard: {
                                                            matchVisual: false, // Prevent Quill from auto-inserting new lines
                                                        },
                                                        toolbar: {
                                                            container: `#toolbar-${item.id}-bg`,
                                                        },
                                                    }}
                                                />
                                            </>)}
                                        </div>
                                    </div>
                                </button>

                            </label>
                            <label className="description">
                                Description (EN)
                                <button
                                    name="descriptionEn"
                                    value={item.descriptionEn}
                                    onClick={(e) => {
                                        if(!e.target.closest(".description-content")) {
                                            setDescriptionOpen({...descriptionOpen, [item.id]: {bg: false, en: true}})
                                        }
                                    }}
                                    style={{height: "24px", width: "24px", border: "none", backgroundColor: ""}}
                                >
                                    <MdModeEdit />
                                    <div className="description-content" style={{display: descriptionOpen[item.id]?.en ? "block" : "none"}}
                                        onClick={(e) => {
                                            if (!e.target.closest(".description-editor")) {
                                                setDescriptionOpen({ ...descriptionOpen, [item.id]: {bg: false, en: false} });
                                            }
                                        }}
                                    >
                                        <div className="description-close">
                                            <IoClose />
                                        </div>
                                        <div className="description-editor">
                                            {descriptionOpen[item.id]?.en && (<>
                                                <MyCustomToolbar id={`toolbar-${item.id}-en`} />
                                                <ReactQuill
                                                    value={item.descriptionEn}
                                                    onChange={(e) =>
                                                        handleEditProductChange(index, {target: {name: "descriptionEn", value: e.replace(/ style="[^"]*"/g, '')}})
                                                    }
                                                    modules={{
                                                        clipboard: {
                                                            matchVisual: false, // Prevent Quill from auto-inserting new lines
                                                        },
                                                        toolbar: {
                                                            container: `#toolbar-${item.id}-en`,
                                                        },
                                                    }}
                                                />
                                            </>)}
                                        </div>
                                    </div>
                                </button>

                            </label>
                            <br />
                            <label>
                                Price:
                                <input
                                    type="text"
                                    name="price"
                                    value={item.price}
                                    onChange={(e) => handleEditProductChange(index, e)}
                                />
                            </label>
                            <br />
                            <button style={{marginTop: "6px"}} type="button" onClick={() => handleDeleteProduct(index)}>Delete</button>
                        </div>
                    ) : (
                        <div key={index} style={{width: "100%", display: "flex", alignContent: "start", flexWrap: "wrap", gap: "12px", backgroundColor: "rgba(148, 133, 108, 0.7)", padding: "12px", borderRadius: "42px"}}>
                            <div style={{display: "flex", flexDirection: "column", width: "300px", padding: "12px", borderRadius: "30px", backgroundColor: "rgba(148, 133, 108, 0.7)"}}>
                                <h2 style={{marginBottom: "6px", marginTop: "0", textAlign: "center"}}>Group Parent</h2>
                                {item.imagePath && (
                                    <img alt={item.nameEn} src={URL + "/image?name=" + item.imagePath} style={{width: "300px", height: "400px"}} />
                                )}
                                <label>
                                    Change Image:
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{marginTop: "0", marginBottom: "6px"}}
                                        onChange={(e) => handleEditFileChange(index, e)} // Handle image changes
                                    />
                                </label>
                                <label>
                                    Name (BG):
                                    <input
                                        type="text"
                                        name="nameBg"
                                        value={item.nameBg}
                                        onChange={(e) => handleEditGroupParentChange(index, e)}
                                    />
                                </label>
                                <label>
                                    Name (EN):
                                    <input
                                        type="text"
                                        name="nameEn"
                                        value={item.nameEn}
                                        onChange={(e) => handleEditGroupParentChange(index, e)}
                                    />
                                </label>
                                <label className="description">
                                    Description (BG)
                                    <button
                                        name="descriptionBg"
                                        value={item.descriptionBg}
                                        onClick={(e) => {
                                            if(!e.target.closest(".description-content")) {
                                                setDescriptionOpen({...descriptionOpen, [item.id]: {bg: true, en: false}})
                                            }
                                        }}
                                        style={{height: "24px", width: "24px", border: "none", backgroundColor: ""}}
                                    >
                                        <MdModeEdit />
                                        <div className="description-content" style={{display: descriptionOpen[item.id]?.bg ? "block" : "none"}}
                                            onClick={(e) => {
                                                if (!e.target.closest(".description-editor")) {
                                                    setDescriptionOpen({ ...descriptionOpen, [item.id]: {bg: false, en: false} });
                                                }
                                            }}
                                        >
                                            <div className="description-close">
                                                <IoClose />
                                            </div>
                                            <div className="description-editor">
                                                {descriptionOpen[item.id]?.bg && (<>
                                                    <MyCustomToolbar id={`toolbar-${item.id}-bg`} />
                                                    <ReactQuill
                                                        value={item.descriptionBg}
                                                        onChange={(e) =>
                                                            handleEditProductChange(index, {target: {name: "descriptionBg", value: e.replace(/ style="[^"]*"/g, '')}})
                                                        }
                                                        modules={{
                                                            clipboard: {
                                                                matchVisual: false, // Prevent Quill from auto-inserting new lines
                                                            },
                                                            toolbar: {
                                                                container: `#toolbar-${item.id}-bg`,
                                                            },
                                                        }}
                                                    />
                                                </>)}
                                            </div>
                                        </div>
                                    </button>

                                </label>
                                <label className="description">
                                    Description (EN)
                                    <button
                                        name="descriptionEn"
                                        value={item.descriptionEn}
                                        onClick={(e) => {
                                            if(!e.target.closest(".description-content")) {
                                                setDescriptionOpen({...descriptionOpen, [item.id]: {bg: false, en: true}})
                                            }
                                        }}
                                        style={{height: "24px", width: "24px", border: "none", backgroundColor: ""}}
                                    >
                                        <MdModeEdit />
                                        <div className="description-content" style={{display: descriptionOpen[item.id]?.en ? "block" : "none"}}
                                            onClick={(e) => {
                                                if (!e.target.closest(".description-editor")) {
                                                    setDescriptionOpen({ ...descriptionOpen, [item.id]: {bg: false, en: false} });
                                                }
                                            }}
                                        >
                                            <div className="description-close">
                                                <IoClose />
                                            </div>
                                            <div className="description-editor">
                                                {descriptionOpen[item.id]?.en && (<>
                                                    <MyCustomToolbar id={`toolbar-${item.id}-en`} />
                                                    <ReactQuill
                                                        value={item.descriptionEn}
                                                        onChange={(e) =>
                                                            handleEditProductChange(index, {target: {name: "descriptionEn", value: e.replace(/ style="[^"]*"/g, '')}})
                                                        }
                                                        modules={{
                                                            clipboard: {
                                                                matchVisual: false, // Prevent Quill from auto-inserting new lines
                                                            },
                                                            toolbar: {
                                                                container: `#toolbar-${item.id}-en`,
                                                            },
                                                        }}
                                                    />
                                                </>)}
                                            </div>
                                        </div>
                                    </button>

                                </label>
                                <label>
                                    Price:
                                    <input
                                        type="text"
                                        name="price"
                                        value={item.price}
                                        onChange={(e) => handleEditGroupParentChange(index, e)}
                                    />
                                </label>
                                <button style={{marginTop: "6px"}} type="button" onClick={() => handleDeleteGroup(index)}>Delete</button>
                            </div>

                            {/* Shows the existing products inside the group */}
                            {item.products.map((product, productIndex) => (
                                <div key={productIndex} style={{marginLeft: "20px", width: "300px"}}>
                                    {product.imagePath && (
                                        <img alt={product.nameEn} src={URL + "/image?name=" + product.imagePath} style={{width: "300px", height: "400px"}} />
                                    )}
                                    <br />
                                    <label>
                                        Change Image:
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{marginTop: "0", marginBottom: "6px"}}
                                            onChange={(e) => handleEditGroupProductFileChange(index, productIndex, e)} // Handle image changes
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Name (BG):
                                        <input
                                            type="text"
                                            name="nameBg"
                                            value={product.nameBg}
                                            onChange={(e) => handleEditGroupProductChange(index, productIndex, e)}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Name (EN):
                                        <input
                                            type="text"
                                            name="nameEn"
                                            value={product.nameEn}
                                            onChange={(e) => handleEditGroupProductChange(index, productIndex, e)}
                                        />
                                    </label>
                                    <br />
                                    <button style={{marginTop: "6px"}} type="button" onClick={() => handleDeleteGroupProduct(index, productIndex)}>Delete</button>
                                </div>
                            ))}

                            {/* Form to add new product inside the group */}
                            <div style={{marginLeft: "20px", width: "300px"}}>
                                <h3 style={{fontSize: "24px", margin: "0"}}>Add New Product to Group</h3>
                                <form>
                                    <label>
                                        Choose Image:
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{marginTop: "0", marginBottom: "6px"}}
                                            onChange={handleNewGroupProductFileChange}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Name (BG):
                                        <input
                                            type="text"
                                            name="nameBg"
                                            value={newGroupProduct.nameBg}
                                            onChange={handleNewGroupProductChange}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Name (EN):
                                        <input
                                            type="text"
                                            name="nameEn"
                                            value={newGroupProduct.nameEn}
                                            onChange={handleNewGroupProductChange}
                                        />
                                    </label>
                                    <br />
                                    <button style={{margin: "6px 0"}} type="button" onClick={() => addGroupProduct(index)}>Add Product to Group</button>
                                </form>
                            </div>
                        </div>
                    )
                )) : <div>No Products</div>}

                <div style={{width: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    {/* Form to add new product */}
                    <div>
                        <h3 style={{fontSize: "36px", margin: "0"}}>Add New Product</h3>
                        <form>
                            <label>
                                Choose Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{marginTop: "0", marginBottom: "6px"}}
                                    onChange={handleFileChange}
                                />
                            </label>
                            <br />
                            <label>
                                Name (BG):
                                <input
                                    type="text"
                                    name="nameBg"
                                    value={newProduct.nameBg}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Name (EN):
                                <input
                                    type="text"
                                    name="nameEn"
                                    value={newProduct.nameEn}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Price:
                                <input
                                    type="text"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br />
                            <button style={{margin: "6px 0"}} type="button" onClick={addProduct}>Add Product</button>
                        </form>
                    </div>

                    <h2 style={{textAlign: "center"}}>Or</h2>

                    {/* Form to add group of products */}
                    <div>
                        <h3 style={{fontSize: "36px", margin: "0"}}>Add Group of Products</h3>
                        <form>
                            <label>
                                Choose Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{marginTop: "0", marginBottom: "6px"}}
                                    onChange={handleGroupFileChange}
                                />
                            </label>
                            <br />
                            <label>
                                Name (BG):
                                <input
                                    type="text"
                                    name="nameBg"
                                    value={newGroup.nameBg}
                                    onChange={handleGroupInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Name (EN):
                                <input
                                    type="text"
                                    name="nameEn"
                                    value={newGroup.nameEn}
                                    onChange={handleGroupInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Price:
                                <input
                                    type="text"
                                    name="price"
                                    value={newGroup.price}
                                    onChange={handleGroupInputChange}
                                />
                            </label>
                            <br />
                            <button style={{margin: "6px 0"}} type="button" onClick={addGroup}>Add Group</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManager;