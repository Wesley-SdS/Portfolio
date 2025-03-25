import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../data/locales/en.json";
import pt from "../data/locales/pt.json"; 
import es from "../data/locales/es.json";


const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: es },
};

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next) // Integração com React
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
