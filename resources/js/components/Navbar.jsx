import navbarStyles from '../../css/modules/components/Navbar.module.css';
import notificationsStyles from '../../css/modules/components/Notifications.module.css';
import { AuthContext } from '../contexts/AuthContext';
import Container from './Container';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChatRoomContext } from '../contexts/ChatRoomContext';
import { ProfilePageContext } from '../contexts/ProfilePageContext';
import Button from "./Button";

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
        if (userId) {
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
        }
    }, [userId]);

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
                        id: notificationReceived.id,
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
                    if (updatedNotifications.length == 0) {
                        setShowNotifications(false);
                    }
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
                if (updatedNotifications.length == 0) {
                    setShowNotifications(false);
                }
            };

            const friendshipRequestAcceptedCallback = (e) => {
                const friendship = e.friendship;
                let updatedNotifications = notifications.slice();
                let indexToRemove = null;
                updatedNotifications.forEach((notification, index) => {
                    if (
                        notification.type === 'friend_request'
                        &&
                        notification.from_user_id === friendship.requester.id
                    ) {
                        indexToRemove = index;
                        return;
                    }
                });

                if (null !== indexToRemove) {
                    updatedNotifications.splice(indexToRemove, 1);
                    setNotifications(updatedNotifications);
                    setTotalNotifications(updatedNotifications.length);
                    if (updatedNotifications.length == 0) {
                        setShowNotifications(false);
                    }
                }
            };

            const friendshipRequestCanceledCallback = (e) => {
                const requesterId = e.requester_id;
                let updatedNotifications = notifications.slice();
                let indexToRemove = null;
                updatedNotifications.forEach((notification, index) => {
                    if (
                        notification.type === 'friend_request'
                        &&
                        notification.from_user_id === requesterId
                    ) {
                        indexToRemove = index;
                        return;
                    }
                });

                if (null !== indexToRemove) {
                    updatedNotifications.splice(indexToRemove, 1);
                    setNotifications(updatedNotifications);
                    setTotalNotifications(updatedNotifications.length);
                    if (updatedNotifications.length == 0) {
                        setShowNotifications(false);
                    }
                }
            };

            const notificationDeletedCallback = (e) => {
                const notificationId = e.notification.id;
                let updatedNotifications = notifications.slice();
                let indexToRemove = null;
                updatedNotifications.forEach((notification, index) => {
                    if (notification.id === notificationId) {
                        indexToRemove = index;
                        return;
                    }
                });

                if (null != indexToRemove) {
                    updatedNotifications.splice(indexToRemove, 1);
                    setNotifications(updatedNotifications);
                    setTotalNotifications(updatedNotifications.length);
                    if (updatedNotifications.length == 0) {
                        setShowNotifications(false);
                    }
                }
            };

            channel.listen('NotificationSent', notificationSentCallback);
            channel.listen('NotificationDeleted', notificationDeletedCallback);
            channel.listen('ChatMessageViewed', chatMessageViewedCallback);
            channel.listen('FriendshipRequestAccepted', friendshipRequestAcceptedCallback);
            channel.listen('FriendshipRequestCanceled', friendshipRequestCanceledCallback);

            return () => {
                channel.stopListening('NotificationDeleted', notificationDeletedCallback);
                channel.stopListening('NotificationSent', notificationSentCallback);
                channel.stopListening('ChatMessageViewed', chatMessageViewedCallback);
                channel.stopListening('FriendshipRequestAccepted', friendshipRequestAcceptedCallback);
                channel.stopListening('FriendshipRequestCanceled', friendshipRequestCanceledCallback);
            };
        }
    }, [userId, notifications]);

    const deleteNotification = (notificationId) => {
        axios({
            method: 'GET',
            url: '/api/notifications/delete/' + notificationId
        })
        .then(response => {
            // nothingness
        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    };

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
                                            setShowNotifications(false);
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

                                        {
                                            notification.type === 'friend_request_accepted'
                                            &&
                                            <>
                                                You and <b> {
                                                    notification.sender.firstName
                                                    + ' '
                                                    + notification.sender.lastName
                                                    + ' (' + notification.sender.username + ')'
                                                }</b> are now friends
                                                <div style={{
                                                    textAlign: 'center'
                                                }}>
                                                    <Button
                                                        onClick={() => {
                                                            deleteNotification(notification.id);
                                                        }}
                                                        style={{
                                                            display: 'inline-block',
                                                            fontSize: '12px',
                                                            padding: '0px 14px',
                                                            marginTop: '14px'
                                                        }}>
                                                            Ok
                                                    </Button>
                                                </div>
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
