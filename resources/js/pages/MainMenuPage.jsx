import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Container from "../components/Container";
import Header from "../components/Header";
import LinkButton from "../components/LinkButton";
import Button from "../components/Button";
import Text from "../components/Text";
import UserListItem from "../components/UserListItem";

const MainMenuPage = () => {
  const { isLoggedIn, authToken, logout } = useContext(AuthContext);
  const [ friends, setFriends ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
        navigate('/login');
        return;
    }
    alert(authToken);
    // will use authToken to request friends list

  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <></>;
  }

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

        <Header type="h2"
            style={{
                fontSize: '24px',
                color: '#1B1F50'
            }}>My friends ({friends.length})</Header>

        {
            friends.length == 0
            &&
            <Text style={{
                marginTop: '13px'
            }}>
                You haven’t added any friends yet
            </Text>
        }

        {
            friends.length > 0
            &&
            <>
                {
                    friends.map((user, index) => (
                        <UserListItem user={user}
                            style={{
                                marginTop: '18px'
                            }}/>
                    ))
                }
            </>
        }

    </Container>
  </>;
};

export default MainMenuPage;
