import React, { useEffect, useState, useRef } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

const Cart = () => {
    const [isOpen, setIsOpen] = useState(false);
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
                    <button className="continueBtn">Continue</button>
                </div>
            ) : (
                // cartItems.lenght === 0 && <FaShoppingCart className="cartIcon" onClick={toggleCart} />
                <FaShoppingCart className="cartIcon" onClick={toggleCart} />
            )}
        </div>
    );
};

export default Cart;