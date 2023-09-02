import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import Container from "../components/Container";
import TextBoxLabel from "../components/TextBoxLabel";
import TextBox from "../components/TextBox";
import Button from "../components/Button";
import HorizontalSeparator from "../components/HorizontalSeparator";
import { useNavigate } from "react-router";
import Text from "../components/Text";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ hasLoginError, setHasLoginError ] = useState(false);

  const navigate = useNavigate();

  const loginAttempt = () => {
    setHasLoginError(false);
    login(
        username, password,
        () => {
            navigate('/');
        },
        () => {
            setHasLoginError(true);
        }
    );
  };

  const showRegisterForm = () => {
    navigate('/register');
  };

  return <>
        <Navbar />
        <Container>
            <Header type="h1">Login</Header>

            <TextBoxLabel>Username:</TextBoxLabel>
            <TextBox value={username} setTextFunc={setUsername}/>

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Password:</TextBoxLabel>
            <TextBox type="password"
                value={password}
                setTextFunc={setPassword}/>

            {
                hasLoginError
                &&
                <Text style={{
                    color: 'red'
                }}>
                    Login was not successful
                </Text>
            }

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
