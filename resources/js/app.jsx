import './bootstrap';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
  } from "react-router-dom";

import AuthContextProvider from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainMenuPage from './pages/MainMenuPage';
import ChatRoomPage from './pages/ChatRoomPage';
import FindUsersPage from './pages/FindUsersPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainMenuPage />,
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
        element: <ChatRoomPage />,
    },
    {
        path: "find-users",
        element: <FindUsersPage />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
         <RouterProvider router={router} />
    </AuthContextProvider>
);
