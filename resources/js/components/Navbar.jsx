import navbarStyles from '../../css/modules/components/Navbar.module.css';
import notificationsStyles from '../../css/modules/components/Notifications.module.css';
import Container from './Container';
import { useNavigate } from "react-router";

export default function Navbar({ authenticated }) {
    let finalClassName = authenticated ? navbarStyles.authenticatedNavbar : navbarStyles.unauthenticatedNavbar;
    const navigate = useNavigate();
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

                    <div style={{
                        float: 'right',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}>
                        1 new Notification
                    </div>
                </Container>
            }
        </div>
        <Container className={notificationsStyles.notificationsContainer}>
            <div className={notificationsStyles.notificationsHeader}>
                Notifications <span>X</span></div>

            <div className={notificationsStyles.notificationItem}>
                You have 2 new messages from <b>@johndoe</b>
            </div>

            <div className={notificationsStyles.notificationItem}>
                New friend request from <b>@johndoe</b>
            </div>
        </Container>
    </>;
};
