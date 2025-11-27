import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [loaded, setLoaded] = useState(false);

  // Google translate yuklanishini kutamiz
  useEffect(() => {
    const interval = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        setLoaded(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (lang: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="relative inline-block">
      <select
        disabled={!loaded}
        onChange={(e) => changeLanguage(e.target.value)}
        className="
          bg-white text-black px-4 py-2 rounded-xl shadow 
          border border-gray-300 focus:outline-none 
          cursor-pointer transition-all 
          hover:shadow-md
        "
      >
        <option value="">Tilni tanlang</option>
        <option value="uz">O'zbekcha</option>
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
}
