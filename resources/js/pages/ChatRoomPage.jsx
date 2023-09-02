import Container from "../components/Container";
import LinkButton from "../components/LinkButton";
import { useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router";
import Header from "../components/Header";
import linkBtnStyles from '../../css/modules/components/LinkButton.module.css';
import headerStyles from '../../css/modules/components/Header.module.css';
import txtStyles from '../../css/modules/components/Text.module.css';
import txtBoxStyles from '../../css/modules/components/TextBox.module.css';
import Text from "../components/Text";
import { AuthContext } from "../contexts/AuthContext";
import HorizontalSeparator from "../components/HorizontalSeparator";
import UserName from "../components/UserName";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

const ChatRoomPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId');
    const userId = queryParams.get('userId');

    const isPrivateChat = (userId && !roomId);
    const isChatRoom = (roomId && !userId);

    const navigate = useNavigate();

    const { authToken } = useContext(AuthContext);

    const [ chatTitle, setChatTitle ] = useState('');

    const [ user, setUser ] = useState(null);
    const [ destinationUser, setDestinationUser ] = useState(null);

    const [ currentMessage, setCurrentMessage ] = useState('');

    isPrivateChat && useEffect(() => {
        // fetch friends
        axios({
            method: 'GET',
            url: '/api/chat/' + userId,
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
        })
        .then(response => {
            const responseData = response.data;
            setUser(responseData.user);
            setDestinationUser(responseData.destinationUser);

        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
      }, []);

    return <>
        <Navbar authenticated={true}/>
        <Container>
            <LinkButton className={linkBtnStyles.chatRoomBackBtn}
                onClick={() => navigate('/') }>
                Back to main menu
            </LinkButton>
            <Header type="h1"
                className={headerStyles.chatRoomHeader}>
                    Chat room
            </Header>

            {
                isPrivateChat
                &&
                destinationUser
                &&
                <Text className={txtStyles.chatTitle}>
                    Conversation with&nbsp;
                    <i>
                        {destinationUser.firstName} {destinationUser.lastName}
                    </i>
                    <br/>
                    <UserName user={destinationUser} />
                </Text>
            }

            {
                isChatRoom
                &&
                <Text className={txtStyles.chatTitle}>
                    {chatTitle}
                </Text>
            }

            <HorizontalSeparator style={{
                marginTop: '16px'
            }}/>

            <Text style={{
                color: 'gray',
                padding: '10px 0'
            }}>
                This chat is empty
            </Text>

            <HorizontalSeparator style={{
                marginTop: '26px'
            }}/>

            <Text className={txtStyles.sendMessageTitle}>
                Send a message:
            </Text>
            <TextArea className={txtBoxStyles.sendMessageTextarea}
                defaultValue={currentMessage}
                setTextFunc={setCurrentMessage} />

            <Container style={{
                marginTop: '6px',
                textAlign: 'right'
            }}>
                <Button
                    onClick={() => alert('test')}
                    style={{
                        width: '73px',
                        display: 'inline-block',
                        fontSize: '14px',
                        marginLeft: '14px'
                    }}>Send</Button>
            </Container>
        </Container>
    </>
};

export default ChatRoomPage;
