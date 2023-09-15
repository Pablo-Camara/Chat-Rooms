import navbarStyles from '../../css/modules/components/Navbar.module.css';
import notificationsStyles from '../../css/modules/components/Notifications.module.css';
import { AuthContext } from '../contexts/AuthContext';
import Container from './Container';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChatRoomContext } from '../contexts/ChatRoomContext';
import { ProfilePageContext } from '../contexts/ProfilePageContext';

export default function Navbar({ authenticated }) {
    let finalClassName = authenticated ? navbarStyles.authenticatedNavbar : navbarStyles.unauthenticatedNavbar;
    const navigate = useNavigate();

    const { userId } = useContext(AuthContext);
    const {
        setIsPrivateChat,
        setChattingWithUserId
    } = useContext(ChatRoomContext);

    const { setCurrentProfileUserId } = useContext(ProfilePageContext);

    const [totalNotifications, setTotalNotifications] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // fetch notifications
        axios({
            method: 'GET',
            url: '/api/notifications'
        })
        .then(response => {
            const responseData = response.data;
            setNotifications(responseData);
            setTotalNotifications(responseData.length);
        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    }, []);

    useEffect(() => {
        if (userId) {
            let channel = window.Echo.private('notifications.' + userId);

            const notificationSentCallback = (e) => {
                const notificationReceived = e.notification;
                let updatedNotifications = notifications.slice();

                let notificationTypeIndex = null;
                updatedNotifications.forEach((notification, index) => {
                    if (
                        notificationReceived.type === notification.type
                        &&
                        notificationReceived.from_user_id === notification.from_user_id
                    ) {
                        notificationTypeIndex = index;
                        return;
                    }
                });

                if (null === notificationTypeIndex) {
                    updatedNotifications.unshift({
                        count: 1,
                        type: notificationReceived.type,
                        from_user_id: notificationReceived.from_user_id,
                        sender: notificationReceived.sender,
                        created_at: notificationReceived.created_at
                    });
                } else {
                    let newNotification = Object.assign({}, updatedNotifications[notificationTypeIndex]);
                    newNotification.count++;
                    newNotification.created_at = notificationReceived.created_at;

                    updatedNotifications.splice(notificationTypeIndex, 1);
                    updatedNotifications.unshift(newNotification);
                }

                setNotifications(updatedNotifications);

                if (null === notificationTypeIndex) {
                    setTotalNotifications(totalNotifications+1);
                } else {
                    setTotalNotifications(updatedNotifications.length);
                }
            };

            const chatMessageViewedCallback = (e) => {
                const chatMsgReceived = e.chatRoomMessage;
                let updatedNotifications = notifications.slice();

                if (updatedNotifications.length > 0) {
                    let indexToDecrement = null;
                    updatedNotifications.forEach((notification, index) => {
                        if (
                            notification.type === 'chat_message'
                            &&
                            notification.from_user_id === chatMsgReceived.sender_id
                        ) {
                            indexToDecrement = index;
                            return;
                        }
                    });

                    if (indexToDecrement >= 0) {
                        if (
                            updatedNotifications[indexToDecrement].count <= 1
                        ) {
                            updatedNotifications.splice(indexToDecrement, 1);
                        } else {
                            updatedNotifications[indexToDecrement].count--;
                        }
                    }

                }

                setNotifications(updatedNotifications);
                setTotalNotifications(updatedNotifications.length);
            };

            channel.listen('NotificationSent', notificationSentCallback);
            channel.listen('ChatMessageViewed', chatMessageViewedCallback);

            return () => {
                channel.stopListening('NotificationSent', notificationSentCallback);
                channel.stopListening('ChatMessageViewed', chatMessageViewedCallback);
            };
        }
    }, [userId, notifications]);

    return <>
        <div className={finalClassName}>
            {
                !authenticated
                &&
                <span onClick={() => navigate('/')}
                    style={{
                        cursor: 'pointer'
                }}>Chat rooms</span>
            }

            {
                authenticated
                &&
                <Container style={{
                    textAlign: 'left'
                }}>
                    <span onClick={() => navigate('/')}
                        style={{
                            cursor: 'pointer'
                        }}>Chat rooms</span>

                    {
                        totalNotifications > 0
                        &&
                        <div style={{
                            float: 'right',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                            }}>
                            {totalNotifications} new Notifications
                        </div>
                    }
                </Container>
            }
        </div>

        {
            showNotifications
            &&
            <Container className={notificationsStyles.notificationsContainer}>
                <div className={notificationsStyles.notificationsHeader}>
                    Notifications <span onClick={() => {
                        setShowNotifications(false);
                    }}>X</span></div>

                {
                    notifications.length > 0
                    &&
                    <>
                        {
                            notifications.map((notification, index) => {
                                return <div key={'notification_' + index}
                                    className={notificationsStyles.notificationItem}
                                    onClick={() => {
                                        if (notification.type === 'chat_message') {
                                            setIsPrivateChat(true);
                                            setChattingWithUserId(notification.from_user_id);
                                            setShowNotifications(false);
                                            navigate('/chat?userId=' + notification.from_user_id);
                                        }

                                        if (notification.type === 'friend_request') {
                                            setCurrentProfileUserId(notification.from_user_id);
                                            navigate('/user?userId=' + notification.from_user_id)
                                        }
                                    }}>
                                        {
                                            notification.type === 'chat_message'
                                            &&
                                            <>
                                                <b>{notification.count}</b> new message{notification.count > 1 ? 's' : ''} from
                                                <b> {
                                                    notification.sender.firstName
                                                    + ' '
                                                    + notification.sender.lastName
                                                    + ' (' + notification.sender.username + ')'
                                                }</b>
                                            </>
                                        }

                                        {
                                            notification.type === 'friend_request'
                                            &&
                                            <>
                                                <b> {
                                                    notification.sender.firstName
                                                    + ' '
                                                    + notification.sender.lastName
                                                    + ' (' + notification.sender.username + ')'
                                                }</b> as sent you a friend request
                                            </>
                                        }
                                </div>
                            })
                        }
                    </>
                }
            </Container>
        }
    </>;
};
