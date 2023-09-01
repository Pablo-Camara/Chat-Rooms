import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => login()}>Login</button>
    </div>
  );
};

export default LoginPage;
