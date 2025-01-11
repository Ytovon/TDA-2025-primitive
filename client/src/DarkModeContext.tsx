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
    if (!darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
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
