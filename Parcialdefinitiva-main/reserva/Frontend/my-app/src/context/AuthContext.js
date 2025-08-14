// src/context/AuthContext.js
import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Crea el contexto. Es como un contenedor para el estado.
const AuthContext = createContext(null);

// 2. Crea un hook personalizado. Esto nos permite usar el contexto fácilmente
//    en cualquier componente sin tener que importar createContext y useContext
//    en cada archivo.
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Crea el componente Provider. Este componente envolverá toda la aplicación
//    y proporcionará el estado y las funciones a todos los componentes que
//    estén dentro de él.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Carga el usuario desde localStorage al iniciar la aplicación.
  // Es la misma lógica que tenías en App.js.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al analizar el usuario desde localStorage", e);
        localStorage.removeItem('user'); 
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  // Define el objeto de valor que se pasará a los componentes hijos.
  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
