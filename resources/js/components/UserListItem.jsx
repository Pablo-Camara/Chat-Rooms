import { useContext } from "react";
import { useNavigate } from "react-router";
import Button from "./Button";
import Container from "./Container";
import Text from "./Text";
import styles from '../../css/modules/components/UserListItem.module.css';
import UserName from "./UserName";
import { ChatRoomContext } from "../contexts/ChatRoomContext";
export default function UserListItem({style, user}) {
    const navigate = useNavigate();

    const {
        setIsPrivateChat,
        setChattingWithUserId
    } = useContext(ChatRoomContext);

    return <>
        <div className={styles.boxItem} style={{...style}}>

            <Text style={{
                textAlign: 'left',
                color: '#1D398F',
                fontSize: '14px'
            }}>
                {user.firstName} {user.lastName}
            </Text>

            <UserName style={{textAlign: 'left'}} user={user} />

            <Container style={{
                marginTop: '16px',
                textAlign: 'right'
            }}>
                <Button
                    onClick={() => {
                        setIsPrivateChat(true);
                        setChattingWithUserId(user.id);
                        navigate('/chat?userId=' + user.id)
                    }}
                    style={{
                        width: '120px',
                        display: 'inline-block',
                        fontSize: '14px'
                    }}>Open chat</Button>

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
