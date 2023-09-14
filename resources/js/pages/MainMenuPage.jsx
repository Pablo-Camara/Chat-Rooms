import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Container from "../components/Container";
import LinkButton from "../components/LinkButton";
import Button from "../components/Button";
import MyFriends from "../components/MyFriends";
import linkBtnStyles from '../../css/modules/components/LinkButton.module.css';
import Navbar from "../components/Navbar";
import { ProfilePageContext } from "../contexts/ProfilePageContext";


const MainMenuPage = () => {
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { setCurrentProfileUserId } = useContext(ProfilePageContext);

  const logoutAttempt = () => {
    logout(() => {
        navigate('/login');
    })
  };

  const findOtherUsers = () => {
    navigate('/find-users');
  };


  return <>
    <Navbar authenticated={true}/>
    <Container>
        <Container style={{
            marginTop: '20px'
        }}>
            <LinkButton
                className={`${linkBtnStyles.linkButton} ${linkBtnStyles.myAccountLink}`}
                onClick={() => {
                    setCurrentProfileUserId(userId);
                    navigate('/user?userId=' + userId);
                }}
            >
                My Account / Profile
            </LinkButton>
            <LinkButton
                className={`${linkBtnStyles.linkButton} ${linkBtnStyles.logoutLink}`}
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
            onClick={() => findOtherUsers() }
            style={{
                marginTop: '13px'
            }}>Find other users</Button>

        <MyFriends />

    </Container>
  </>;
};

export default MainMenuPage;
