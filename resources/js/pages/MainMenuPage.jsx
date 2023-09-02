import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Container from "../components/Container";
import Header from "../components/Header";
import LinkButton from "../components/LinkButton";
import Button from "../components/Button";
import MyFriends from "../components/MyFriends";

const MainMenuPage = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
        navigate('/login');
        return;
    }
  }, [isLoggedIn]);

  const logoutAttempt = () => {
    logout(() => {
        navigate('/login');
    })
  };


  return <>
    <Container>
        <Header type="h1">Main Menu</Header>
        <Container style={{
            marginTop: '20px'
        }}>
            <LinkButton
                style={{
                    float: 'left'
                }}
            >
                My Account / Profile
            </LinkButton>
            <LinkButton
                style={{
                    float: 'right',
                    color: '#FF0000'
                }}
                onClick={() => logoutAttempt()}
                >
                    Logout
            </LinkButton>

            <div style={{
                clear: 'both'
            }}></div>
        </Container>

        <Button
            onClick={() => alert('test')}
            style={{
                marginTop: '13px'
            }}>Find chat rooms</Button>

        <Button
            onClick={() => alert('test')}
            style={{
                marginTop: '13px'
            }}>Find other users</Button>



        <MyFriends />
    </Container>
  </>;
};

export default MainMenuPage;
