import Button from "./Button";
import Container from "./Container";
import Text from "./Text";
import styles from '../../css/modules/components/UserListItem.module.css';
export default function UserListItem({style, user}) {
    return <>
        <div className={styles.boxItem} style={{...style}}>
            <Text style={{
                textAlign: 'left',
                color: '#1D398F',
                fontSize: '14px'
            }}>
                {user.firstName} {user.lastName}
            </Text>

            <Text style={{
                textAlign: 'left',
                color: '#1D398F',
                fontSize: '12px',
                fontWeight: 'bold',
                marginTop: '6px'
            }}>
                @{user.username}
            </Text>

            <Container style={{
                marginTop: '16px',
                textAlign: 'right'
            }}>
                <Button
                    onClick={() => alert('test')}
                    style={{
                        width: '120px',
                        display: 'inline-block',
                        fontSize: '14px'
                    }}>Send message</Button>

                <Button
                    onClick={() => alert('test')}
                    style={{
                        width: '94px',
                        display: 'inline-block',
                        fontSize: '14px',
                        marginLeft: '14px'
                    }}>View profile</Button>
            </Container>
        </div>
    </>;
}
