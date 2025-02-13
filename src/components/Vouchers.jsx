import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';
import Cart from './Cart';
import voucherFormImage from './images/forUsBack.webp';

const VoucherForm = ({lang}) => {
    return (
        <div id="voucherForm">
            <form action="https://api.web3forms.com/submit" method="post" style={{ maxWidth: '100%' }}>
                <input type="hidden" name="access_key" value="218421e2-dd98-4307-b489-5748ec4d492e" />

                <div id="voucherTypeForm">
                    <label htmlFor="voucherType">
                        <select id="voucherType" name="voucherType" required defaultValue="">
                            <option value="" disabled>Voucher Type</option>
                            <option value="ride">{lang === "bg" ? "Езда" : "Ride"}</option>
                            <option value="meeting_with_falabela">{lang === "bg" ? "Среща с Фалабела" : "Meeting with Falabela"}</option>
                            <option value="photoshoot_with_horses">{lang === "bg" ? "Фотосесия с коне" : "Photoshoot with Horses"}</option>
                            <option value="ride_falabela">{lang === "bg" ? "Езда + Фалабела" : "Ride + Falabela"}</option>
                            <option value="photoshoot_falabela">{lang === "bg" ? "Фотосесия + Фалабела" : "Photoshoot + Falabela"}</option>
                            <option value="ride_photoshoot">{lang === "bg" ? "Езда + Фотосесия" : "Ride + Photoshoot"}</option>
                            <option value="ride_falabela_photoshoot">{lang === "bg" ? "Езда + Фалабела + Фотосесия" : "Ride + Falabela + Photoshoot"}</option>
                        </select>    
                    </label>

                    <img alt="" src={voucherFormImage} />
                </div>

                <label htmlFor="fromWho">
                    <input type="text" id="fromWho" placeholder="Full name" name="fromWho" required />
                </label>

                <label htmlFor="hours">
                    <input type="number" id="hours" placeholder="Hours" name="hours" required />
                </label>

                <label htmlFor="phone">
                    <input type="tel" id="phone" placeholder="Phone Number" name="phone" required />                    
                </label>

                <label htmlFor="email">
                    <input type="email" id="email" placeholder="E-mail Address" name="email" required />
                </label>

                <label htmlFor="note">
                    <textarea id="note" placeholder="Message" name="note"></textarea>
                </label>

                <label htmlFor="toWho">
                    <input type="text" id="toWho" placeholder="Name of receiver" name="toWho" required />
                </label>

                <label htmlFor="address">
                    <input type="text" id="address" placeholder="Address of receiver" name="address" required />
                </label>

                {/* Custom Success Page Redirect */}
                <input type="hidden" name="redirect" value={`${window.location.origin}/success`} />

                <div id='voucherFormSubmit'>
                    <input type="submit" className='linkButton' value={lang === "bg" ? "Изпрати" : "Submit"} />
                </div>
            </form>
        </div>
    );
};

const Vouchers = () => {
    const [products, setProducts] = useState([]);
    const [lang, setLang] = useState('bg');

    useEffect(() => {
        const GetProducts = async () => {
            const response = await axios.get("/server/files/products.json");
            setProducts(response.data);
        };

        GetProducts();
    }, []);

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
            <h1 id='title' style={{textAlign: "left", marginBottom: "24px"}}>{lang === "bg" ? "Ваучери" : "Vouchers"}</h1>

            <VoucherForm lang={lang} />

            <h2 id='title' style={{fontSize: "30px", marginTop: "22px", marginBottom: "20px"}}>{lang === "bg" ? "Може да ви хареса" : "You will also like"}:</h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "20px", width: "80%", margin: "auto", marginBottom: "72px" }}>
            {products.map((product) => (
                <div key={product.id} className='item cursorPointer' id="productVoucher" onClick={() => document.location.href = `/product/${product.id}`}>
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
    );
};

export { Vouchers, VoucherForm };