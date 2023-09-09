import navbarStyles from '../../css/modules/components/Navbar.module.css';
import notificationsStyles from '../../css/modules/components/Notifications.module.css';
import { AuthContext } from '../contexts/AuthContext';
import Container from './Container';
import { useState, useContext } from "react";
import { useNavigate } from "react-router";

export default function Navbar({ authenticated }) {
    let finalClassName = authenticated ? navbarStyles.authenticatedNavbar : navbarStyles.unauthenticatedNavbar;
    const navigate = useNavigate();

    const { userId } = useContext(AuthContext);

    const [totalNotifications, setTotalNotifications] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    if (userId) {
        window.Echo.private('notifications.' + userId)
            .listen('NotificationSent', (e) => {
                const notificationReceived = e.notification;
                let updatedNotifications = notifications.slice();

                let notificationTypeIndex = null;
                updatedNotifications.forEach((notification, index) => {
                    if (
                        notificationReceived.type === notification.type
                        &&
                        notificationReceived.from_user_id === notification.fromUserId
                    ) {
                        notificationTypeIndex = index;
                        return;
                    }
                });

                if (null === notificationTypeIndex) {
                    updatedNotifications.unshift({
                        count: 1,
                        type: notificationReceived.type,
                        fromUserId: notificationReceived.from_user_id,
                        fromUser: notificationReceived.sender,
                        createdAt: notificationReceived.created_at
                    });
                } else {
                    let newNotification = Object.assign({}, updatedNotifications[notificationTypeIndex]);
                    newNotification.count++;
                    newNotification.createdAt = notificationReceived.created_at;

                    updatedNotifications.splice(notificationTypeIndex, 1);
                    updatedNotifications.unshift(newNotification);
                }

                setNotifications(updatedNotifications);
                setTotalNotifications(totalNotifications+1);
            });
    }

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
                                        navigate('/chat?userId=' + notification.fromUserId);
                                    }}>
                                        {
                                            notification.type === 'chat_message'
                                            &&
                                            <>
                                                <b>{notification.count}</b> new message{notification.count > 1 ? 's' : ''} from
                                                <b> {
                                                    notification.fromUser.firstName
                                                    + ' '
                                                    + notification.fromUser.lastName
                                                    + ' (' + notification.fromUser.username + ')'
                                                }</b>
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
