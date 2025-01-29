import React from 'react';
// import "./footerMobile.css";
const Footer = () => {
  return (
    <>
    <div className="image-footer">
    <img src="jeep2.jpg" alt="" className="image" />
    </div>

    <div className="footer-container">
    <h1>
        Looking for an <br></br>
        <span className="adventure-container">
    <span className="adventure">adventure?</span>
  </span>
    </h1>
    <div className="contact-form">
    <h1>Contact Info</h1>
    <p>Horse riding <br></br>"Adgor"</p>
    <p className='view-map'>View map</p>
    <p className='working-hours-text'>Working hours:</p>
    <p className='working-days'>Wed-Sun:</p>
    <p className='working-hours'>10:00-18:00</p>
    </div>
    <div className="contact-form2">  
    <h1>Phone:</h1>
    <p>0887 467 527</p>
    <p>0888 877 056</p>
    <p>0888 014 425</p>
    <p className='email-text'>Email:</p>
    <p className='email'>adgor@abv.bg</p>
    </div>
    </div>
    <div className="footer2-container"></div>
    </>
  );
};

export default Footer;
