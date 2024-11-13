import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [lang, setLang] = useState('bg');

    useEffect(() => {
        const GetProducts = async () => {
            const response = await axios.get("/server/files/products.json");
            setProducts(response.data);
        };
        
        GetProducts();
    }, []);

    const addProduct = (product) => {
        setSelectedProducts(prev => {
            const newQuantity = (prev[product.id]?.quantity || 0) + 1;
            return {
                ...prev,
                [product.id]: { ...product, quantity: newQuantity }
            };
        });
    };

    const removeProduct = (product) => {
        setSelectedProducts(prev => {
            const newQuantity = (prev[product.id]?.quantity || 0) - 1;
            if (newQuantity <= 0) {
                const { [product.id]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [product.id]: { ...product, quantity: newQuantity }
            };
        });
    };

    const handleContinue = () => {
        setShowForm(true);
    };

    useEffect(() => {
        if (localStorage.getItem('lang')) {
            setLang(localStorage.getItem('lang'));
        }
    }, [localStorage.getItem('lang')]);

    return (
        <div>
            <MenuSections />
            <h1 id='title'>{lang === "bg" ? "Продукти" : "Products"}</h1>
            <div style={{ display: 'flex', justifyContent: "center", flexWrap: 'wrap', gap: '20px', width: "80%", margin: "auto" }}>
                {products.length === 0 ? <div>Products coming soon</div> : products.map((item) => (
                    <div key={item.id} className='item' style={{ width: '300px', textAlign: 'center' }}>
                        {item.imagePath && (
                            <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={"/server/files/images/"+item.imagePath} width="100%" />
                        )}
                        {(item.nameBg || item.nameEn) && (
                            <h2 style={{margin: "0", textAlign: "left", fontSize: "26px"}}>{lang === "bg" ? item.nameBg : item.nameEn}</h2>
                        )}
                        {item.price && (
                            <h3 style={{margin: "0", textAlign: "left", fontSize: "20px"}}>{item.price} лв</h3>
                        )}
                        {selectedProducts[item.id]?.quantity > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <button onClick={() => removeProduct(item)} style={{ margin: '0' }}>
                                    -
                                </button>
                                <p style={{ margin: "0" }}>{selectedProducts[item.id]?.quantity}</p>
                                <button onClick={() => addProduct(item)} style={{ margin: '0' }}>
                                    +
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => addProduct(item)} style={{ margin: '0' }}>
                                {lang === "bg" ? "Добави" : "Add"}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleContinue} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', marginLeft: "10%", marginBottom: "24px" }}>
                {lang === "bg" ? "Продължи" : "Continue"}
            </button>

            {showForm && (
                <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
                    <h2>Checkout Form</h2>
                    <form action="https://api.web3forms.com/submit" method="post">
                        <input type="hidden" name="access_key" value="218421e2-dd98-4307-b489-5748ec4d492e" />

                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required /><br /><br />
                        
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required /><br /><br />

                        <label htmlFor="phone">Phone Number:</label>
                        <input type="tel" id="phone" name="phone" required /><br /><br />

                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" required /><br /><br />

                        <h3>Selected Products:</h3>
                        <ul>
                            {Object.keys(selectedProducts).map(productId => {
                                const product = selectedProducts[productId];
                                return (
                                    <li key={productId}>
                                        {product.name} - Quantity: {product.quantity}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Hidden inputs to include the selected products in the form submission */}
                        {Object.keys(selectedProducts).map(productId => {
                            const product = selectedProducts[productId];
                            return (
                                <div key={productId}>
                                    <input type="hidden" name={product.name} value={`Quantity: ${product.quantity}`} />
                                </div>
                            );
                        })}

                        {/* Custom Success Page Redirect */}
                        <input type="hidden" name="redirect" value={`${window.location.origin}/success`} />

                        <input type="submit" />
                    </form>
                </div>
            )}
        </div>
    );
};

export default Products;