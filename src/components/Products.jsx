import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';
import Cart from './Cart';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [lang, setLang] = useState('bg');

    useEffect(() => {
        const GetProducts = async () => {
            const response = await axios.get("/server/files/products.json");
            setProducts(response.data);
        };
        
        GetProducts();

        // FIX: Make it check if there are such products
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setSelectedProducts(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const storedLang = localStorage.getItem("lang");

    useEffect(() => {
        if (storedLang) {
            setLang(storedLang);
        }
    }, [storedLang]);

    return (
        <div>
            <Cart />
            <div id="StickyMenu">
                <MenuSections />
            </div>
            <h1 id='title' >{lang === "bg" ? "Подаръци" : "Gifts"}</h1>
            <div className='holder' style={{ display: 'flex', justifyContent: "center", flexWrap: 'wrap', gap: '100px', width: "80%", margin: "auto", marginBottom: "72px" }}>
                {products.length === 0 ? <div>{lang === "bg" ? "Подаръците идват скоро" : "Gifts coming soon"}</div> : products.map((item) => (
                    <div id='productVoucher' key={item.id} className='item cursorPointer' onClick={() => document.location.href = `/product/${item.id}`}>
                        {item.imagePath && (
                            <img id='productImg' alt=""  src={"/server/files/images/"+item.imagePath}  />
                        )}
                        <div className="productBottom">
                        {(item.nameBg || item.nameEn) && (
                            <h2 id='productName' >{lang === "bg" ? item.nameBg : item.nameEn}</h2>
                        )}
                        {item.price && (
                            <h3 id='productPrice' >{item.price} лв</h3>
                        )}
                        <a id='seeMoreProduct'>{lang === "bg" ? "Виж повече" : "See more"}</a>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;