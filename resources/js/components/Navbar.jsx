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
                const notification = e.notification;
                let updatedNotifications = notifications.slice();
                updatedNotifications.unshift({
                    type: notification.type,
                    fromUserId: notification.from_user_id,
                    fromUser: notification.sender,
                    createdAt: notification.created_at
                });

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
                                return <div className={notificationsStyles.notificationItem}>
                                    You have a
                                    new {notification.type} from {notification.fromUser.firstName + ' ' + notification.fromUser.lastName}
                                </div>
                            })
                        }
                    </>
                }
            </Container>
        }
    </>;
};
