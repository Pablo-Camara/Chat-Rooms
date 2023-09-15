import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import { ProfilePageContext } from "../contexts/ProfilePageContext";
import Text from "../components/Text";
import UserName from "../components/UserName";
import Button from "../components/Button";
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";

const UserProfilePage = () => {

    const { currentProfileUserId, setCurrentProfileUserId } = useContext(ProfilePageContext);

    const [userProfile, setUserProfile] = useState(null);

    // invalid || null || requested || received_request || friends
    const [friendshipStatus, setFriendshipStatus] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const profileUserId = queryParams.get('userId');

    const { userId } = useContext(AuthContext);

    useEffect(() => {
        if (currentProfileUserId) {
            axios({
                method: 'GET',
                url: '/api/user/' + currentProfileUserId
            }).then(response => {
                const responseData = response.data;
                setUserProfile(responseData.userProfile);
                setFriendshipStatus(responseData.friendshipStatus);
            }).catch(error => {
                // Handle any errors that occur during the request.
                console.error('Error:', error);
            });
        }

        if (
            null == currentProfileUserId
            &&
            profileUserId
        ) {
            setCurrentProfileUserId(profileUserId);
        }
    }, [currentProfileUserId])

    const addAsFriend = (userId) => {
        axios({
            method: 'GET',
            url: '/api/add-friend/' + userId
        }).then(response => {
            //const responseData = response.data;
            //setUserProfile(responseData.userProfile);

        }).catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    };

    const cancelAddAsFriend = (userId) => {

    };

    const acceptAsFriend = (userId) => {
        axios({
            method: 'GET',
            url: '/api/accept-friend/' + userId
        }).then(response => {
            // set friendshipStatus = friends
        }).catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
    };


    useEffect(() => {
        if (userId) {
            let channel = window.Echo.private('notifications.' + userId);

            const friendshipRequestAcceptedCallback = (e) => {
                setFriendshipStatus('friends');
            };

            channel.listen('FriendshipRequestAccepted', friendshipRequestAcceptedCallback);

            return () => {
                channel.stopListening('FriendshipRequestAccepted', friendshipRequestAcceptedCallback);
            };
        }
    }, [userId]);

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
