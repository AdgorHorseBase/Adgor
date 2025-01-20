import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';

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

    const addProduct = (product, nameBg, nameEn) => {
        if(!nameBg && !nameEn) {
            setSelectedProducts(prev => {
                const newQuantity = (prev[product.id]?.quantity || 0) + 1;
                return {
                    ...prev,
                    [product.id]: { ...product, quantity: newQuantity }
                };
            });
        } else {
            setSelectedProducts(prev => {
                const newQuantity = (prev[product.id]?.quantity || 0) + 1;
                return {
                    ...prev,
                    [product.id]: { ...product, quantity: newQuantity, nameBg, nameEn }
                };
            });
        }
    };

    const removeProduct = (product, nameBg, nameEn) => {
        if(!nameBg && !nameEn) {
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
        } else {
            setSelectedProducts(prev => {
                const newQuantity = (prev[product.id]?.quantity || 0) - 1;
                if (newQuantity <= 0) {
                    const { [product.id]: _, ...rest } = prev;
                    return rest;
                }
                return {
                    ...prev,
                    [product.id]: { ...product, quantity: newQuantity, nameBg, nameEn }
                };
            });
        }
    };

    const handleContinue = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const storedLang = localStorage.getItem("lang");

    useEffect(() => {
        if (storedLang) {
            setLang(storedLang);
        }
    }, [storedLang]);

    return (
        <div>
            <div id="StickyMenu">
                <MenuSections />
            </div>
            <h1 id='title' style={{textAlign: "left", marginBottom: "24px"}}>{lang === "bg" ? "Ваучери" : "Vouchers"}</h1>

            {/* <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", flexWrap: 'wrap', gap: '20px', width: "80%", margin: "auto" }}>
                {vouchers.length === 0 ? <div>Vouchers coming soon</div> : vouchers.map((item) => (
                    <div key={item.id} className='item' id='productVoucher'>
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
                                <button id='itemButton' onClick={() => removeVoucher(item)} style={{ margin: '9px 0' }}>
                                    -
                                </button>
                                <p style={{ margin: "0" }}>{selectedVouchers[item.id]?.quantity}</p>
                                <button id='itemButton' onClick={() => addVoucher(item)} style={{ margin: '0' }}>
                                    +
                                </button>
                            </div>
                        ) : (
                            <button id='itemButton' onClick={() => addVoucher(item)} style={{ margin: '0', padding: '12px 24px' }}>
                                {lang === "bg" ? "Добави" : "Add"}
                            </button>
                        )}
                    </div>
                ))}
            </div> */}

            <div id="voucherForm">
                <form action="https://api.web3forms.com/submit" method="post" style={{ maxWidth: '100%' }}>
                    <input type="hidden" name="access_key" value="218421e2-dd98-4307-b489-5748ec4d492e" />

                    <label htmlFor="voucherType">
                        <span>{lang === "bg" ? "Тип Ваучер" : "Voucher Type"}:</span>
                        <select id="voucherType" name="voucherType" required>
                            <option value="ride">{lang === "bg" ? "Езда" : "Ride"}</option>
                            <option value="meeting_with_falabela">{lang === "bg" ? "Среща с Фалабела" : "Meeting with Falabela"}</option>
                            <option value="photoshoot_with_horses">{lang === "bg" ? "Фотосесия с коне" : "Photoshoot with Horses"}</option>
                            <option value="ride_falabela">{lang === "bg" ? "Езда + Фалабела" : "Ride + Falabela"}</option>
                            <option value="photoshoot_falabela">{lang === "bg" ? "Фотосесия + Фалабела" : "Photoshoot + Falabela"}</option>
                            <option value="ride_photoshoot">{lang === "bg" ? "Езда + Фотосесия" : "Ride + Photoshoot"}</option>
                            <option value="ride_falabela_photoshoot">{lang === "bg" ? "Езда + Фалабела + Фотосесия" : "Ride + Falabela + Photoshoot"}</option>
                        </select>    
                    </label>

                    <label htmlFor="hours">
                        <span>{lang === "bg" ? "Часове" : "Hours"}:</span>
                        <input type="number" id="hours" name="hours" required />
                    </label>

                    <label htmlFor="fromWho">
                        <span>{lang === "bg" ? "От Кого" : "From Who"}:</span>
                        <input type="text" id="fromWho" name="fromWho" required />
                    </label>

                    <label htmlFor="toWho">
                        <span>{lang === "bg" ? "До Кого" : "To Who"}:</span>
                        <input type="text" id="toWho" name="toWho" required />
                    </label>


                    <label htmlFor="name">
                        <span>{lang === "bg" ? "Име" : "Name"}:</span>
                        <input type="text" id="name" name="name" required />
                    </label>

                    <label htmlFor="phone">
                        <span>{lang === "bg" ? "Телефонен Номер" : "Phone Number"}:</span>
                        <input type="tel" id="phone" name="phone" required />                    
                    </label>

                    <label htmlFor="address">
                        <span>{lang === "bg" ? "Адрес за Доставка" : "Address for Shipping"}:</span>
                        <input type="text" id="address" name="address" required />
                    </label>

                    <label htmlFor="email">
                        <span>{lang === "bg" ? "Имейл" : "Email"}:</span>
                        <input type="email" id="email" name="email" required />
                    </label>

                    <label htmlFor="note">
                        <span>{lang === "bg" ? "Бележка" : "Note"}:</span>
                        <textarea id="note" name="note"></textarea>
                    </label>

                    {/* Custom Success Page Redirect */}
                    <input type="hidden" name="redirect" value={`${window.location.origin}/success`} />

                    <div id='voucherFormSubmit'>
                        <input type="submit" value={lang === "bg" ? "Изпрати" : "Submit"} />
                    </div>
                </form>
            </div>

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

                            <h3 style={{marginBottom: "0", marginTop: "8px"}}>{lang === "bg" ? "Избрани Продукти" : "Selected Products"}:</h3>
                            <ul style={{margin: "0"}}>
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
                            {Object.keys(selectedProducts).map(productId => {
                                const product = selectedProducts[productId];
                                return (
                                    <div key={productId}>
                                        <input type="hidden" name={product.nameEn} value={`Quantity: ${product.quantity}`} />
                                    </div>
                                );
                            })}

                            {/* Custom Success Page Redirect */}
                            <input type="hidden" name="redirect" value={`${window.location.origin}/success`} />

                            <input type="submit" value={lang === "bg" ? "Изпрати" : "Submit"} style={{ width: '100%', marginTop: "18px", padding: '10px', backgroundColor: '#d19d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                        </form>
                    </div>
                </div>
            )}

            <h2 id='title' style={{fontSize: "30px", marginTop: "22px", marginBottom: "20px"}}>{lang === "bg" ? "Може да ви хареса" : "You will also like"}:</h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "20px", width: "80%", margin: "auto", marginBottom: "24px" }}>
            {products.map((product) => (
                product.type !== "group" ? (
                    <div key={product.id} className='item' id="productVoucher">
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
                                <button id='itemButton' onClick={() => removeProduct(product)} style={{ margin: '9px 0' }}>
                                    -
                                </button>
                                <p style={{ margin: "0" }}>{selectedProducts[product.id]?.quantity}</p>
                                <button id="itemButton" onClick={() => addProduct(product)} style={{ margin: '0' }}>
                                    +
                                </button>
                            </div>
                        ) : (
                            <button id='itemButton' onClick={() => addProduct(product)} style={{ margin: "0", padding: '12px 24px' }}>
                                {lang === "bg" ? "Добави" : "Add"}
                            </button>
                        )}
                    </div>
                ) : (
                    <div id='productGroup' key={product.id} className='item' style={{width: product.expanded ? "fit-content" : "300px", padding: product.expanded ? "12px" : "0", background: product.expanded ? "rgba(148, 133, 108, 0.4)" : "transparent", borderRadius: "20px", display: 'flex', justifyContent: product.expanded ? "center": "start", flexWrap: 'wrap', gap: '20px'}}>
                        <div id='productVoucher' style={{backgroundColor: "transparent"}}>
                            {product.imagePath && (
                                <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={"/server/files/images/"+product.imagePath} width="100%" />
                            )}
                            {(product.nameBg || product.nameEn) && (
                                <h2 style={{margin: "0", textAlign: "left", fontSize: "26px"}}>{lang === "bg" ? product.nameBg : product.nameEn}</h2>
                            )}
                            {product.price && (
                                <h3 style={{margin: "0", textAlign: "left", fontSize: "20px"}}>{product.price} лв</h3>
                            )}
                            <button id='itemButton' onClick={() => setProducts(products.map(p => p.id === product.id ? {...p, expanded: !p.expanded} : p))} style={{ margin: '0', padding: '12px 24px' }}>
                                {product.expanded ? (lang === "bg" ? "Скрий" : "Hide") : (lang === "bg" ? "Разшири" : "Expand")}
                            </button>
                        </div>
                        {product.expanded && (
                            product.products.map(subItem => (
                                <div id='productVoucher' key={subItem.id}>
                                    <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={"/server/files/images/"+subItem.imagePath} />
                                    <h4 style={{ margin: '0', textAlign: 'left', fontSize: '26px' }}>{lang === "bg" ? subItem.nameBg : subItem.nameEn}</h4>
                                    {selectedProducts[subItem.id]?.quantity > 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <button id='itemButton' onClick={() => removeProduct(subItem, `${product.nameBg} ${subItem.nameBg}`, `${product.nameEn} ${subItem.nameEn}`)} style={{ margin: '9px 0' }}>
                                                -
                                            </button>
                                            <p style={{ margin: "0" }}>{selectedProducts[subItem.id]?.quantity}</p>
                                            <button id='itemButton' onClick={() => addProduct(subItem, `${product.nameBg} ${subItem.nameBg}`, `${product.nameEn} ${subItem.nameEn}`)} style={{ margin: '0' }}>
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button id='itemButton' onClick={() => addProduct(subItem, `${product.nameBg} ${subItem.nameBg}`, `${product.nameEn} ${subItem.nameEn}`)} style={{ margin: '0', padding: '12px 24px' }}>
                                            {lang === "bg" ? "Добави" : "Add"}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )
            ))}
            </div>

            <button id='itemButton' onClick={handleContinue} style={{ marginTop: '20px', padding: '10px 20px', marginLeft: "10%", marginBottom: "48px" }}>
                {lang === "bg" ? "Продължи" : "Continue"}
            </button>
        </div>
    );
};

export default Vouchers;