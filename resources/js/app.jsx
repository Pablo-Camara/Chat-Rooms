import './bootstrap';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
  } from "react-router-dom";

import AuthContextProvider from './contexts/AuthContext';
import ChatRoomContextProvider from './contexts/ChatRoomContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainMenuPage from './pages/MainMenuPage';
import ChatRoomPage from './pages/ChatRoomPage';
import FindUsersPage from './pages/FindUsersPage';
import AuthMiddleware from './middleware/AuthMiddleware';
import UserProfilePage from './pages/UserProfilePage';
import ProfilePageContextProvider from './contexts/ProfilePageContext';


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthMiddleware>
            <MainMenuPage />
        </AuthMiddleware>,
    },
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "register",
        element: <RegisterPage />,
    },
    {
        path: "chat",
        element: <AuthMiddleware>
            <ChatRoomPage />
        </AuthMiddleware>,
    },
    {
        path: "find-users",
        element: <AuthMiddleware>
            <FindUsersPage />
        </AuthMiddleware>,
    },
    {
        path: "user",
        element: <AuthMiddleware>
            <UserProfilePage />
        </AuthMiddleware>,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
        <ChatRoomContextProvider>
            <ProfilePageContextProvider>
                <RouterProvider router={router} />
            </ProfilePageContextProvider>
        </ChatRoomContextProvider>
    </AuthContextProvider>
);
