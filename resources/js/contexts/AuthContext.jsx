import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [friends, setFriends] = useState([
        {
            firstName: 'Pablo',
            lastName: 'Câmara',
            username: 'pablocamara1996'
        },
        {
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe321'
        },
        {
            firstName: 'Shakira',
            lastName: 'Singer',
            username: 'shakirawegue'
        },
        {
            firstName: 'Michael',
            lastName: 'Jackson',
            username: 'michaeljackson'
        },
    ]);

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

    const getFriends = () => {
        return friends;
    };

    return (
      <AuthContext.Provider
        value={{
            isLoggedIn, login, logout, register, getFriends
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthContextProvider;
