// DarkModeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
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
