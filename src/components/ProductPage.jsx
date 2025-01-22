import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MenuSections } from './Page';
import "./productPage.css";

const ProductPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [currProduct, setCurrProduct] = useState({});
    const [lang, setLang] = useState("bg");
    const [quantity, setQuantity] = useState(1);
    const [selectedType, setSelectedType] = useState("");

    const storedLang = localStorage.getItem("lang");
    
    useEffect(() => {
        if (storedLang) {
            setLang(storedLang);
        }
    }, [storedLang]);

    useEffect(() => {
        const GetProducts = async () => {
            const response = await axios.get("/server/files/products.json");
            setProducts(response.data);
        };
        
        GetProducts();
    }, []);

    useEffect(() => {
        if(products.length > 0 && id) {
            setCurrProduct(products.find(product => product.id === id) || products.find(product => product.products && product.products.find(p => p.id === id)).find(p => p.id === id));
        }
    }, [products, id]);

    const addToCart = () => {
        if(currProduct.products && !selectedType) {
            return alert(lang === "bg" ? "Моля изберете вид на продукта" : "Please select a product type");
        }

        let cart = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(cart) && cart.length === 0) {
            cart = {};
        }
        const productToAdd = selectedType ? currProduct.products.find(type => type.id === selectedType) : currProduct;
        const idToUse = selectedType ? selectedType : id;
        if(selectedType && !productToAdd.nameEn.includes(currProduct.nameEn)) {
            productToAdd.parentNameBg = currProduct.nameBg;
            productToAdd.parentNameEn = currProduct.nameEn;
            productToAdd.price = currProduct.price;
        }
        cart[idToUse] = { ...productToAdd, quantity: cart[idToUse]?.quantity ? (quantity + cart[idToUse].quantity) : quantity };
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    return (
        <div style={{marginBottom: "72px", width: "100%"}}>  
            <div id="StickyMenu">
                <MenuSections />
            </div>

            <div className='product' style={{marginTop: "100px"}}>
                <div className='productDetails'>
                    <img src={`/server/files/images/${selectedType ? currProduct.products.find(type => type.id === selectedType).imagePath : currProduct.imagePath}`} alt='' />
                    <div>
                        <h1 className='productTitle'>{lang === "bg" ? currProduct.nameBg : currProduct.nameEn}</h1>
                        <h3 className='productDescription normalText'>{lang === "bg" ? currProduct.descriptionBg : currProduct.descriptionEn}</h3>
                        <p className='productPrice'>{currProduct.price} лв</p>

                        <div className='productButtons'>
                            {currProduct.products && currProduct.products.length > 0 && (
                                <div className='productTypes'>
                                    {currProduct.products.map(product => (
                                        <button
                                            key={product.id}
                                            className={selectedType === product.id ? 'selected' : ''}
                                            onClick={() => setSelectedType(product.id)}
                                        >
                                            {lang === "bg" ? product.nameBg : product.nameEn}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className='productQuantity'>
                                <button onClick={() => {quantity > 1 && setQuantity(quantity - 1)}}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => {setQuantity(quantity + 1)}}>+</button>
                            </div>
                            <button className='productAddToCart' onClick={addToCart}>{lang === "bg" ? "Добави в количката" : "Add to cart"}</button>
                        </div>
                    </div>
                </div>

                <div className='relatedProducts'>
                    <h2>{lang === "bg" ? "Може да ви хареса" : "You may also like"}</h2>

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
                        {products.map((product) => (
                            <div key={product.id} onClick={() => document.location.href = `/product/${product.id}`} className='item cursorPointer' id="productVoucher">
                                {product.imagePath && (
                                    <img alt="" style={{width: "300px", height: "400px", padding: "0", margin: "0"}} src={`/server/files/images/${product.imagePath}`} width="100%" />
                                )}
                                {(product.nameBg || product.nameEn) && (
                                    <h2 style={{margin: "0", textAlign: "left", fontSize: "26px"}}>{lang === "bg" ? product.nameBg : product.nameEn}</h2>
                                )}
                                {product.price && (
                                    <h3 style={{margin: "0", textAlign: "left", fontSize: "20px"}}>{product.price} лв</h3>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage
