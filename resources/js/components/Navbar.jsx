import styles from '../../css/modules/components/Navbar.module.css';
import Container from './Container';
import { useNavigate } from "react-router";

export default function Navbar({ authenticated }) {
    let finalClassName = authenticated ? styles.authenticatedNavbar : styles.unauthenticatedNavbar;
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
        <Container style={{
            background: '#123c58',
            paddingBottom: '4px'
        }}>
            <div style={{
                fontSize: '12px',
                padding: '12px',
                textAlign: 'right',
                color: 'white'
            }}>Notifications <span style={{
                color: 'red',
                marginLeft: '6px',
                fontSize: '14px'
            }}>X</span></div>

            <div style={{
                width: '280px',
                margin: 'auto',
                background: 'white',
                fontSize: '12px',
                padding: '8px',
                textAlign: 'right',
                marginBottom: '12px'
            }}>
                You have 2 new messages from <b>@johndoe</b>
            </div>

            <div style={{
                width: '280px',
                margin: 'auto',
                background: 'white',
                fontSize: '12px',
                padding: '8px',
                textAlign: 'right',
                marginBottom: '12px'
            }}>
                New friend request from <b>@johndoe</b>
            </div>
        </Container>
    </>;
};
