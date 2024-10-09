import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../data/en.json";
import pt from "../data/pt.json"; // Corrigido para o arquivo correto de português

// Traduções
const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

// Inicialização do i18next
i18n
  .use(initReactI18next) // Passa o i18n para o react-i18next
  .init({
    resources,
    lng: "pt", // Idioma padrão
    fallbackLng: "en", // Idioma de fallback corrigido para inglês
    interpolation: {
      escapeValue: false, // React já faz a sanitização
    },
  });

export default i18n;
