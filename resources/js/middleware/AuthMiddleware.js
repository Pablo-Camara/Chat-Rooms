import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AuthMiddleware = ({ children }) => {
    const navigate = useNavigate();
    const authDataMissing = !localStorage.getItem('authToken') || !localStorage.getItem('UID');

    authDataMissing && useEffect(() => {
            // Redirect to the login page
            localStorage.removeItem('authToken');
            localStorage.removeItem('UID');
            navigate('/login');
    }, []);

    if (!authDataMissing) {
        return children;
    }

    return null;
};

export default AuthMiddleware;
