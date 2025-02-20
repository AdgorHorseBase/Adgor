import React, { useState, useEffect } from "react";
import "./WelcomePage.css";
// import HeaderSnimka from "./images/HeaderSnimka.webp";
// import Logo from "./images/AdgorLogo.webp";
import AdgorVideo from "./images/adgorStartingVideo.webm";
import TrenirovkiNaKone from "./images/TrenirovkiNaKoneIMG.webp";
import Pansion from "./images/PansionIMG.webp";
import Ezda from "./images/EzdaIMG.webp";
// import Steps from "./images/Steps.webp";
import StepsEn from "./images/StepsEn.webp";
// import StepsSmall from "./images/StepsSmall.webp";
import StepsSmallEn from "./images/StepsSmallEn.webp";
import StepsMobile from "./images/StepsMobile.webp";
import LineHores from "./images/twohorses.webp";
// import Foundation from "./images/Foundation.webp";
// import FoundationCutUp from "./images/FoundationCutUp.png";
// import FoundationCutDown from "./images/FoundatonCutDown.png";
// import TypeseOfRiding from "./images/TypeseOfRiding.webp";
// import TypeseOfRidingCut from "./images/TypeseOfRidingCut.png";
// import ExampleCircleImageRiding from "./images/ExampleCircleImageRiding.webp";
// import AchievementsImage from "./images/horanakone.webp";
// import AchievementsCutDown from "./images/AchievementsCutDown.webp";
// import AchievementsCutBig from "./images/AchievementsCutBig.webp";
// import Hat from "./images/Group.webp";
import Sevice from "./images/usluga.webp";
// import Girl from "./images/GirlOnHorse.webp";
// import Jumping from "./images/skacha.webp";
import forUsBack from "./images/forUsBack.webp";
import forUsFront from "./images/forUsFront.webp";
import fourSectionsTop from "./images/fourSectionsTop.webp";
import fourSectionsBottom from "./images/fourSectionsBottom.webp";
import { MenuSections } from "./Page";
import { useTranslation } from "react-i18next";
import { VoucherForm } from "./Vouchers";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMediaQuery } from "@mui/material";

const ImageModal = ({ isOpen, images, currentIndex, onClose, onNext, onPrev }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay"
      onClick={(e) => {
        if(!e.target.closest(".modal-next") && !e.target.closest(".modal-prev") && !e.target.closest(".modal-close")) {
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

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const [openGallery, setOpenGallery] = useState({ isOpen: false, images: [], currentIndex: 0 });
  const isDesktop = useMediaQuery('(min-width: 800px)');
  const isTablet = useMediaQuery('(min-width: 500px)');

  useEffect(() => {
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
          } else if (gallery.scrollLeft === 0 && !isPrepending && !isAppending) {
            isPrepending = true;
            if(isDown) {
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
    GetGalleries();
  }, []);

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
    return function(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

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

      <div id="Header">
        <video autoPlay muted playsInline id="HeaderVideo" onEnded={(e) => e.target.play()} preload="auto" onCanPlayThrough={(e) => e.target.play()}>
          <source src={AdgorVideo} type="video/webm" />
        </video>
        <div id="Titles">
          <p id="Title1">{t("horseBase")}</p>
          <p id="TItle2">{t("adgor")}</p>
        </div>
      </div>

      <div id="forUs">
        <div id="forUsImage">
          <img src={forUsBack} alt=""/>
          <img src={forUsFront} alt="" />
        </div>
        <div id="forUsText">
          <p id="forUsTitle">За Нас</p>
          <p id="forUsNormalText" className="normalText">Конна база „Адгор" се намира в непосредствена близост до София, в изключително красив екологично чист район с вълнуваща панорама към четири планини – Рила, Верила, Витоша и Плана.</p>
          <a id="forUsButton" href="/page/About/our-team" className="linkButton">Вижте повече</a>
        </div>
      </div>

      <div id="threeImagesSection">
        <a href="/" className="threeLinkText">
          <div>
            <div className="rightTopBorder"></div>
            <div className="threeLinkImg">
              <img src={Pansion} alt="" />
            </div>
            <div className="leftBottomBorder"></div>
          </div>
          <p>Boarding House</p>
        </a>
        <a href="/" className="threeLinkText">
          <div>
            <div className="rightTopBorder"></div>
            <div className="threeLinkImg">
              <img src={TrenirovkiNaKone} alt="" />
            </div>
            <div className="leftBottomBorder"></div>
          </div>
          <p>Riding</p>
        </a>
        <a href="/" className="threeLinkText">
          <div>
            <div className="rightTopBorder"></div>
            <div className="threeLinkImg">
              <img src={Ezda} alt="" />
            </div>
            <div className="leftBottomBorder"></div>
          </div>
          <p>Horse Training</p>
        </a>
      </div>

      {isDesktop ? (
        // <img src={i18n.language === "bg" ? Steps : StepsEn} alt="" width={"100%"} style={{ margin: "50px 0px" }} />
        <img src={StepsEn} alt="" width={"100%"} style={{ margin: "50px 0px" }} />
      ) : (
        <>
          {isTablet ? (
            <img
              // src={i18n.language === "bg" ? StepsSmall : StepsSmallEn}
              src={StepsSmallEn}
              alt=""
              width={"100%"}
              style={{ margin: "25px 0px" }}
            />
          ) : (
            <img
              // src={i18n.language === "bg" ? StepsSmall : StepsSmallEn}
              src={StepsSmallEn}
              alt=""
              width={"100%"}
              style={{ margin: "25px 0px" }}
            />
          )}
        </>
      )}

      <div id="fourSections">
        <div id="fourSectionsObject">
          <div id="fourSectionsText">
            <p id="foundationTitle">Adgor for the horses</p>
            <p id="foundationNormalText" className="normalText">
              Фондация „Адгор за конете“ дава възможност за осиновяване на кон. По този начин ще можете да подпомогнете отглеждането и обгрижването на избрано от вас животно, което се нуждае от верен приятел. Това ще ви позволи да се научите да общувате с него пълноценно и да вкусите както от удоволствието, така и от отговорността да притежавате кон.
            </p>
            <div className="foundationLink">
              <a href="/" className="linkButton">See more</a>
            </div>
          </div>
          <div id="foundationImage">
            <img src={fourSectionsTop} alt="" />
          </div>
        </div>
        <div id="fourSectionsObject">
          <div id="foundationImage">
            <img src={fourSectionsBottom} alt="" />
          </div>
          <div id="fourSectionsText">
            <p id="foundationTitle">Gift with a cause</p>
            <p id="foundationNormalText" className="normalText">
              Конете са символ на свобода и сила. Те са верни приятели и партньори в спорта и терапията. Връзката между човек и кон е уникална, изградена на доверие и уважение. Конете ни учат на търпение, грижа и отговорност. Те са не само средство за транспорт или спорт, но и източник на радост и вдъхновение. Всяка среща с кон е незабравимо преживяване, което оставя трайни спомени.
            </p>
            <div className="foundationLink">
              <a href="/" className="linkButton">See more</a>
            </div>
          </div>
        </div>
      </div>

      <div id="services">
        <p id="servicesTitle" className="centerTitle">Services</p>

        <div id="servicesObjects">
          <div className="servicesObject">
            <img src={Sevice} alt="" />
            <p className="serviceTitle">Trail riding</p>
            <p className="serviceDescription">Brief description of about 30 words, 1 to 2 sentences. About this long.</p>
            <a href="/" className="linkButton">See more</a>
          </div>

          <div className="servicesObject">
            <img src={Sevice} alt="" />
            <p className="serviceTitle">Team buildings</p>
            <p className="serviceDescription">Brief description of about 30 words, 1 to 2 sentences. About this long.</p>
            <a href="/" className="linkButton">See more</a>
          </div>

          <div className="servicesObject">
            <img src={Sevice} alt="" />
            <p className="serviceTitle">Kid’s group</p>
            <p className="serviceDescription">Brief description of about 30 words, 1 to 2 sentences. About this long.</p>
            <a href="/" className="linkButton">See more</a>
          </div>

          <div className="servicesObject">
            <img src={Sevice} alt="" />
            <p className="serviceTitle">Birthdays</p>
            <p className="serviceDescription">Brief description of about 30 words, 1 to 2 sentences. About this long.</p>
            <a href="/" className="linkButton">See more</a>
          </div>

          <div className="servicesObject">
            <img src={Sevice} alt="" />
            <p className="serviceTitle">Demonstrations</p>
            <p className="serviceDescription">Brief description of about 30 words, 1 to 2 sentences. About this long.</p>
            <a href="/" className="linkButton">See more</a>
          </div>

          <div className="servicesObject">
            <img src={Sevice} alt="" />
            <p className="serviceTitle">Photo shoots</p>
            <p className="serviceDescription">Brief description of about 30 words, 1 to 2 sentences. About this long.</p>
            <a href="/" className="linkButton">See more</a>
          </div>
        </div>
      </div>

      <div style={{marginBottom: "120px"}}>
        <p className="centerTitle" style={{textAlign: "center", fontSize: "36px", marginBottom: "16px"}}>{i18n.language === "bg" ? "Поръчай ваучер" : "Order a voucher"}</p>
        <VoucherForm lang={i18n.language} />
      </div>

      <div id="gallery">
        <p className="centerTitle">Gallery</p>

        <div id="gallery-0db2c50e-f29e-4c25-b87a-4d6ee8e391b8" className="gallery-container">
            <div className="gallery-item">
              <img src="/server/files/images/image-1739367835180.webp" alt="" />
            </div>
          
            <div className="gallery-item">
              <img src="/server/files/images/image-1739367837482.webp" alt="" />
            </div>
          
            <div className="gallery-item">
              <img src="/server/files/images/image-1739367853805.webp" alt="" />
            </div>
          
            <div className="gallery-item">
              <img src="/server/files/images/image-1739367859904.webp" alt="" />
            </div>
          
            <div className="gallery-item">
              <img src="/server/files/images/image-1739367867777.webp" alt="" />
            </div>
          
            <div className="gallery-item">
              <img src="/server/files/images/image-1739367878779.webp" alt="" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
