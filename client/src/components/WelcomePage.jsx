import React from 'react'
import { MenuSections } from './Page'
import './WelcomePage.css'

const WelcomePage = () => {
    return (
        <div className='Everything'>
            <MenuSections />
            <p id='thisthing'>RANDOMMM</p>
            {/* Tova sa butoni za productite i vaucherite. Ne znam dali trqbva da gi ima tuk */}
            <button onClick={() => { document.location.href = "/products" }}>Products</button>
            <button onClick={() => { document.location.href = "/vouchers" }}>Vouchers</button>
        </div>
    )
}

export default WelcomePage
