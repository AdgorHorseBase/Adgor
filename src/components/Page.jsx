import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./page.css";
import logo from "./images/AdgorLogo.webp";
// const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const MenuSections = () => {
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [structure, setStruct] = useState(false);
  const [lang, setLang] = useState("bg");
  const titlesFetched = useRef(false);

  useEffect(() => {
    const getStruct = async () => {
      try {
        const schema = await axios.get(`/server/files/structure.json`);
        setStruct(schema.data);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    getStruct();
  }, []);

  useEffect(() => {
    if (structure && !titlesFetched.current) {
      // fetchTitles(structure);
      setLoadingMenu(false);
      titlesFetched.current = true;
    }
  }, [structure]);

  const storedLang = localStorage.getItem("lang");

  useEffect(() => {
    if (storedLang) {
      setLang(storedLang);
    }
  }, [storedLang]);

  return window.innerWidth > 750 ? loadingMenu === true ? (
    <div className="Menu">
      <button id="menuButton">Loading...</button>
    </div>
  ) : (
    <div className="Menu">
      <div className="menuLogoContainer">
          <button
            id="menuButton"
            className="menuLogoButton"
            onClick={() => {
                document.location.href = "/";
            }}
          >
            <img id="menuLogo" alt="" src={logo} />  
          </button>
      </div>
      
      <div className="menuItemsContainer">
          {titlesFetched.current &&
              Object.keys(structure).sort((a, b) => structure[a].place - structure[b].place).map((dir) => dir !== "\\contact-us" && (
                  <React.Fragment key={dir}>
                      {structure[dir].type === "directory"
                          ? structure[dir].contents && (
                              <div className="directory-menu">
                                  <p id="menuButton" className="directory-name">
                                      {lang === "bg"
                                          ? structure[dir].directoryBg
                                          : dir.slice(1, dir.length)}
                                  </p>
                                  <ul className="page-list">
                                  {structure[dir].contents.sort((a, b) => a.place - b.place).map((page, index) => page.page ? (
                                        <li key={`${dir}-${page.page}-${index}`}>
                                            <a href={`/page${dir}/${page.page}`}>
                                                {lang === "bg" ? page.titleBg : page.titleEn}
                                            </a>
                                        </li>
                                    ) : (page.directory && page.contents && page.contents.length > 0 && (
                                        <div id="subDirectory" key={`${dir}-${page.directory}-${index}`}>
                                            <p id="menuSubButton" className="subDirectory-name">
                                                {lang === "bg" ? page.directoryBg : page.directory}
                                            </p>
                                            <ul>
                                                {page.contents.sort((a, b) => a.place - b.place).map((subPage, subIndex) => (
                                                    <li key={`${dir}-${page.directory}-${subPage.page}-${subIndex}`}>
                                                        <a href={`/page${dir}/${page.directory}/${subPage.page}`}>
                                                            {lang === "bg" ? subPage.titleBg : subPage.titleEn}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )))} 
                                  </ul>
                              </div>
                          )
                          : structure[dir].type === "file" && (
                              <button
                                  onClick={() => {
                                      document.location.href = `/page${dir}`;
                                  }}
                              >
                                  {lang === "bg"
                                      ? structure[dir].titleBg
                                      : structure[dir].titleEn}
                              </button>
                          )}
                  </React.Fragment>
              ))}
          <button
              id="menuButton"
              onClick={() => {
                  document.location.href = "/vouchers";
              }}
          >
              {lang === "bg" ? "Ваучери" : "Vouchers"}
          </button>
          <button
              id="menuButton"
              className="dot"
              onClick={() => {
                  document.location.href = "/products";
              }}
          >
              {lang === "bg" ? "Подаръци" : "Gifts"}
          </button>
      </div>
      
      <div className="menuEndContainer">
        {/* Button for contact us */}
        <button
          id="menuButton"
          onClick={() => {
            document.location.href = "/contacts";
          }}
        >
          {lang === "bg" ? "Контакти" : "Contacts"}
        </button><br></br>
        {lang === "bg" ? (
            <button
                id="menuButton"
                onClick={() => {
                    localStorage.setItem("lang", "en");
                    window.location.reload();
                }}
            >
                BG/EN
            </button>
        ) : (
            <button
                id="menuButton"
                onClick={() => {
                    localStorage.setItem("lang", "bg");
                    window.location.reload();
                }}
            >
                BG/EN
            </button>
        )}
      </div>
  </div>
  ) : (
    <div id="StickyMenu">
      <MenuMobile
        lang={lang}
        structure={structure}
        titlesFetched={titlesFetched}
      />
    </div>
  );
};

const MenuMobile = ({ lang, structure, titlesFetched }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [expandedDirectories, setExpandedDirectories] = useState({});
  const location = useLocation();

  const getDirectories = (structure) => {
    const newExpandedDirectories = { ...structure };

    for (const dir in structure) {
      if (structure[dir].type === "directory") {
        newExpandedDirectories[dir] = false;
      }
    }

    setExpandedDirectories(newExpandedDirectories);
  };

  useEffect(() => {
    getDirectories(structure);
  }, [structure, location]);

  const toggleDirectory = (dir) => {
    setExpandedDirectories((prevState) => ({
      ...prevState,
      [dir]: !prevState[dir],
    }));
  };

  return (
    <div className="menu-container">
      <button
        id="menuButton"
        onClick={() => {
          document.location.href = "/";
        }}
      >
        {lang === "bg" ? "Начало" : "Home"}
      </button>
      <button
        id="menuButton"
        className="expand-button"
        onClick={() => setMenuExpanded(!menuExpanded)}
      >
        {menuExpanded
          ? lang === "bg"
            ? "Затвори"
            : "Close"
          : lang === "bg"
          ? "Меню"
          : "Menu"}
      </button>

      {menuExpanded && (
        <div className="menu-content">
          {titlesFetched.current &&
            Object.keys(structure).sort((a, b) => structure[a].place - structure[b].place).map((dir) => dir !== "\\contact-us" && (
              <React.Fragment key={dir}>
                {structure[dir].type === "directory" &&
                  structure[dir].contents && (
                    <div className="directory">
                      <p
                        className="directory-name-mobile"
                        onClick={() => toggleDirectory(dir)} // Toggle directory on click
                      >
                        {lang === "bg"
                          ? structure[dir].directoryBg
                          : dir.slice(1)}
                      </p>
                      {expandedDirectories[dir] && ( // Check expanded state
                        <ul className="page-list-mobile">
                          {structure[dir].contents.map((page, index) => page.page ? (
                            <li key={`${dir}-${index}`}>
                              <a href={`/page${dir}/${page.page}`}>
                                {lang === "bg" ? page.titleBg : page.titleEn}
                              </a>
                            </li>
                          ) : (
                            <div id="subDirectoryMobile">
                              <p className="directory-name-mobile">
                                {lang === "bg"
                                  ? page.directoryBg
                                  : page.directory}
                              </p>
                              <ul>
                                {page.contents.map((subPage, subIndex) => (
                                  <li key={`${dir}-${index}-${subIndex}`}>
                                    <a href={`/page${dir}/${page.directory}/${subPage.page}`}>
                                      {lang === "bg" ? subPage.titleBg : subPage.titleEn}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                {structure[dir].type === "file" && (
                  <button
                    onClick={() => {
                      document.location.href = `/page${dir}`;
                    }}
                    className="file-button"
                  >
                    {lang === "bg"
                      ? structure[dir].titleBg
                      : structure[dir].titleEn}
                  </button>
                )}
              </React.Fragment>
            ))}

          <button
            id="menuButton"
            onClick={() => {
              document.location.href = "/products";
            }}
          >
            {lang === "bg" ? "Продукти" : "Products"}
          </button>
          <button
            id="menuButton"
            onClick={() => {
              document.location.href = "/vouchers";
            }}
          >
            {lang === "bg" ? "Ваучери" : "Vouchers"}
          </button>
          {lang === "bg" ? (
            <button
              id="menuButton"
              onClick={() => {
                localStorage.setItem("lang", "en");
                window.location.reload();
              }}
            >
              Switch to English
            </button>
          ) : (
            <button
              id="menuButton"
              onClick={() => {
                localStorage.setItem("lang", "bg");
                window.location.reload();
              }}
            >
              Смени на български
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function Page() {
  const [pageContent, setPageContent] = useState("Loading...");
  const [sections, setSections] = useState([]);
  // const [titleBg, setTitleBg] = useState("Blog");
  // const [titleEn, setTitleEn] = useState("Blog");
  const location = useLocation(); // To get the current path

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // Extracting the dynamic part of the path after "/page/"
        const pagePath = location.pathname.replace("/page/", "");

        const response = await axios.get(
          "/server/uploads/" + pagePath + "/page.html"
        );
        const content = response.data;

        // const title = await axios.get(
        //   "/server/uploads/" + pagePath + "/schema.json"
        // );

        // Set the response data (HTML) to state
        setPageContent(content);
        // setTitleBg(title.data.titleBg);
        // setTitleEn(title.data.titleEn);
      } catch (error) {
        console.error("Error fetching page content:", error);
        setPageContent("<p>Failed to load page content.</p>");
      }
    };

    fetchPageContent();
  }, [location]);

  const [lang, setLang] = useState("bg");

  const storedLang = localStorage.getItem("lang");

  useEffect(() => {
    if (storedLang) {
      setLang(storedLang);
    }
  }, [storedLang]);

  useEffect(() => {
    const elementsBg = document.querySelectorAll(".bg");
    const elementsEn = document.querySelectorAll(".en");

    if (lang === "en") {
      elementsBg.forEach((el) => (el.style.display = "none"));
      elementsEn.forEach((el) => (el.style.display = "block"));
    } else if (lang === "bg") {
      elementsBg.forEach((el) => (el.style.display = "block"));
      elementsEn.forEach((el) => (el.style.display = "none"));
    }

    const GetSections = () => {
      const sections = document.querySelectorAll("section");
      setSections(sections);
    }

    if(sections.length === 0) {
      GetSections();
    }
  }, [lang, pageContent, sections]);

  useEffect(() => {
    const handleScroll = () => {
      const videos = document.querySelectorAll('.autoplay-video');
      videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageContent]);

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    const offset = 150;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

  return (
    <div>
      <div id="StickyMenu">
        <MenuSections />
      </div>

      {/* <h1 className="bg">{titleBg}</h1>
      <h1 className="en">{titleEn}</h1> */}

      <div style={{marginTop: "12px", marginBottom: "48px"}} dangerouslySetInnerHTML={{ __html: pageContent }} />

      {sections && sections.length > 0 && (
        <div id="sections">
          {Array.from(sections).map((section) => (
            <>
              <React.Fragment key={section.id}>
                <div className="bg" onClick={() => {scrollToElement(section.id)}}>{section.getAttribute("data-title-bg")}
                  <svg height="24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <circle r="4" cx="10" cy="16" fill="transparent" stroke="black" stroke-width="1" />
                  </svg>
                </div>
                <div className="en" onClick={() => {scrollToElement(section.id)}}>
                  {section.getAttribute("data-title-en")}
                  <svg height="24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <circle r="4" cx="10" cy="16" fill="transparent" stroke="black" stroke-width="1" />
                  </svg>
                </div>
              </React.Fragment>
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export { Page, MenuSections };
