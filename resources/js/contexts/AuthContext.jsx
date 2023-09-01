import React, { createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const login = (callback) => {
        setIsLoggedIn(true);
        if (typeof callback === 'function') {
            callback();
        }
    };

    const logout = (callback) => {
        setIsLoggedIn(false);
        if (typeof callback === 'function') {
            callback();
        }
    };

    const register = (callback) => {
        setIsLoggedIn(true);
        if (typeof callback === 'function') {
            callback();
        }
    };

    return (
      <AuthContext.Provider
        value={{ isLoggedIn, login, logout, register }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthContextProvider;
