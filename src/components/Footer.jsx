// import React, { useEffect, useRef, useState } from 'react';
import "./footer.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      if (!window.location.pathname.startsWith("/page")) {
        return;
      }
      const pagePath = window.location.pathname.replace("/page/", "");
      try {
        const schema = await axios.get("/server/uploads/" + pagePath + "/schema.json");
        if(schema && schema.data && schema.data.footerImage) {
          setImageSrc("/server/files/images/" + schema.data.footerImage);
        }
      } catch(err) {
        console.error(err);
      }
    }

    fetchImage();
  }, []);
  
  return (
    <>
    <div className="image-footer">
    <img src={imageSrc ? imageSrc : "/jeep2.jpg"} alt="" className="image" />
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