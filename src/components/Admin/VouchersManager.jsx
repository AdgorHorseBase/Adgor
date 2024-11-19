import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const VouchersManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [newVoucher, setNewVoucher] = useState({
        id: '',
        code: '',
        discount: '',
        nameBg: '',
        nameEn: ''
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

    // Deletes an existing voucher
    const handleDeleteVoucher = (index) => {
        const updatedVouchers = [...vouchers];
        updatedVouchers.splice(index, 1);
        setVouchers(updatedVouchers);
    }

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
                newVoucher.imagePath = response.data.image;
                setVouchers([...vouchers, newVoucher]); // Add new voucher to state
                setNewVoucher({ id: '', imagePath: '', nameBg: '', nameEn: '', price: '' });
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
            // Handle image file upload for edited vouchers if there are any changes
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
                    updatedVouchers[index].imagePath = response.data.image;
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
        <div style={{margin: "0 10%", marginBottom: "36px"}}>
            <h2 style={{fontSize: "48px", margin: "0"}}>Vouchers Manager</h2>

            <button onClick={saveVouchers}>Save</button>
            <button onClick={() => {document.location.href = "/admin"}}>Home</button>
            <br />
            <br />

            <div style={{display: "flex", alignContent: "start", flexWrap: "wrap", gap: "12px"}}>
                {/* Rendering existing vouchers with editable fields */}
                {vouchers.length > 0 ? vouchers.map((item, index) => (
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
                                onChange={(e) => handleEditVoucherChange(index, e)}
                            />
                        </label>
                        <br />
                        <label>
                            Name (EN):
                            <input
                                type="text"
                                name="nameEn"
                                value={item.nameEn}
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
                        <button style={{marginTop: "6px"}} type="button" onClick={() => handleDeleteVoucher(index)}>Delete</button>
                    </div>
                )) : <div>No Vouchers</div>}
            

                {/* Form to add new voucher */}
                <div style={{width: "300px"}}>
                    <h3 style={{fontSize: "36px", margin: "0"}}>Add New Voucher</h3>
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
                                value={newVoucher.nameBg}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Name (EN):
                            <input
                                type="text"
                                name="nameEn"
                                value={newVoucher.nameEn}
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
                        <button style={{margin: "6px 0"}} type="button" onClick={addVoucher}>Add Voucher</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VouchersManager;