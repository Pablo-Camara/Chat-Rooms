import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authToken, setAuthToken] = useState(null);

    const login = async (username, password, callback) => {
        const response = await axios.post('/api/login', {
            username,
            password
        });

        if (response.status === 200) {
            setIsLoggedIn(true);
            setAuthToken(response.data.token);
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            throw new Error(response.message);
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
        value={{
            isLoggedIn, authToken, login, logout, register
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthContextProvider;
