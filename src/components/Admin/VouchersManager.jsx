import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const VouchersManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [newVoucher, setNewVoucher] = useState({
        id: '',
        code: '',
        discount: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editFiles, setEditFiles] = useState({}); // To track file changes for edited vouchers

    useEffect(() => {
        const getVouchers = async () => {
            const response = await axios.get(URL + "/vouchers");
            setVouchers(response.data);
        };

        getVouchers();
    }, []);

    // Handles the change in the input fields for the new voucher
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVoucher({ ...newVoucher, [name]: value });
    };

    // Handles the image file selection for new vouchers
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handles the image file selection for edited vouchers
    const handleEditFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedEditFiles = { ...editFiles, [index]: file };
            setEditFiles(updatedEditFiles); // Track the new file for the voucher being edited
        }
    };

    // Handles the change for editing existing vouchers (excluding images)
    const handleEditVoucherChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVouchers = [...vouchers];
        updatedVouchers[index] = { ...updatedVouchers[index], [name]: value };
        setVouchers(updatedVouchers);
    };

    const addVoucher = async () => {
        newVoucher.id = uuidv4();
    
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
                newVoucher.imagePath = URL + "/image?name=" + response.data.image;
                setVouchers([...vouchers, newVoucher]); // Add new product to state
                setNewVoucher({ id: '', imagePath: '', name: '', price: '' });
                setSelectedFile(null); // Clear the file input after adding
            } else {
                alert("No file selected for upload.");
            }
        } catch (err) {
            alert(err);
        }
    };
    
    const saveVouchers = async () => {
        try {
            // Handle image file upload for edited products if there are any changes
            const updatedVouchers = [...vouchers];
    
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
                    updatedVouchers[index].imagePath = URL + "/image?name=" + response.data.image;
                }
            }
    
            await axios.post(URL + "/vouchers/edit", {
                newVouchers: updatedVouchers
            });
    
            alert("Successfully saved vouchers");
            setEditFiles({}); // Clear edited files after saving
            setVouchers(updatedVouchers); // Update the vouchers state
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div>
            <h1>Vouchers Manager</h1>
            <button onClick={saveVouchers}>Save</button>
            <button onClick={() => {document.location.href = "/admin"}}>Home</button>
            <br />
            <br />

            {/* Rendering existing products with editable fields */}
            {vouchers.length > 0 ? vouchers.map((item, index) => (
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
                            onChange={(e) => handleEditVoucherChange(index, e)}
                        />
                    </label>
                    <br />
                    <label>
                        Price:
                        <input
                            type="text"
                            name="price"
                            value={item.price}
                            onChange={(e) => handleEditVoucherChange(index, e)}
                        />
                    </label>
                    <br />
                </div>
            )) : <div>No Vouchers</div>}

            {/* Form to add new voucher */}
            <div>
                <h3>Add New Voucher</h3>
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
                            value={newVoucher.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Price:
                        <input
                            type="text"
                            name="price"
                            value={newVoucher.price}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button type="button" onClick={addVoucher}>Add Voucher</button>
                </form>
            </div>
        </div>
    );
};

export default VouchersManager;