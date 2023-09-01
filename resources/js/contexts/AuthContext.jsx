import React, { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false
});

export const AuthContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    return (
      <AuthContext.Provider
        value={{ isLoggedIn, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthContextProvider;
