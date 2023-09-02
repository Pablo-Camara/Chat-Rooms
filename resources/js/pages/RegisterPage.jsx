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

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [ errors, setErrors ] = useState([]);
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
  const navigate = useNavigate();

  const registerAttempt = () => {
    setErrors([]);
    register(
        firstName,
        lastName,
        username,
        password,
        passwordConfirmation,
        () => {
            navigate('/');
        },
        (errors) => {
            if (errors instanceof Array) {
                setErrors(errors);
            } else {
                setErrors([
                    {
                        text: 'Could not register your account'
                    }
                ]);
            }
        }
    );
  };

  const showLoginForm = () => {
    navigate('/login');
  };

  return <>
        <Container>
            <Header type="h1">Create an account</Header>

            <TextBoxLabel>First name:</TextBoxLabel>
            <TextBox value={firstName} setTextFunc={setFirstName}/>

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Last name:</TextBoxLabel>
            <TextBox value={lastName} setTextFunc={setLastName}/>

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Create an Username:</TextBoxLabel>
            <TextBox value={username} setTextFunc={setUsername}/>

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Create a password:</TextBoxLabel>
            <TextBox type="password"
                value={password}
                setTextFunc={setPassword}/>

            <TextBoxLabel
                style={{
                    marginTop: '15px'
                }}>Type your password again:</TextBoxLabel>
            <TextBox type="password"
                value={passwordConfirmation}
                setTextFunc={setPasswordConfirmation}/>

            {
                errors && errors.length > 0
                &&
                <>
                    <Text style={{
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        marginTop: '15px'
                    }}>
                        Please correct the following validation errors:
                    </Text>
                    {
                        errors.map((error, index) => {
                            return <Text key={'register_error_' + index} style={{
                                color: 'red',
                                textAlign: 'left',
                                marginBottom: '8px'
                            }}>
                                {error.text}
                            </Text>
                        })
                    }
                </>
            }

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
