import Button from "./Button";
import Container from "./Container";
import Text from "./Text";

export default function UserListItem({style, user}) {
    return <>
        <style>
        {`
          /* Scoped styles */
          .box-item {
            background: #FFFFFF;
            border: 1px solid #979797;
            padding: 14px;
          }
        `}
        </style>
        <div className="box-item" style={{...style}}>
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
