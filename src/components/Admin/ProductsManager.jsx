import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: '',
        imagePath: '',
        name: '',
        price: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editFiles, setEditFiles] = useState({}); // To track file changes for edited products

    useEffect(() => {
        const getProducts = async () => {
            const response = await axios.get(URL + "/products");
            setProducts(response.data);
        };

        getProducts();
    }, []);

    // Handles the change in the input fields for the new product
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Handles the image file selection for new products
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
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
                newProduct.imagePath = URL + "/image?name=" + response.data.image;
                setProducts([...products, newProduct]); // Add new product to state
                setNewProduct({ id: '', imagePath: '', name: '', price: '' });
                setSelectedFile(null); // Clear the file input after adding
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
    
            for (let index in editFiles) {
                const file = editFiles[index];
                if (file) {
                    const formData = new FormData();
                    formData.append("image", file);
                    const response = await axios.post(URL + "/image", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
    
                    // Update the image path immediately after successful upload
                    updatedProducts[index].imagePath = URL + "/image?name=" + response.data.image;
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
        <div>
            <h2>Products</h2>

            <button onClick={saveProducts}>Save</button>
            <button onClick={() => {document.location.href = "/admin"}}>Home</button>
            <br />
            <br />

            {/* Rendering existing products with editable fields */}
            {products.length > 0 ? products.map((item, index) => (
                <div key={index}>
                    {item.imagePath && (
                        <img alt={item.name} src={item.imagePath} style={{ width: "100px" }} />
                    )}
                    <br />
                    <label>
                        Change Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleEditFileChange(index, e)} // Handle image changes
                        />
                    </label>
                    <br />
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={item.name}
                            onChange={(e) => handleEditProductChange(index, e)}
                        />
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
                </div>
            )) : <div>No Products</div>}

            {/* Form to add new product */}
            <div>
                <h3>Add New Product</h3>
                <form>
                    <label>
                        Choose Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    <br />
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={newProduct.name}
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
                    <button type="button" onClick={addProduct}>Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductsManager;