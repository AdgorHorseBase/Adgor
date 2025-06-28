import React, { useEffect, useState } from "react";
import "./footer.css";
// import axios from "axios";
import { getContent, getUrlForFile } from "../config";
// import instagram from "./images/instagram.webp";
// import facebook from "./images/facebook.svg";

const Footer = () => {
  const [imageEnable, setImageEnable] = useState(true);
  const [imageSrc, setImageSrc] = useState("");
  const [structure, setStruct] = useState({});
  const [lang, setLang] = useState("bg");

  const isHomePage = window.location.pathname === "/";

  useEffect(() => {
    const fetchImage = async () => {
      if (!window.location.pathname.startsWith("/page")) {
        return;
      }
      const pagePath = window.location.pathname.replace("/page/", "");
      try {
        const schema = await getContent("uploads/" + pagePath + "/schema.json");
        if(schema.footerImageEnable !== undefined) {
          setImageEnable(schema.footerImageEnable);
        }
        if (schema && schema && schema.footerImage) {
          setImageSrc(getUrlForFile("images/" + schema.footerImage));
        }
      } catch (err) {
        console.error(err);
      }
    };

    const GetStructure = async () => {
      try {
        const schema = await getContent(`config/structure.json`);
        setStruct(schema);
      } catch (err) {
        console.error(err);
      }
    };

    fetchImage();
    GetStructure();
  }, []);

  const storedLang = localStorage.getItem("lang");

  useEffect(() => {
    if (storedLang) {
      setLang(storedLang);
    }
  }, [storedLang]);

  return (
    <>
      {!isHomePage && imageEnable && (
        <div className="image-footer">
          <img
            src={imageSrc ? imageSrc : "/footerImage.png"}
            alt=""
            className="image"
          />
        </div>
      )}

      <div className="footer-container">
        <svg id="footerSvg" viewBox="0 0 726.62 323.82">
          <path strokeWidth="1px" fill="none" d="M.07,1.72c108.9-14.91,177.74,111.8,280.52,130.5,70.57,12.84,147.72-66.86,211.29-40.35,63.87,26.64,93.66,147.52,146.84,187.29,60.08,46.02,87.86,44.15,87.86,44.15"/>
          <path strokeWidth="1px" fill="none" d="M137.02,136.16c-3.76-1.66-7.89-2.26-11.95-1.73l-.35-.76c5.64-5.39,9.6-12.33,11.4-19.96l.81-.07c1.59,3.82,4.16,7.13,7.46,9.6h0c8.58,6.28,17.35,12.26,26.31,17.95l.8.51-.03-.95c-.39-10.71-1.13-21.38-2.21-32.02h0c-.45-4.12-2-8.04-4.49-11.33l.46-.64c7.43,2.26,15.36,2.26,22.8,0l.46.64c-2.48,3.29-4.03,7.21-4.49,11.33h0c-1.09,10.66-1.83,21.33-2.21,32.02l-.03.95.8-.51c8.96-5.69,17.73-11.67,26.3-17.94h0c3.3-2.46,5.88-5.78,7.46-9.6l.81.07c1.8,7.63,5.76,14.57,11.4,19.96l-.35.76c-4.06-.53-8.19.07-11.94,1.73h0c-9.66,4.38-19.17,9.07-28.53,14.08l-.82.44.82.44c9.36,5,18.87,9.69,28.53,14.06h0c3.75,1.65,7.87,2.23,11.91,1.7l.35.75c-5.64,5.39-9.6,12.33-11.39,19.97l-.81.06c-1.58-3.82-4.16-7.14-7.46-9.6h0c-8.56-6.27-17.33-12.25-26.3-17.95l-.8-.51.03.95c.39,10.71,1.13,21.38,2.21,32.02h0c.45,4.14,2.02,8.08,4.51,11.38l-.46.64c-7.44-2.24-15.36-2.24-22.8,0l-.46-.64c2.48-3.29,4.04-7.21,4.49-11.33h0c1.09-10.64,1.83-21.31,2.21-32.02l.03-.95-.8.51c-8.96,5.68-17.73,11.67-26.31,17.94h0c-3.3,2.47-5.87,5.79-7.46,9.6l-.81-.06c-1.79-7.64-5.75-14.58-11.39-19.97l.35-.75c4.06.52,8.2-.08,11.95-1.74h0c9.65-4.37,19.16-9.06,28.52-14.07l.82-.44-.82-.44c-9.34-5.01-18.85-9.7-28.52-14.08h0Z"/>
        </svg>
        <h1>
          Looking for an <br />
          <span className="adventure-container">
            <span className="adventure">adventure?</span>
          </span>
        </h1>

        <div className="footerContacts">
          <h1>Contact Info</h1>
          <div className="contacts">
            <div className="contact-form">
              <p className="darker">
                Horse riding <br></br>"Adgor"
              </p>
              <p className="view-map">View map</p>
              <p className="darker">Working hours:</p>
              <p className="working-days">Wed-Sun:</p>
              <p className="working-hours">10:00-18:00</p>
            </div>
            <div className="contact-form2">
              <p className="darker">Phone:</p>
              <p>0887 467 527</p>
              <p>0888 877 056</p>
              <p>0888 014 425</p>
              <p id="footerEmail" className="darker">Email:</p>
              <p className="email">adgor@abv.bg</p>
            </div>
          </div>
          <div className="socials">
            <a
              href="https://www.facebook.com/adgorbg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="37.3708 53.1586 18.41 35.006" width="18.41px" height="35.006px">
                <path d="M61.489,57.97c0.936,0,1.878,0.051,2.812,0.093c0.609,0.025,1.218,0.112,1.79,0.174l-0.043,5.636 c-0.174,0-0.311,0-0.448,0c-0.619,0-1.237-0.008-1.856-0.008c-0.464,0-0.928,0.004-1.392,0.021 c-1.493,0.05-2.593,0.61-2.669,2.476c-0.048,1.344-0.082,4.311-0.084,4.467c0.078,0,1.554,0.006,3.039,0.006 c0.743,0,1.469-0.001,1.975-0.006c0.386,0,0.771,0,1.207,0c-0.303,2.165-0.58,4.243-0.882,6.333h-5.338l-0.121,15.814h-6.557 l0.121-15.839h-5.362l0.048-6.296h5.387l0.004-0.473c0.01-1.269-0.006-2.538,0.042-3.807c0.019-0.796,0.062-1.617,0.205-2.414 c0.363-1.929,1.259-3.546,2.873-4.703c1.414-1.008,3.022-1.431,4.727-1.468C61.141,57.971,61.315,57.97,61.489,57.97z" transform="matrix(1, 0, 0, 1, -10.310226440429688, -4.811439037322998)"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/adgorbg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="190.2274 54.8166 30.9911 30.978" width="30.9911px" height="30.978px">
                <path d="M224.355,65.016c0.008,0,0.015,0,0.023,0c1.02,0,1.848,0.834,1.84,1.866 c-0.008,1.02-0.848,1.854-1.88,1.854c-1.033-0.012-1.847-0.846-1.84-1.866C222.505,65.845,223.332,65.016,224.355,65.016z" transform="matrix(1, 0, 0, 1, -10.310226440429688, -4.811439037322998)"/>
                <path d="M231.339,67.405c0.23,2.439,0.379,13.96-0.339,16.66c-0.96,3.534-3.265,5.624-6.841,6.196 c-1.336,0.215-4.944,0.345-8.547,0.345c-3.688,0-7.372-0.136-8.609-0.457c-3.514-0.908-5.612-3.198-6.169-6.756 c-0.415-2.613-0.46-14.756,0.294-17.394c0.984-3.434,3.276-5.45,6.752-6.022c1.575-0.258,4.655-0.349,7.764-0.349 c2.892,0,5.81,0.078,7.566,0.174c2.127,0.112,4.075,0.796,5.656,2.314C230.373,63.56,231.143,65.364,231.339,67.405z M228.359,82.883c0.444-2.725,0.445-12.666,0.191-15.217c-0.278-2.725-1.944-4.516-4.641-4.939 c-1.335-0.203-4.549-0.292-7.747-0.292c-3.085,0-6.155,0.084-7.507,0.23c-2.702,0.311-4.519,1.978-4.95,4.666 c-0.445,2.849-0.439,13.5-0.107,15.64c0.344,2.227,1.601,3.758,3.824,4.38c1.202,0.337,4.803,0.458,8.333,0.458 c3.25,0,6.441-0.103,7.641-0.234C226.124,87.275,227.928,85.595,228.359,82.883" transform="matrix(1, 0, 0, 1, -10.310226440429688, -4.811439037322998)"/>
                <path d="M216.099,67.181c4.38,0,7.911,3.559,7.877,7.951c-0.033,4.38-3.619,7.938-8.011,7.938 c-4.392,0-7.911-3.558-7.877-7.95C208.122,70.727,211.708,67.168,216.099,67.181z M215.984,80.258 c2.816,0,5.135-2.268,5.181-5.089c0.047-2.849-2.213-5.163-5.049-5.188c-0.016,0-0.031,0-0.046,0 c-2.816,0-5.135,2.268-5.181,5.089c-0.046,2.837,2.213,5.163,5.049,5.188C215.953,80.258,215.968,80.258,215.984,80.258" transform="matrix(1, 0, 0, 1, -10.310226440429688, -4.811439037322998)"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer2-container">
        {Object.keys(structure)
          .sort((a, b) => structure[a].place - structure[b].place)
          .map(
            (dir) =>
              structure[dir].type === "directory" && (
                <React.Fragment key={dir}>
                  {structure[dir].contents && (
                    <div className="footerDirectory">
                      <h3>
                        {lang === "bg"
                          ? structure[dir].directoryBg
                          : dir.slice(1, dir.length)}
                      </h3>
                      <ul className="footerPageList">
                        {structure[dir].contents
                          .sort((a, b) => a.place - b.place)
                          .map((page, index) =>
                            page.page ? (
                              <li key={`${dir}-${page.page}-${index}`}>
                                <a href={`/page${dir}/${page.page}`}>
                                  {lang === "bg" ? page.titleBg : page.titleEn}
                                </a>
                              </li>
                            ) : (
                              page.directory &&
                              page.contents &&
                              page.contents.length > 0 && (
                                <div
                                  className="footerSubDirectory"
                                  key={`${dir}-${page.directory}-${index}`}
                                >
                                  <p>
                                    {lang === "bg"
                                      ? page.directoryBg
                                      : page.directory}
                                  </p>
                                  <ul>
                                    {page.contents
                                      .sort((a, b) => a.place - b.place)
                                      .map((subPage, subIndex) => (
                                        <li
                                          key={`${dir}-${page.directory}-${subPage.page}-${subIndex}`}
                                        >
                                          <a
                                            href={`/page${dir}/${page.directory}/${subPage.page}`}
                                          >
                                            {lang === "bg"
                                              ? subPage.titleBg
                                              : subPage.titleEn}
                                          </a>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )
                            )
                          )}
                      </ul>
                    </div>
                  )}
                </React.Fragment>
              )
          )}
        <div className="footerDirectory">
          <h3>{lang === "bg" ? "Други" : "Other"}</h3>
          <ul className="footerPageList">
            {Object.keys(structure)
              .sort((a, b) => structure[a].place - structure[b].place)
              .map(
                (dir) =>
                  structure[dir].type === "file" && (
                    <React.Fragment key={dir}>
                      <li>
                        <a href={`/page${dir}`}>
                          {lang === "bg"
                            ? structure[dir].titleBg
                            : structure[dir].titleEn}
                        </a>
                      </li>
                    </React.Fragment>
                  )
              )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Footer;