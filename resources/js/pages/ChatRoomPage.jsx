import Container from "../components/Container";
import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import Header from "../components/Header";
import headerStyles from '../../css/modules/components/Header.module.css';
import txtStyles from '../../css/modules/components/Text.module.css';
import txtBoxStyles from '../../css/modules/components/TextBox.module.css';
import containerStyles from '../../css/modules/components/Container.module.css';
import Text from "../components/Text";
import HorizontalSeparator from "../components/HorizontalSeparator";
import UserName from "../components/UserName";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { ChatRoomContext } from "../contexts/ChatRoomContext";

const ChatRoomPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    const {
        isPrivateChat, setIsPrivateChat,
        chattingWithUserId, setChattingWithUserId
    } = useContext(ChatRoomContext);

    const [ user, setUser ] = useState(null);
    const [ destinationUser, setDestinationUser ] = useState(null);

    const [ chatRoomId, setChatRoomId ] = useState(null);
    const [ chatRoomTitle, setChatRoomTitle ] = useState('');
    const [ currentMessage, setCurrentMessage ] = useState('');
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ isLoadingChat, setIsLoadingChat ] = useState(true);

    const fetchPrivateChatInfo = (userId) => {
        // fetch chat information
        setIsLoadingChat(true);
        axios({
            method: 'GET',
            url: '/api/chat/' + userId
        })
        .then(response => {
            const responseData = response.data;
            setUser(responseData.user);
            setDestinationUser(responseData.destinationUser);
            setChatRoomId(responseData.chatRoom.id);
            setChatRoomTitle(responseData.chatRoom.title);
            setChatMessages(responseData.chatRoom.messages);
            setIsLoadingChat(false);
            setIsPrivateChat(true);
            setChattingWithUserId(responseData.destinationUser.id);
        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    };

    // opening/fetching chat data when:
    // - no longer private chattting
    // - destination user changes
    useEffect(
        () => {
            if (
                isPrivateChat && chattingWithUserId
                &&
                (
                    (
                        destinationUser
                        &&
                        chattingWithUserId !== destinationUser.id
                    )
                    ||
                    !destinationUser
                )
            ) {
                fetchPrivateChatInfo(chattingWithUserId);
            }
        },
        [isPrivateChat, chattingWithUserId]
    );

    // opening private chat with user by url:
    useEffect(() => {
        if (userId && (userId != chattingWithUserId)) {
            fetchPrivateChatInfo(userId);
        }
    }, []);

    useEffect(() => {
        if (chatRoomId) {
            let channel = window.Echo.private('chatRoom.' + chatRoomId);

            const chatMessageSentCallback = (e) => {
                console.log('ChatMessageSent', e);
                let chatRoomMsg = e.chatRoomMessage;
                let updatedChatMessages = chatMessages.slice();
                updatedChatMessages.push({
                    messageId: chatRoomMsg.id,
                    message: chatRoomMsg.message,
                    dateSent: chatRoomMsg.created_at,
                    sender: {
                        id: chatRoomMsg.sender.id,
                        username: chatRoomMsg.sender.username,
                    },
                    receiver: {
                        id: chatRoomMsg.receiver.id,
                        username: chatRoomMsg.receiver.username,
                    }
                });

                setChatMessages(updatedChatMessages);
            };

            channel.listen('ChatMessageSent', chatMessageSentCallback);
            return () => {
                channel.stopListening('ChatMessageSent', chatMessageSentCallback);
            };
        }
    }, [chatRoomId]);

    const sendChatMessage = (message) => {
        axios({
            method: 'POST',
            url: '/api/chat/' + chattingWithUserId + '/msg',
            data: {
                message
            }
        })
        .then(response => {
            const responseData = response.data;
            setUser(responseData.user);
            setDestinationUser(responseData.destinationUser);
            setChatRoomId(responseData.chatRoom.id);
            setChatRoomTitle(responseData.chatRoom.title);
            setChatMessages(responseData.chatRoom.messages);
            setCurrentMessage('');
        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    };

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
                !isPrivateChat
                &&
                <Text className={txtStyles.chatTitle}>
                    {chatRoomTitle}
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
                        value={currentMessage}
                        setTextFunc={setCurrentMessage} />

                    <Container style={{
                        marginTop: '6px',
                        textAlign: 'right'
                    }}>
                        <Button
                            onClick={() => sendChatMessage(currentMessage)}
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
