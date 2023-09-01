import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

const MainMenuPage = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
        navigate('/login');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <></>;
  }

  const logoutAttempt = () => {
    logout(() => {
        navigate('/login');
    })
  };

  return (
    <div>
      <h1>Main Menu</h1>
      <button onClick={() => logoutAttempt()}>Logout</button>
    </div>
  );
};

export default MainMenuPage;
