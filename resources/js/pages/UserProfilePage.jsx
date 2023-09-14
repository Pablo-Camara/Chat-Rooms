import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import { ProfilePageContext } from "../contexts/ProfilePageContext";
import Text from "../components/Text";
import UserName from "../components/UserName";
import Button from "../components/Button";
import { useLocation } from 'react-router-dom';

const UserProfilePage = () => {

    const { currentProfileUserId, setCurrentProfileUserId } = useContext(ProfilePageContext);

    const [userProfile, setUserProfile] = useState(null);
    const [friendshipStatus, setFriendshipStatus] = useState('received_request');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    if (
        null == currentProfileUserId
        &&
        userId
    ) {
        setCurrentProfileUserId(userId);
    }

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

    const addAsFriend = (userId) => {
        axios({
            method: 'GET',
            url: '/api/add-friend/' + userId
        }).then(response => {
            const responseData = response.data;
            setUserProfile(responseData.userProfile);

        }).catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    };

    const cancelAddAsFriend = (userId) => {

    };

    const acceptAsFriend = (userId) => {

    };

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

                {
                    friendshipStatus === null
                    &&
                    <Button onClick={() => {
                        addAsFriend(userProfile.id);
                    }} style={{
                            fontSize: '14px',
                            marginTop: '14px'
                        }}>+ Add friend</Button>
                }

                {
                    friendshipStatus === 'requested'
                    &&
                    <Button onClick={() => {
                        cancelAddAsFriend(userProfile.id);
                    }} style={{
                            fontSize: '14px',
                            marginTop: '14px',
                            background: '#500101'
                        }}>- Cancel friendship request</Button>
                }

                {
                    friendshipStatus === 'received_request'
                    &&
                    <Button onClick={() => {
                        acceptAsFriend(userProfile.id);
                    }} style={{
                            fontSize: '14px',
                            marginTop: '14px',
                            background: 'rgb(17 80 1)'
                        }}>+ Accept friendship request</Button>
                }

            </Container>
        }

    </>;
};

export default UserProfilePage;
