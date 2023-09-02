import Container from "../components/Container";
import LinkButton from "../components/LinkButton";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router";
import Header from "../components/Header";
import linkBtnStyles from '../../css/modules/components/LinkButton.module.css';
import headerStyles from '../../css/modules/components/Header.module.css';

const ChatRoomPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId');
    const userId = queryParams.get('userId');
    // will later use both these vars
    console.log('room id: ' + roomId);
    console.log('user id: ' + userId);

    const navigate = useNavigate();
    return <>
        <Container>
            <LinkButton className={linkBtnStyles.chatRoomBackBtn}
                onClick={() => navigate('/') }>
                Back to main menu
            </LinkButton>
            <Header type="h1"
                className={headerStyles.chatRoomHeader}>
                    Chat room
            </Header>
        </Container>
    </>
};

export default ChatRoomPage;
