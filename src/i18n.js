import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            horseBase: "Welcome to Adgor Equestrian Center",
            adgor: "Freedom, development, community.",
            numberOne: "1# in Bulgaria for Western and NH",
            more: "More",
            workouts: "Horse",
            forHorses: "Training",
            boardingHouse: "Boarding House",
            riding: "Riding",
            youWantToRide: "You want to ride?",
            callUs: "Call us",
            makeAnAppointment: "Make an appointment",
            enjoyTheRide: "Enjoy the ride",
            foundation: "Foundation",
            adgorForHorses: "Adgor for horses",
            western: "WESTERN",
            ride: "RIDE",
            natural: "NATURAL",
            horsemanship: "HORSEMANSHIP",
            falabella: "FALABELLA",
            ourAchievements: "Our Achievements",
            achievementsDescription: "Adgor riding complex offers riding, groundwork, horse and people training. It is up to you to make up your mind about what exactly you would like to achieve, feel or learn."
        },
    },
    bg: {
        translation: {
            horseBase: "ДОБРЕ ДОШЛИ В КОННА БАЗА АДГОР",
            adgor: "Свобода, развитие, общност.",
            numberOne: "1# в България по Western и NH",
            more: "Още",
            workouts: "Тренировки",
            forHorses: "На Коне",
            boardingHouse: "Пансион",
            riding: "Езда",
            youWantToRide: "Искате да яздите?",
            callUs: "Обадете се",
            makeAnAppointment: "Запазете час",
            enjoyTheRide: "Насладете се на ездата",
            foundation: "Фондация",
            adgorForHorses: "Адгор за конете",
            western: "УЕСТЪРН",
            ride: "ЕЗДА",
            natural: "ЕСТЕСТВЕНО",
            horsemanship: "ЕЗДОВОДСТВО",
            falabella: "ФАЛАБЕЛА",
            ourAchievements: "Нашите Постижения",
            achievementsDescription: "Комплекс за езда Adgor предлага езда, работа с коне от земята, обучение на коне и хора. Изборът е изцяло ваш – решете какво точно искате да постигнете, почувствате или научите."
        },
    },
};

i18n
.use(initReactI18next)
.init({
    resources,
    lng: localStorage.getItem("lang") || "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;