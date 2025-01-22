import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';
import Cart from './Cart';

const VoucherForm = ({lang}) => {
    return (
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