import navbarStyles from '../../css/modules/components/Navbar.module.css';
import notificationsStyles from '../../css/modules/components/Notifications.module.css';
import Container from './Container';
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Navbar({ authenticated }) {
    let finalClassName = authenticated ? navbarStyles.authenticatedNavbar : navbarStyles.unauthenticatedNavbar;
    const navigate = useNavigate();

    const [totalNotifications, setTotalNotifications] = useState(2);
    const [showNotifications, setShowNotifications] = useState(false);
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

                <div className={notificationsStyles.notificationItem}>
                    You have <b>2</b> new messages from <b>@johndoe</b>
                </div>

                <div className={notificationsStyles.notificationItem}>
                    New friend request from <b>@johndoe</b>
                </div>
            </Container>
        }
    </>;
};
