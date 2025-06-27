import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
// import axios from "axios";
import "./page.css";
import logo from "./images/AdgorLogo.webp";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiSolidDownArrow } from "react-icons/bi";
import { TbMenu2 } from "react-icons/tb";
import useMediaQuery from "@mui/material/useMediaQuery";

import { getContent } from "../config.js";

const MenuSections = () => {
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [structure, setStruct] = useState(false);
  const [lang, setLang] = useState("bg");
  const desktopMenu = useMediaQuery("(min-width: 1400px)");
  const titlesFetched = useRef(false);

  useEffect(() => {
    const getStruct = async () => {
      try {
        const schema = await getContent("config/structure.json");
        setStruct(schema);
      } catch (err) {
        console.error(err);
        console.log(await getContent("config/structure.json"))
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

  return loadingMenu === true ? (
    <div className="Menu">
      <button id="menuButton">Loading...</button>
    </div>
  ) : desktopMenu ? (
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
                      <BiSolidDownArrow />
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
                          <ul className="subPage-list">
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
        {/* <div className="menuEndContainerMobile" style={{ marginRight: "10px" }}> */}
        <button
          className="linkButton"
          onClick={() => {
            localStorage.setItem("lang", lang === "bg" ? "en" : "bg");
            window.location.reload();
          }}
        >
          {lang === "bg" ? "EN" : "BG"}
        </button>
      </div>
    </div>
  ) : (
    <MenuMobile
      lang={lang}
      structure={structure}
      titlesFetched={titlesFetched}
    />
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
      <div className="menuTopMobile">
        <button
          id="menuButton"
          className="expand-button"
          onClick={() => setMenuExpanded(!menuExpanded)}
        >
          <TbMenu2 />
        </button>

        <button
          id="menuButton"
          className="menuLogoButtonMobile"
          onClick={() => {
            document.location.href = "/";
          }}
        >
          <img id="menuLogo" alt="" src={logo} />
        </button>

        <div className="menuEndContainerMobile">
          <button
            className="linkButton"
            onClick={() => {
              localStorage.setItem("lang", lang === "bg" ? "en" : "bg");
              window.location.reload();
            }}
          >
            {lang === "bg" ? "EN" : "BG"}
          </button>
        </div>
      </div>

      <div className="menu-content" style={{ transform: menuExpanded ? "translateX(0)" : "translateX(-100%)", transition: "transform .3s ease-out" }}>
        <div className="insideMenuTopMobile">
          <button
            id="menuButton"
            className="expand-button"
            onClick={() => setMenuExpanded(!menuExpanded)}
          >
            <svg width="20" height="21" viewBox="0 0 40 41" fill="none">
              <rect x="3.2832" y="-1" width="53" height="5.98387" rx="2.99193" transform="rotate(45 3.2832 -1)" fill="#E6DED1" />
              <rect x="-1" y="37.4895" width="53" height="5.12903" rx="2.56452" transform="rotate(-45 -1 37.4895)" fill="#E6DED1" />
            </svg>
          </button>

          <div className="menuEndContainerMobile">
            <button
              className="linkButton"
              onClick={() => {
                localStorage.setItem("lang", lang === "bg" ? "en" : "bg");
                window.location.reload();
              }}
            >
              {lang === "bg" ? "EN" : "BG"}
            </button>
          </div>
        </div>

        {titlesFetched.current &&
          Object.keys(structure).sort((a, b) => structure[a].place - structure[b].place).map((dir) => dir !== "\\contact-us" && (
            <React.Fragment key={dir}>
              {structure[dir].type === "directory" &&
                structure[dir].contents && (
                  <div className="directory">
                    <p
                      className="directory-name-mobile"
                      onClick={() => toggleDirectory(dir)}
                    >
                      {lang === "bg"
                        ? structure[dir].directoryBg
                        : dir.slice(1)}
                      <BiSolidDownArrow />
                    </p>
                    {expandedDirectories[dir] && (
                      <ul className="page-list-mobile">
                        {structure[dir].contents.map((page, index) => page.page ? (
                          <li key={`${dir}-${index}`}>
                            <a href={`/page${dir}/${page.page}`}>
                              {lang === "bg" ? page.titleBg : page.titleEn}
                            </a>
                          </li>
                        ) : (
                          <div id="subDirectoryMobile">
                            <p className="directory-name-mobile" onClick={() => toggleDirectory(`${dir}-${page.directory}`)}>
                              {lang === "bg"
                                ? page.directoryBg
                                : page.directory}
                              <BiSolidDownArrow />
                            </p>
                            {expandedDirectories[`${dir}-${page.directory}`] && (
                              <ul>
                                {page.contents.map((subPage, subIndex) => (
                                  <li key={`${dir}-${index}-${subIndex}`}>
                                    <a href={`/page${dir}/${page.directory}/${subPage.page}`}>
                                      {lang === "bg" ? subPage.titleBg : subPage.titleEn}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
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
          className="file-button"
          onClick={() => {
            document.location.href = "/products";
          }}
        >
          {lang === "bg" ? "Продукти" : "Products"}
        </button>
        <button
          className="file-button"
          onClick={() => {
            document.location.href = "/vouchers";
          }}
        >
          {lang === "bg" ? "Ваучери" : "Vouchers"}
        </button>

        <div style={{ height: "25%" }}></div>
      </div>
    </div>
  );
};

const ImageModal = ({ isOpen, images, currentIndex, onClose, onNext, onPrev }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay"
      onClick={(e) => {
        if (!e.target.closest(".modal-next") && !e.target.closest(".modal-prev") && !e.target.closest(".modal-close")) {
          onClose();
        }
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt="Gallery" className="modal-image" />
      </div>
      <button className="modal-close" onClick={onClose}><IoClose /></button>
      <button className="modal-prev" onClick={onPrev}><FaChevronLeft /></button>
      <button className="modal-next" onClick={onNext}><FaChevronRight /></button>
    </div>
  );
};

function Page() {
  const [pageContent, setPageContent] = useState("Loading...");
  const [sections, setSections] = useState([]);
  // const [titleBg, setTitleBg] = useState("Blog");
  // const [titleEn, setTitleEn] = useState("Blog");
  const location = useLocation(); // To get the current path
  const [openGallery, setOpenGallery] = useState({ isOpen: false, images: [], currentIndex: 0 });

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // Extracting the dynamic part of the path after "/page/"
        const pagePath = location.pathname.replace("/page/", "");

        const response = await getContent(
          "/server//" + pagePath + "/page.html"
        );
        const content = response;

        // const title = await getContent(
        //   "/server//" + pagePath + "/schema.json"
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
  }, [lang, pageContent]);

  useEffect(() => {
    const GetSections = () => {
      const sections = document.querySelectorAll("section");
      setSections(sections);
    };

    const GetGalleries = () => {
      const galleries = document.querySelectorAll(".gallery-container");
      galleries.forEach((gallery) => {
        gallery.scrollLeft = gallery.scrollWidth / 2;
        let isDown = false;
        let startX;
        let scrollLeft;
        let isAppending = false;
        let isPrepending = false;

        gallery.addEventListener('mousedown', (e) => {
          isDown = true;
          gallery.classList.add('active');
          startX = e.pageX - gallery.offsetLeft;
          scrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('mouseleave', () => {
          isDown = false;
          gallery.classList.remove('active');
        });

        gallery.addEventListener('mouseup', () => {
          isDown = false;
          gallery.classList.remove('active');
        });

        gallery.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - gallery.offsetLeft;
          const walk = (x - startX) * 3; //scroll-fast
          gallery.scrollLeft = scrollLeft - walk;
        });

        gallery.addEventListener('scroll', debounce(() => {
          if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth && !isAppending && !isPrepending) {
            isAppending = true;
            appendImages(gallery);
            isAppending = false;
          } else if (gallery.scrollLeft <= 0 && !isAppending) {
            isPrepending = true;
            if (isDown) {
              isDown = false;
            }
            prependImages(gallery);
            gallery.scrollLeft = gallery.scrollWidth / 2;
            isDown = false;
            isPrepending = false;
          }
        }), 500);

        const images = Array.from(gallery.querySelectorAll("img")).map((img) => img.src);
        gallery.querySelectorAll("img").forEach((img, index) => {
          img.parentElement.addEventListener("click", () => {
            handleImageClick(gallery.id, images, index)
          });
        });
      });
    }

    const appendImages = (gallery) => {
      // Logic to append images to the end of the gallery
      const images = gallery.querySelectorAll('.gallery-item');
      images.forEach((image) => {
        const clone = image.cloneNode(true);
        gallery.appendChild(clone);
      });

      const allImages = Array.from(gallery.querySelectorAll("img")).map((img) => img.src);
      gallery.querySelectorAll("img").forEach((img, index) => {
        img.parentElement.addEventListener("click", () => {
          handleImageClick(gallery.id, allImages, index)
        });
      });
    };

    const prependImages = (gallery) => {
      const images = gallery.querySelectorAll('.gallery-item');
      Array.from(images).reverse().forEach((image) => {
        const clone = image.cloneNode(true);
        gallery.prepend(clone);
      });

      const allImages = Array.from(gallery.querySelectorAll("img")).map((img) => img.src);
      gallery.querySelectorAll("img").forEach((img, index) => {
        img.parentElement.addEventListener("click", () => {
          handleImageClick(gallery.id, allImages, index)
        });
      });
    };

    const setupPeopleListImgs = () => {
      const containers = document.querySelectorAll('.pagePeopleListImgs');

      containers.forEach((container, idx) => {
        // Set container ID if not already set
        if (!container.id) {
          container.id = `peopleImgs-${idx}`;
        }

        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse events
        container.addEventListener('mousedown', (e) => {
          isDown = true;
          container.classList.add('active');
          startX = e.pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
          e.preventDefault(); // Prevent text selection during drag
        });

        container.addEventListener('mouseleave', () => {
          isDown = false;
          container.classList.remove('active');
        });

        container.addEventListener('mouseup', () => {
          isDown = false;
          container.classList.remove('active');
        });

        container.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - container.offsetLeft;
          const walk = (x - startX) * 1.5;

          // Calculate the maximum scroll position
          const maxScroll = container.scrollWidth - container.clientWidth;

          // Constrain the scroll position to be within bounds
          const newScrollLeft = Math.max(0, Math.min(maxScroll, scrollLeft - walk));
          container.scrollLeft = newScrollLeft;
        });

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
          isDown = true;
          container.classList.add('active');
          startX = e.touches[0].pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
        }, { passive: true });

        container.addEventListener('touchend', () => {
          isDown = false;
          container.classList.remove('active');
        });

        container.addEventListener('touchmove', (e) => {
          if (!isDown) return;
          const x = e.touches[0].pageX - container.offsetLeft;
          const walk = (x - startX);

          // Calculate the maximum scroll position
          const maxScroll = container.scrollWidth - container.clientWidth;

          // Constrain the scroll position to be within bounds
          const newScrollLeft = Math.max(0, Math.min(maxScroll, scrollLeft - walk));
          container.scrollLeft = newScrollLeft;
        }, { passive: true });

        // Set dots container ID and add functionality
        const dotsContainer = container.nextElementSibling;
        if (!dotsContainer.id) {
          dotsContainer.id = `peopleDots-${idx}`;
        }

        const dots = dotsContainer.querySelectorAll('.pagePeopleListDot');

        // Make sure dataset attributes are set correctly
        dots.forEach((dot, dotIdx) => {
          dot.setAttribute('data-index', dotIdx.toString());
          dot.setAttribute('data-container', idx.toString());

          // Add click handler directly to make sure it works
          dot.addEventListener('click', function () {
            // Get image width for scrolling
            const imageWidth = container.clientWidth;

            // Scroll to the selected image smoothly
            container.scrollTo({
              left: dotIdx * imageWidth,
              behavior: 'smooth'
            });

            // Update active dot state
            for (let i = 0; i < dots.length; i++) {
              dots[i].classList.remove('active');
            }
            this.classList.add('active');
          });
        });

        // Set first dot as active initially
        if (dots.length > 0) {
          dots[0].classList.add('active');
        }

        // Update dots on scroll
        container.addEventListener('scroll', function () {
          if (!isDown) {
            const imageWidth = container.clientWidth;
            const currentIndex = Math.round(container.scrollLeft / imageWidth);

            // Update active dot
            dots.forEach((dot, idx) => {
              dot.classList.toggle('active', idx === currentIndex);
            });
          }
        });
      });
    };

    GetSections();
    GetGalleries();
    setupPeopleListImgs();
  }, [pageContent]);

  const handleImageClick = (galleryId, images, index) => {
    setOpenGallery({ isOpen: true, images, currentIndex: index });
  };

  const handleCloseModal = () => {
    setOpenGallery({ ...openGallery, isOpen: false });
  };

  const handleNextImage = () => {
    setOpenGallery((prevState) => ({
      ...prevState,
      currentIndex: (prevState.currentIndex + 1) % prevState.images.length,
    }));
  };

  const handlePrevImage = () => {
    setOpenGallery((prevState) => ({
      ...prevState,
      currentIndex: (prevState.currentIndex - 1 + prevState.images.length) % prevState.images.length,
    }));
  };

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

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

      <ImageModal
        isOpen={openGallery.isOpen}
        images={openGallery.images}
        currentIndex={openGallery.currentIndex}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />

      {/* <h1 className="bg">{titleBg}</h1>
      <h1 className="en">{titleEn}</h1> */}

      <div style={{ marginTop: "100px", marginBottom: "0" }} dangerouslySetInnerHTML={{ __html: pageContent }} />

      {sections && sections.length > 0 && (
        <div id="sections">
          {Array.from(sections).map((section) => (
            <>
              <React.Fragment key={section.id}>
                <div className="bg" style={{ display: lang === "bg" ? "block" : "none" }} onClick={() => { scrollToElement(section.id) }}>
                  {section.getAttribute("data-title-bg")}
                  <svg height="24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <circle r="4" cx="10" cy="16" fill="transparent" stroke="black" stroke-width="1" />
                  </svg>
                </div>
                <div className="en" style={{ display: lang === "bg" ? "none" : "block" }} onClick={() => { scrollToElement(section.id) }}>
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
