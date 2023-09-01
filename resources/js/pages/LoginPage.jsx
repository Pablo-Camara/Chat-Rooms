import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import Container from "../components/Container";
import TextBoxLabel from "../components/TextBoxLabel";
import TextBox from "../components/TextBox";
import Button from "../components/Button";
import HorizontalSeparator from "../components/HorizontalSeparator";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginAttempt = () => {
    login('pc', '1234',() => {
        navigate('/');
    });
  };

  const showRegisterForm = () => {
    navigate('/register');
  };

  return <>
        <Container>
            <Header type="h1">Login</Header>

            <TextBoxLabel>Username:</TextBoxLabel>
            <TextBox />

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Password:</TextBoxLabel>
            <TextBox />

            <Button
                onClick={() => loginAttempt()}
                style={{
                    marginTop: '16px'
                }}>Continue</Button>
        </Container>

        <Container style={{
            width: '320px'
        }}>
            <HorizontalSeparator style={{
                marginTop: '30px'
            }}/>
        </Container>

        <Container>
            <Header type="h2"
                style={{
                    marginTop: '30px'
                }}>
                If you don’t have an account yet, then you can:
            </Header>
            <Button
                onClick={showRegisterForm}
                style={{
                    marginTop: '15px'
                }}>Create an account</Button>
        </Container>
    </>;
};

export default LoginPage;
