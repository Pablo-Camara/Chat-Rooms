import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const MainMenuPage = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Main Menu</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default MainMenuPage;
