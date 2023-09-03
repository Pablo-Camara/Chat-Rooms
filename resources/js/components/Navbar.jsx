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
                        float: 'right'
                    }}>
                        ✉️
                    </div>
                </Container>
            }
        </div>
    </>;
};
