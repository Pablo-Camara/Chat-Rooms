import styles from '../../css/modules/components/Navbar.module.css';
import Container from './Container';

export default function Navbar({ authenticated }) {
    let finalClassName = authenticated ? styles.authenticatedNavbar : styles.unauthenticatedNavbar;
    return <>
        <div className={finalClassName}>
            {
                !authenticated
                &&
                'Chat rooms'
            }

            {
                authenticated
                &&
                <Container style={{
                    textAlign: 'left'
                }}>
                    Chat rooms

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
