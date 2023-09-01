import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import Container from "../components/Container";
import TextBoxLabel from "../components/TextBoxLabel";
import TextBox from "../components/TextBox";
import Button from "../components/Button";
import HorizontalSeparator from "../components/HorizontalSeparator";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const registerAttempt = () => {
    register(() => {
        navigate('/');
    });
  };

  const showLoginForm = () => {
    navigate('/login');
  };

  return <>
        <Container>
            <Header type="h1">Create an account</Header>

            <TextBoxLabel>First name:</TextBoxLabel>
            <TextBox />

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Last name:</TextBoxLabel>
            <TextBox />

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Create an Username:</TextBoxLabel>
            <TextBox />

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Create a password:</TextBoxLabel>
            <TextBox />

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Type your password again:</TextBoxLabel>
            <TextBox />

            <Button
                onClick={() => registerAttempt()}
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
                If you already have created an account then you can go to the:
            </Header>
            <Button
                onClick={showLoginForm}
                style={{
                    marginTop: '15px'
                }}>Login page</Button>
        </Container>

    </>;
};

export default RegisterPage;
