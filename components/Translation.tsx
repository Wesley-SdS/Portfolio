import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Translation = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<"en" | "pt" | "es">(i18n.language as "en" | "pt" | "es");

  const flags: Record<"en" | "pt" | "es", string> = {
    en: "https://flagcdn.com/w40/us.png",
    pt: "https://flagcdn.com/w40/br.png",
    es: "https://flagcdn.com/w40/es.png",
  };

  const handleLanguageChange = (value: "en" | "pt" | "es") => {
    if (value !== language) {
      setLanguage(value);
      i18n.changeLanguage(value); // Altera o idioma no i18next
      router.push(router.pathname, router.asPath, { locale: value }); // Atualiza a URL
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-black-custom-dark">
      <div className="relative">
        <Select
          onValueChange={(value: "en" | "pt" | "es") =>
            handleLanguageChange(value)
          }
        >
          <SelectTrigger className="w-full border-none">
            <div className="flex items-center gap-2">
              <img src={flags[language]} alt={language} className="h-7 w-8" />
            </div>
          </SelectTrigger>
          <SelectContent className="absolute top-full left-0 z-50 bg-black-custom-dark">
            {Object.entries(flags).map(([key, flag]) => (
              <SelectItem
                key={key}
                value={key as "en" | "pt" | "es"}
                className="hover:bg-violet-300 focus:bg-violet-300"
              >
                <div className="flex items-center gap-2">
                  <img src={flag} alt={key} className="h-7 w-8" />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Translation;
