import React from "react";
import "./WelcomePage.css";
// import HeaderSnimka from "./images/HeaderSnimka.webp";
// import Logo from "./images/AdgorLogo.webp";
import AdgorVideo from "./images/adgorStartingVideo.webm";
import TrenirovkiNaKone from "./images/TrenirovkiNaKoneIMG.webp";
import Pansion from "./images/PansionIMG.webp";
import Ezda from "./images/EzdaIMG.webp";
import Steps from "./images/Steps.webp";
import StepsEn from "./images/StepsEn.webp";
import StepsSmall from "./images/StepsSmall.webp";
import StepsSmallEn from "./images/StepsSmallEn.webp";
import LineHores from "./images/twohorses.webp";
import Foundation from "./images/Foundation.webp";
import FoundationCutUp from "./images/FoundationCutUp.png";
import FoundationCutDown from "./images/FoundatonCutDown.png";
import TypeseOfRiding from "./images/TypeseOfRiding.webp";
import TypeseOfRidingCut from "./images/TypeseOfRidingCut.png";
import ExampleCircleImageRiding from "./images/ExampleCircleImageRiding.webp";
import AchievementsImage from "./images/horanakone.webp";
import AchievementsCutDown from "./images/AchievementsCutDown.webp";
import AchievementsCutBig from "./images/AchievementsCutBig.webp";
import Hat from "./images/Group.webp";
import Sevice from "./images/usluga.webp";
import Girl from "./images/GirlOnHorse.webp";
import Jumping from "./images/skacha.webp";
import { MenuSections } from "./Page";
import { useTranslation } from "react-i18next";
import { VoucherForm } from "./Vouchers";

const WelcomePage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <div id="StickyMenu">
        <MenuSections />
      </div>

      <div id="Header">
        <video autoPlay muted playsInline id="HeaderVideo" onEnded={(e) => e.target.play()} preload="auto" onCanPlayThrough={(e) => e.target.play()}>
          <source src={AdgorVideo} type="video/webm" />
        </video>
        <div id="Titles">
          <p id="Title1">{t("horseBase")}</p>
          <p id="TItle2">{t("adgor")}</p>
        </div>
      </div>

      {window.innerWidth > 665 ? (
        <div className="socials">
          <p id="SocialsEmail">adgor@abv.bg</p>
          <a href="https://www.facebook.com/groups/adgor/">
            <svg
              id="FacebookSVG"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                fill="#0F0F0F"
              />
            </svg>
          </a>
          <a href="https://www.instagram.com/adgor.bg/">
            <svg
              id="InstagramSVG"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                fill="#0F0F0F"
              />
              <path
                d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                fill="#0F0F0F"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                fill="#0F0F0F"
              />
            </svg>
          </a>
          {/* <a href="/">
            <svg
              id="TikTokSVG"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
                stroke="#000000"
                strokeLinejoin="round"
              />
            </svg>
          </a> */}
          <p id="SocialsNumber">0876120025</p>
        </div>
      ) : (
        <div>
          <div id="contactsSmall">
            <p id="SocialsEmail">adgor@abv.bg</p>
            <p id="SocialsNumber">0876120025</p>
          </div>
          <div id="contactsSmall">
            <a href="https://www.facebook.com/groups/adgor/">
              <svg
                id="FacebookSVG"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                  fill="#0F0F0F"
                />
              </svg>
            </a>
            <a href="https://www.instagram.com/adgor.bg/">
              <svg
                id="InstagramSVG"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  fill="#0F0F0F"
                />
                <path
                  d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                  fill="#0F0F0F"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                  fill="#0F0F0F"
                />
              </svg>
            </a>
            <a href="/">
              <svg
                id="TikTokSVG"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
                  stroke="#000000"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      )}

      <div id="forUs">
        <div id="forUsImage">
          <img src={Foundation} alt=""/>
        </div>
        <div id="forUsText">
          <p id="forUsSmallText">Текстът по-долу е написан от ChatGPT</p>
          <p id="forUsTitle">За Нас Заглавие</p>
          <p id="forUsNormalText" className="normalText">Конете са едни от най-великолепните и благородни животни, съпътстващи човека от древни времена. Те впечатляват с изяществото на движенията си, интелигентността и предаността. От ездата и състезанията до терапевтичните програми, конете са незаменима част от живота на много хора. Тяхната връзка с човека е уникална, изградена на доверие и взаимно уважение. Независимо дали сте любител на природата, състезател или просто търсите спокойствие, конете носят радост и вдъхновение на всеки, който се докосне до тях.</p>
          <button id="forUsButton">Научете повече</button>
        </div>
      </div>

      <div id="OneImageNextToTwoAlignment">
        <div id="TwoImagesOnTopOfEachOther">
          <a href="/" className="threeLinkText">
            <div
              className="threeImages"
              style={{ backgroundImage: `url(${TrenirovkiNaKone})` }}
            >
              <p className="threeTexts">
                {t("workouts")}
                <br />
                {t("forHorses")}
              </p>
            </div>
          </a>

          <a href="/" className="threeLinkText">
            <div
              className="threeImages"
              style={{ backgroundImage: `url(${Pansion})` }}
            >
              <p className="threeTexts">{t("boardingHouse")}</p>
            </div>
          </a>
        </div>

        <a id="OneImageNextToTheTwo" href="/" className="threeLinkText">
          <div
            className="threeImages"
            id="OneImageNextToTwoTheImage"
            style={{ backgroundImage: `url(${Ezda})` }}
          >
            <p className="threeTexts">{t("riding")}</p>
          </div>
        </a>
      </div>

      {window.innerWidth > 800 ? (
        <img src={i18n.language === "bg" ? Steps : StepsEn} alt="" width={"100%"} style={{ margin: "50px 0px" }} />
      ) : (
        <>
          {window.innerWidth > 500 ? (
            <img
              src={i18n.language === "bg" ? StepsSmall : StepsSmallEn}
              alt=""
              width={"100%"}
              style={{ margin: "25px 0px" }}
            />
          ) : (
            <div>
              <div className="alignCenter">
                <p id="WantToRide">{t("youWantToRide")}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "6vw",
                }}
              >
                <ul>
                  <li>{t("callUs")}</li>
                  <li>{t("makeAnAppointment")}</li>
                  <li>{t("enjoyTheRide")}</li>
                </ul>
              </div>
              <img src={LineHores} alt="" width={"100%"} />
            </div>
          )}
        </>
      )}

      <div id="fourSections">
        <div id="fourSectionsObject">
          <div id="fourSectionsText">
            <p id="foundationTitle">Фондация "Адгор за конете"</p>
            <p id="foundationNormalText" className="normalText">Фондация „Адгор за конете“ дава възможност за осиновяване на кон. По този начин ще можете да подпомогнете отглеждането и обгрижването на избрано от вас животно, което се нуждае от верен приятел. Това ще ви позволи да се научите да общувате с него пълноценно и да вкусите както от удоволствието, така и от отговорността да притежавате кон.</p>
          </div>
          <div id="foundationImage">
            <img src={Foundation} alt="" />
          </div>
        </div>
        <div id="fourSectionsObject">
          <div id="foundationImage">
            <img src={Foundation} alt="" />
          </div>
          <div id="fourSectionsText">
            <p id="foundationTitle">Подарък с кауза</p>
            <p id="foundationNormalText" className="normalText">
              Конете са символ на свобода и сила. Те са верни приятели и партньори в спорта и терапията. Връзката между човек и кон е уникална, изградена на доверие и уважение. Конете ни учат на търпение, грижа и отговорност. Те са не само средство за транспорт или спорт, но и източник на радост и вдъхновение. Всяка среща с кон е незабравимо преживяване, което оставя трайни спомени.
            </p>
          </div>
        </div>
      </div>

      <div style={{margin: "48px"}}>
        <p style={{textAlign: "center", fontSize: "36px", marginBottom: "16px"}}>{i18n.language === "bg" ? "Поръчай ваучер" : "Order a voucher"}</p>
        <VoucherForm lang={i18n.language} />
      </div>

      <div id="alignFoundationCenter">
        <div style={{ backgroundImage: `url(${Foundation})` }} id="Foundation">
          <img src={FoundationCutUp} alt="" width={"100%"} />
          <div id="FoundationText">
            {t("foundation")} <br /> “{t("adgorForHorses")}” <br />
            <button id="AboutFoundationButon">{t("more")}</button>
          </div>
          <img src={FoundationCutDown} alt="" width={"100%"} />
        </div>
      </div>

      <div id="alignFoundationCenter">
        <div
          style={{ backgroundImage: `url(${TypeseOfRiding})` }}
          id="TypeseOfRiding"
        >
          <img src={TypeseOfRidingCut} alt="" width={"100%"} />
          <div id="ThreeStyles">
            <div className="RidingStyle">
              <a className="stylesLink" href="/">
                <div className="stylesContent">
                  <img
                    className="stylesImage"
                    src={ExampleCircleImageRiding}
                    alt=""
                  />
                  <p className="stylesName">
                    {t("western")}
                    <br />
                    {t("ride")}
                  </p>
                </div>
              </a>
            </div>
            <div className="RidingStyle">
              <a className="stylesLink" href="/">
                <div className="stylesContent">
                  <img
                    className="stylesImage"
                    src={ExampleCircleImageRiding}
                    alt=""
                  />
                  <p className="stylesName" style={{letterSpacing: "0"}}>
                    {t("natural")}
                    <br />
                    {t("horsemanship")}
                  </p>
                </div>
              </a>
            </div>
            <div className="RidingStyle">
              <a className="stylesLink" href="/">
                <div className="stylesContent">
                  <img
                    className="stylesImage"
                    src={ExampleCircleImageRiding}
                    alt=""
                  />
                  <p className="stylesName">{t("falabella")}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="Achievements">
        <div
          style={{ backgroundImage: `url(${AchievementsImage})` }}
          id="AchievementsImage"
        >
          <p
            id="OurAchievementsTitle"
            style={{ color: "white", fontWeight: "900", marginTop: "4vw" }}
          >
            {t("ourAchievements")}
          </p>
          <br />
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <p
              id="OurAchievementsText"
              className=""
              style={{
                color: "white",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {t("achievementsDescription")}
            </p>
          </div>
          <br />
          <button id="AboutAchievementsButon">{t("more")}</button>
        </div>
        <br />
        {window.innerWidth < 3950 && (
          <>
            {window.innerWidth < 1970 ? (
              <div id="broqnBackgroundUnderAchievementsCut">
                <img
                  id="AchievementsCutDown"
                  src={AchievementsCutDown}
                  alt=""
                  width={"100%"}
                />
              </div>
            ) : (
              <div id="broqnBackgroundUnderAchievementsCutBig">
                <img
                  id="AchievementsCutDownBig"
                  src={AchievementsCutBig}
                  alt=""
                  width={"100%"}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ background: "#22120C", paddingTop: "5vw" }}>
        {window.innerWidth > 1000 && (
          <div style={{ height: "0px", width: "100%" }}>
            <img className="albumPhoto" id="Girl" src={Girl} alt="" />
            <img className="albumPhoto" id="Jumping" src={Jumping} alt="" />
          </div>
        )}
        <img className="hat" src={Hat} alt="" />
        <div id="SixServices">
          {/* 1 */}
          <div className="serviceBox">
            <img className="serviceImage" src={Sevice} alt="" width={"100%"} />
            <p className="serviceTitle">Услуга</p>
            <p className="serviceText normalText">Описание на услуга.</p>
            <button className="moreServicesButton">Още</button>
          </div>
          {/* 2 */}
          <div className="serviceBox">
            <img className="serviceImage" src={Sevice} alt="" width={"100%"} />
            <p className="serviceTitle">Услуга</p>
            <p className="serviceText normalText">Описание на услуга.</p>
            <button className="moreServicesButton">Още</button>
          </div>
          {/* 3 */}
          <div className="serviceBox">
            <img className="serviceImage" src={Sevice} alt="" width={"100%"} />
            <p className="serviceTitle">Услуга</p>
            <p className="serviceText normalText">Описание на услуга.</p>
            <button className="moreServicesButton">Още</button>
          </div>
          {/* 4 */}
          <div className="serviceBox">
            <img className="serviceImage" src={Sevice} alt="" width={"100%"} />
            <p className="serviceTitle">Услуга</p>
            <p className="serviceText normalText">Описание на услуга.</p>
            <button className="moreServicesButton">Още</button>
          </div>
          {/* 5 */}
          <div className="serviceBox">
            <img className="serviceImage" src={Sevice} alt="" width={"100%"} />
            <p className="serviceTitle">Услуга</p>
            <p className="serviceText normalText">Описание на услуга.</p>
            <button className="moreServicesButton">Още</button>
          </div>
          {/* 6 */}
          <div className="serviceBox">
            <img className="serviceImage" src={Sevice} alt="" width={"100%"} />
            <p className="serviceTitle">Услуга</p>
            <p className="serviceText normalText">Описание на услуга.</p>
            <button className="moreServicesButton">Още</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
