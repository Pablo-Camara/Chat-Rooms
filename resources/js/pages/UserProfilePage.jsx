import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import { ProfilePageContext } from "../contexts/ProfilePageContext";
import Text from "../components/Text";
import UserName from "../components/UserName";
import Button from "../components/Button";

const UserProfilePage = () => {

    const { currentProfileUserId } = useContext(ProfilePageContext);

    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        axios({
            method: 'GET',
            url: '/api/user/' + currentProfileUserId
        }).then(response => {
            const responseData = response.data;
            setUserProfile(responseData.userProfile);

        }).catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    }, [currentProfileUserId])

    return <>
        <Navbar authenticated={true}/>
        {
            null === userProfile
            &&
            <Container>
                <Header type="h1">Loading user profile...</Header>
            </Container>
        }

        {
            null !== userProfile
            &&
            <Container>
                <Header type="h1"
                    style={{
                        marginBottom: '0px'
                    }}>{userProfile.firstName + ' ' + userProfile.lastName}</Header>

                <UserName user={userProfile}/>

                <Text style={{
                    color: 'gray',
                    fontSize: '12px',
                    marginTop: '4px'
                }}>Joined {userProfile.joinedSince}</Text>

                <Button style={{
                        fontSize: '14px',
                        marginTop: '14px'
                    }}>Add friend</Button>
            </Container>
        }

    </>;
};

export default UserProfilePage;
