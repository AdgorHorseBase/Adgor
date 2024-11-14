import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedVouchers, setSelectedVouchers] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [lang, setLang] = useState('bg');

    useEffect(() => {
        const GetVouchers = async () => {
            const response = await axios.get("/server/files/vouchers.json");
            setVouchers(response.data);
        };

        const GetProducts = async () => {
            const response = await axios.get("/server/files/products.json");
            setProducts(response.data);
        };
        
        GetVouchers();
        GetProducts();
    }, []);

    const addVoucher = (voucher) => {
        setSelectedVouchers(prev => {
            const newQuantity = (prev[voucher.id]?.quantity || 0) + 1;
            return {
                ...prev,
                [voucher.id]: { ...voucher, quantity: newQuantity }
            };
        });
    };

    const removeVoucher = (voucher) => {
        setSelectedVouchers(prev => {
            const newQuantity = (prev[voucher.id]?.quantity || 0) - 1;
            if (newQuantity <= 0) {
                const { [voucher.id]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [voucher.id]: { ...voucher, quantity: newQuantity }
            };
        });
    };

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
        console.log(selectedVouchers);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    useEffect(() => {
        if (localStorage.getItem('lang')) {
            setLang(localStorage.getItem('lang'));
        }
    }, [localStorage.getItem('lang')]);

    return (
        <div>
            <MenuSections />
            <h1 id='title' style={{textAlign: "left", marginBottom: "24px"}}>{lang === "bg" ? "Ваучери" : "Vouchers"}</h1>

            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", flexWrap: 'wrap', gap: '20px', width: "80%", margin: "auto" }}>
                {vouchers.length === 0 ? <div>Vouchers coming soon</div> : vouchers.map((item) => (
                    <div key={item.id} className='item' style={{ width: '300px', textAlign: 'center' }}>
                        {item.imagePath && (
                            <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={`/server/files/images/${item.imagePath}`} width="100%" />
                        )}
                        {(item.nameBg || item.nameEn) && (
                            <h2 style={{margin: "0", textAlign: "left", fontSize: "26px"}}>{lang === "bg" ? item.nameBg : item.nameEn}</h2>
                        )}
                        {item.price && (
                            <h3 style={{margin: "0", textAlign: "left", fontSize: "20px"}}>{item.price} лв</h3>
                        )}
                        {selectedVouchers[item.id]?.quantity > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <button onClick={() => removeVoucher(item)} style={{ margin: '0' }}>
                                    -
                                </button>
                                <p style={{ margin: "0" }}>{selectedVouchers[item.id]?.quantity}</p>
                                <button onClick={() => addVoucher(item)} style={{ margin: '0' }}>
                                    +
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => addVoucher(item)} style={{ margin: '0' }}>
                                {lang === "bg" ? "Добави" : "Add"}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleContinue} style={{ marginTop: '20px', padding: '10px 20px', marginLeft: "10%", marginBottom: "0" }}>
                {lang === "bg" ? "Продължи" : "Continue"}
            </button>

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#e5d5c0', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '500px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', position: 'relative', maxHeight: '80%', overflowY: 'auto' }}>
                        <button 
                            onClick={handleCloseForm} 
                            style={{ 
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px', 
                                background: 'none', 
                                border: 'none', 
                                fontSize: '30px', // Increase font size to make it bigger
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                borderRadius: '50%',
                                width: '47px',
                                height: '47px',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'} // Red background on hover
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <svg x="0px" y="0px" width="20" height="20" viewBox="0 0 122.878 122.88"><g><path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z"/></g></svg>
                        </button>
                        <h2>{lang === "bg" ? "Количка" : "Checkout"}</h2>
                        <form action="https://api.web3forms.com/submit" method="post" style={{ maxWidth: '100%' }}>
                            <input type="hidden" name="access_key" value="218421e2-dd98-4307-b489-5748ec4d492e" />

                            <label htmlFor="name">{lang === "bg" ? "Име" : "Name"}:</label>
                            <input type="text" id="name" name="name" required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box', backgroundColor: "#f7f1e9", border: "none", borderRadius: "16px" }} /><br /><br />
                            
                            <label htmlFor="email">{lang === "bg" ? "Имейл" : "Email"}:</label>
                            <input type="email" id="email" name="email" required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box', backgroundColor: "#f7f1e9", border: "none", borderRadius: "16px" }} /><br /><br />

                            <label htmlFor="phone">{lang === "bg" ? "Телефонен Номер" : "Phone Number"}:</label>
                            <input type="tel" id="phone" name="phone" required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box', backgroundColor: "#f7f1e9", border: "none", borderRadius: "16px" }} /><br /><br />

                            <label htmlFor="address">{lang === "bg" ? "Адрес" : "Address"}:</label>
                            <input type="text" id="address" name="address" required style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box', backgroundColor: "#f7f1e9", border: "none", borderRadius: "16px" }} /><br /><br />

                            <h3>{lang == "bg" ? "Избрани Ваучери" : "Selected Vouchers"}:</h3>
                            <ul>
                                {Object.keys(selectedVouchers).map(voucherId => {
                                    const voucher = selectedVouchers[voucherId];
                                    return (
                                        <li key={voucherId}>
                                            {voucher.quantity} &times; {lang === "bg" ? voucher.nameBg : voucher.nameEn}
                                        </li>
                                    );
                                })}
                            </ul>

                            <h3>{lang === "bg" ? "Избрани Продукти" : "Selected Products"}:</h3>
                            <ul>
                                {Object.keys(selectedProducts).map(productId => {
                                    const product = selectedProducts[productId];
                                    return (
                                        <li key={productId}>
                                            {product.quantity} &times; {lang === "bg" ? product.nameBg : product.nameEn}
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Hidden inputs to include the selected products in the form submission */}
                            {Object.keys(selectedVouchers).map(voucherId => {
                                const voucher = selectedVouchers[voucherId];
                                return (
                                    <div key={voucherId}>
                                        <input type="hidden" name={voucher.name} value={`Quantity: ${voucher.quantity}`} />
                                    </div>
                                );
                            })}

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

                            <input type="submit" value={lang === "bg" ? "Изпрати" : "Submit"} style={{ width: '100%', padding: '10px', backgroundColor: '#d19d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                        </form>
                    </div>
                </div>
            )}

            <h2 id='title' style={{fontSize: "30px", marginTop: "22px"}}>{lang === "bg" ? "Може да ви хареса" : "You will also like"}:</h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "20px", width: "80%", margin: "auto", marginBottom: "24px" }}>
                {products.map((product) => (
                    <div key={product.id} className='item' style={{ width: '300px', textAlign: 'center' }}>
                        {product.imagePath && (
                            <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={`/server/files/images/${product.imagePath}`} width="100%" />
                        )}
                        {(product.nameBg || product.nameEn) && (
                            <h2 style={{margin: "0", textAlign: "left", fontSize: "26px"}}>{lang === "bg" ? product.nameBg : product.nameEn}</h2>
                        )}
                        {product.price && (
                            <h3 style={{margin: "0", textAlign: "left", fontSize: "20px"}}>{product.price} лв</h3>
                        )}
                        {selectedProducts[product.id]?.quantity > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <button onClick={() => removeProduct(product)} style={{ margin: '0' }}>
                                    -
                                </button>
                                <p style={{ margin: "0" }}>{selectedProducts[product.id]?.quantity}</p>
                                <button onClick={() => addProduct(product)} style={{ margin: '0' }}>
                                    +
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => addProduct(product)} style={{ margin: '0' }}>
                                {lang === "bg" ? "Добави" : "Add"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vouchers;