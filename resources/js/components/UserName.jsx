import Text from "./Text";

export default function UserName ({ user, style }) {
    return <>
        <Text style={{
                color: '#1D398F',
                fontSize: '12px',
                fontWeight: 'bold',
                marginTop: '6px',
                ...style
            }}>
            @{user.username}
        </Text>
    </>
};
