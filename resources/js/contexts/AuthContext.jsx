import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(
        localStorage.getItem('UID')
    );

    const login = async (
        username, password,
        successCallback, failCallback
    ) => {
        let response;
        try {
            response = await axios.post('/api/login', {
                username,
                password
            });
        } catch (error) {
            if (typeof failCallback === 'function') {
                failCallback();
            }
            return;
        }

        if (response.status === 200) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('UID', response.data.userId);
            setUserId(response.data.userId);
            if (typeof successCallback === 'function') {
                successCallback();
            }
        } else {
            if (typeof failCallback === 'function') {
                failCallback();
            }
            throw new Error(response.message);
        }
    };

    const logout = async (callback) => {
        const response = await axios.post('/api/logout');

        if (response.status === 200) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('UID');
            setUserId(null);
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            throw new Error(response.message);
        }

        if (typeof callback === 'function') {
            callback();
        }
    };

    const register = async (
        firstName,
        lastName,
        username,
        password,
        passwordConfirmation,
        successCallback,
        failCallback
    ) => {

        let response;
        try {
            response = await axios.post('/api/register', {
                firstName,
                lastName,
                username,
                password,
                passwordConfirmation
            });
        } catch (error) {
            if (typeof failCallback === 'function') {
                failCallback(error.response.data.errors);
            }
            return;
        }

        if (response.status === 200) {
            if(response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('UID', response.data.userId);
                setUserId(response.data.userId);
                if (typeof successCallback === 'function') {
                    successCallback();
                }
            }
        } else {
            if (typeof failCallback === 'function') {
                failCallback(response.data.errors);
            }
            throw new Error(response.message);
        }
    };

    return (
      <AuthContext.Provider
        value={{
            userId, login, logout, register
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthContextProvider;
