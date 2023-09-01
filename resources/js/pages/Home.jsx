import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import MainMenuPage from "./MainMenuPage";
import LoginPage from "./LoginPage";

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return <>
        {
            !isLoggedIn &&
            <LoginPage />
        }

        {
            isLoggedIn &&
            <MainMenuPage />
        }
  </>;
};

export default Home;
