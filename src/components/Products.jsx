import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';

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
            <div id="StickyMenu">
                <MenuSections />
            </div>
            <h1 id='title' style={{textAlign: "left", marginBottom: "24px"}}>{lang === "bg" ? "Подаръци" : "Gifts"}</h1>
            <div style={{ display: 'flex', justifyContent: "center", flexWrap: 'wrap', gap: '20px', width: "80%", margin: "auto", marginBottom: "72px" }}>
                {products.length === 0 ? <div>{lang === "bg" ? "Подаръците идват скоро" : "Gifts coming soon"}</div> : products.map((item) => (
                    <div id='productVoucher' key={item.id} className='item cursorPointer' onClick={() => document.location.href = `/product/${item.id}`}>
                        {item.imagePath && (
                            <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={"/server/files/images/"+item.imagePath} width="100%" />
                        )}
                        {(item.nameBg || item.nameEn) && (
                            <h2 style={{margin: "0", textAlign: "left", fontSize: "26px"}}>{lang === "bg" ? item.nameBg : item.nameEn}</h2>
                        )}
                        {item.price && (
                            <h3 style={{margin: "0", textAlign: "left", fontSize: "20px"}}>{item.price} лв</h3>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;