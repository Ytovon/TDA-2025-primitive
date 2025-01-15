import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Typy pro kontext
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Inicializace kontextu
const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

// Provider komponenta
interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  // Inicializace darkMode z localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("darkMode") || "false");
  });

  // Ukládání darkMode do localStorage při každé změně a aplikace třídy na body
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!darkMode) {
      document.body.classList.add("dark-mode");
      metaThemeColor != null &&
        metaThemeColor.setAttribute("content", "#1a1a1a");
    } else {
      document.body.classList.remove("dark-mode");
      metaThemeColor != null &&
        metaThemeColor.setAttribute("content", "#ffffff");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Funkce pro přepínání režimu
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Vlastní hook pro použití kontextu
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode musí být použit uvnitř DarkModeProvider");
  }
  return context;
};
