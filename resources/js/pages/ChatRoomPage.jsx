import Container from "../components/Container";
import { useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router";
import Header from "../components/Header";
import headerStyles from '../../css/modules/components/Header.module.css';
import txtStyles from '../../css/modules/components/Text.module.css';
import txtBoxStyles from '../../css/modules/components/TextBox.module.css';
import containerStyles from '../../css/modules/components/Container.module.css';
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
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ isLoadingChat, setIsLoadingChat ] = useState(true);

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
            setChatMessages(responseData.chatRoom.messages);
            setIsLoadingChat(false);
        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
      }, []);

    return <>
        <Navbar authenticated={true}/>
        <Container>
            <Header type="h1"
                className={headerStyles.chatRoomHeader}>
                    Chat room
            </Header>

            {
                !isLoadingChat
                &&
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
                !isLoadingChat
                &&
                isChatRoom
                &&
                <Text className={txtStyles.chatTitle}>
                    {chatTitle}
                </Text>
            }

            <HorizontalSeparator style={{
                marginTop: '16px',
                marginBottom: '10px'
            }}/>

            {
                isLoadingChat
                &&
                <Text style={{
                    color: 'gray'
                }}>
                    Loading chat..
                </Text>
            }

            {
                !isLoadingChat
                &&
                chatMessages.length == 0
                &&
                <Text style={{
                    color: 'gray'
                }}>
                    This chat is empty
                </Text>
            }

            {
                !isLoadingChat
                &&
                chatMessages.length > 0
                &&
                <>
                    {
                        chatMessages.map((chatMessage, index) => {
                            const createdAtDate = (new Date(chatMessage.dateSent)).toLocaleString();
                            return <Container className={containerStyles.msgContainer}
                                style={{
                                    marginRight: chatMessage.sender.id === user.id ? '0px' : 'auto',
                                    marginLeft: chatMessage.sender.id !== user.id ? '0px' : 'auto',
                                }}
                            >
                                <div style={{
                                    textAlign: 'left'
                                }}>
                                    <UserName user={
                                        {
                                            username: chatMessage.sender.username
                                        }
                                    }
                                        style={{
                                            display: 'inline-block',
                                            color: chatMessage.sender.id === user.id ? 'rgb(0 136 255)' : 'rgb(29, 57, 143)'
                                        }}/> says:

                                    <div style={{
                                        float: 'right',
                                        marginTop: '6px'
                                    }}>
                                        <div style={{
                                            background: '#D8D8D8',
                                            border: '1px solid #979797',
                                            height: '8px',
                                            width: '8px',
                                            display: 'inline-block',
                                            marginRight: '2px'
                                        }}></div>
                                        <div style={{
                                            background: '#D8D8D8',
                                            border: '1px solid #979797',
                                            height: '8px',
                                            width: '8px',
                                            display: 'inline-block',
                                            marginRight: '2px'
                                        }}></div>
                                        <div style={{
                                            background: '#D8D8D8',
                                            border: '1px solid #979797',
                                            height: '8px',
                                            width: '8px',
                                            display: 'inline-block'
                                        }}></div>
                                    </div>
                                </div>
                                <Text className={containerStyles.msgTextContainer}>
                                    {chatMessage.message}
                                </Text>
                                <Text className={containerStyles.msgDateSentContainer}>
                                    {createdAtDate}
                                </Text>
                            </Container>
                        })
                    }
                </>
            }

            <HorizontalSeparator style={{
                marginTop: '26px'
            }}/>

            {
                !isLoadingChat
                &&
                <>
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
                </>

            }


        </Container>
    </>
};

export default ChatRoomPage;
