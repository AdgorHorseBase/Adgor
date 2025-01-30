import React, { useEffect, useState } from "react";
import "./footer.css";
import axios from "axios";

const Footer = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [structure, setStruct] = useState({});
  const [lang, setLang] = useState("bg");

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
      <div className="image-footer">
        <img
          src={imageSrc ? imageSrc : "/footerImage.png"}
          alt=""
          className="image"
        />
      </div>

      <div className="footer-container">
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
              <p className="darker">Email:</p>
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