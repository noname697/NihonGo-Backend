import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("@NihonGo:theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    localStorage.setItem("@NihonGo:theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => {
    return {
      theme,
      toggleTheme,
    };
  }, [theme]);

  return <ThemeContext value={value}></ThemeContext>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider.");
  }

  return context;
};
