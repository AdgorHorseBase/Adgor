import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./page.css";
// const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const MenuSections = () => {
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

  const fetchTitles = async (structure) => {
    const updatedStructure = { ...structure };

    for (const dir in updatedStructure) {
      if (updatedStructure[dir].type === "directory") {
        for (const page of updatedStructure[dir].contents) {
          try {
            const titleResponse = await axios.get(
              `/server/uploads${dir}/${page}/schema.json`
            );
            updatedStructure[dir].directoryBg =
              titleResponse.data.directoryBg ?? "";
            updatedStructure[dir].contents = updatedStructure[dir].contents.map(
              (p) =>
                p === page
                  ? {
                      page,
                      titleBg: titleResponse.data.titleBg,
                      titleEn: titleResponse.data.titleEn,
                      directoryBg:
                        titleResponse.data.directoryBg ?? "Directory",
                    }
                  : p
            );
          } catch (err) {
            console.log(`Error fetching title for ${dir}/${page}:`, err);
          }
        }
      } else if (updatedStructure[dir].type === "file") {
        try {
          const titleResponse = await axios.get(
            `/server/uploads${dir}/schema.json`
          );
          updatedStructure[dir] = {
            ...updatedStructure[dir],
            titleBg: titleResponse.data.titleBg,
            titleEn: titleResponse.data.titleEn,
          };
        } catch (err) {
          console.log(`Error fetching title for ${dir}:`, err);
        }
      }
    }

    setStruct(updatedStructure);
  };

  useEffect(() => {
    if (structure && !titlesFetched.current) {
      fetchTitles(structure);
      titlesFetched.current = true;
    }
  }, [structure]);

  useEffect(() => {
    if (localStorage.getItem("lang")) {
      setLang(localStorage.getItem("lang"));
    }
  }, [localStorage.getItem("lang")]);

  return window.innerWidth > 750 ? (
    <div className="Menu">
      <button
        id="menuButton"
        onClick={() => {
          document.location.href = "/Adgor";
        }}
      >
        {lang === "bg" ? "Начало" : "Home"}
      </button>
      {titlesFetched.current &&
        Object.keys(structure).map((dir, index) => (
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
                      {structure[dir].contents.map((page, index) => (
                        <li key={`${dir}-${index}`}>
                          <a href={`/Adgor/page${dir}/${page.page}`}>
                            {lang === "bg" ? page.titleBg : page.titleEn}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              : structure[dir].type === "file" && (
                  <button
                    onClick={() => {
                      document.location.href = `/Adgor/page${dir}`;
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
        className="dot"
        onClick={() => {
          document.location.href = "/Adgor/products";
        }}
      >
        {lang === "bg" ? "Продукти" : "Products"}
      </button>
      <button
        id="menuButton"
        onClick={() => {
          document.location.href = "/Adgor/vouchers";
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
          Switch to english
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
          document.location.href = "/Adgor";
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
            Object.keys(structure).map((dir) => (
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
                          {structure[dir].contents.map((page, index) => (
                            <li key={`${dir}-${index}`}>
                              <a href={`/Adgor/page${dir}/${page.page}`}>
                                {lang === "bg" ? page.titleBg : page.titleEn}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                {structure[dir].type === "file" && (
                  <button
                    onClick={() => {
                      document.location.href = `/Adgor/page${dir}`;
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
              document.location.href = "/Adgor/products";
            }}
          >
            {lang === "bg" ? "Продукти" : "Products"}
          </button>
          <button
            id="menuButton"
            onClick={() => {
              document.location.href = "/Adgor/vouchers";
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
  const [titleBg, setTitleBg] = useState("Blog");
  const [titleEn, setTitleEn] = useState("Blog");
  const location = useLocation(); // To get the current path

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // Extracting the dynamic part of the path after "/page/"
        const pagePath = location.pathname.replace("/page/", "");

        const response = await axios.get(
          "/Adgor/server/uploads/" + pagePath + "/page.json"
        );
        const content = response.data;

        const title = await axios.get(
          "/Adgor/server/uploads/" + pagePath + "/schema.json"
        );

        // Set the response data (HTML) to state
        setPageContent(content);
        setTitleBg(title.data.titleBg);
        setTitleEn(title.data.titleEn);
      } catch (error) {
        console.error("Error fetching page content:", error);
        setPageContent("<p>Failed to load page content.</p>");
      }
    };

    fetchPageContent();
  }, [location]);

  const [lang, setLang] = useState("bg");

  useEffect(() => {
    if (localStorage.getItem("lang")) {
      setLang(localStorage.getItem("lang"));
    }
  }, [localStorage.getItem("lang")]);

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
  }, [lang, pageContent]);

  useEffect(() => {
    const handleScroll = () => {
      const videos = document.querySelectorAll('.autoplay-video');
      console.log(videos);
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

  return (
    <div>
      <MenuSections />

      {/* <h1 className="bg">{titleBg}</h1>
      <h1 className="en">{titleEn}</h1> */}

      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    </div>
  );
}

export { Page, MenuSections };
