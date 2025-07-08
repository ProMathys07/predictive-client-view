
import React, { createContext, useContext, useEffect, useState } from 'react';

// Interface pour le contexte du thème
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Création du contexte avec une valeur par défaut
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte du thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider pour le thème - gère l'état global du thème
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État pour le thème actuel, récupéré depuis localStorage ou 'light' par défaut
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  // Fonction pour changer le thème
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Effet pour appliquer la classe du thème au document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
