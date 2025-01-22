import React, { useEffect, useState, useRef } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

const Cart = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const cartRef = useRef(null);
    const [lang, setLang] = useState("bg");

    const storedLang = localStorage.getItem("lang");

    useEffect(() => {
        if (storedLang) {
            setLang(storedLang);
        }
    }, [storedLang]);

    useEffect(() => {
        if (localStorage.getItem('cart')) {
            setCartItems(JSON.parse(localStorage.getItem('cart')));
        }

        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const handleContinue = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="cart" ref={cartRef}>
            {isOpen ? (
                <div className="cartMenu">
                    <button className="closeBtn" onClick={toggleCart}>
                        <FaTimes />
                    </button>
                    <div className="cartContent">
                        {Object.keys(cartItems).map(key => cartItems[key]).map((item) => {
                            return (
                                <div key={item.id} className="cartItem">
                                    <img src={`/server/files/images/${item.imagePath}`} alt={item.name} />
                                    <div>
                                        <h4>{lang === "bg" ? item.nameBg : item.nameEn}</h4>
                                        <p>{item.price}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <button className="continueBtn" onClick={handleContinue}>Continue</button>
                </div>
            ) : (
                // cartItems.lenght === 0 && <FaShoppingCart className="cartIcon" onClick={toggleCart} />
                <FaShoppingCart className="cartIcon" onClick={toggleCart} />
            )}

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#e5d5c0', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '500px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', position: 'relative', maxHeight: '80%', overflowY: 'auto' }}>
                        <button 
                            onClick={handleCloseForm} 
                            style={{ 
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px', 
                                background: 'none', 
                                border: 'none', 
                                fontSize: '30px', 
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                borderRadius: '50%',
                                width: '47px',
                                height: '47px',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'}
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

                            <h3 style={{marginBottom: "0", marginTop: "0"}}>{lang === "bg" ? "Избрани Продукти" : "Selected Products"}:</h3>
                            <ul style={{margin: "0"}}>
                                {Object.keys(cartItems).map(productId => {
                                    const product = cartItems[productId];
                                    return (
                                        <li key={productId}>
                                            {product.quantity} &times; {lang === "bg" ? product.nameBg : product.nameEn}
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Hidden inputs to include the selected products in the form submission */}
                            {Object.keys(cartItems).map(productId => {
                                const product = cartItems[productId];
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
        </div>
    );
};

export default Cart;