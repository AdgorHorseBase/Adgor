import React, { useEffect, useState } from "react";
import "./footer.css";
import axios from "axios";

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
        const schema = await axios.get(
          "/server/uploads/" + pagePath + "/schema.json"
        );
        if(schema.data.footerImageEnable !== undefined) {
          setImageEnable(schema.data.footerImageEnable);
        }
        if (schema && schema.data && schema.data.footerImage) {
          setImageSrc("/server/files/images/" + schema.data.footerImage);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const GetStructure = async () => {
      try {
        const schema = await axios.get(`/server/files/structure.json`);
        setStruct(schema.data);
      } catch (err) {
        console.log("Error:", err);
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