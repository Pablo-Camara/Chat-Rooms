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
            setCurrentProfileUserId(parseInt(profileUserId));
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
        axios({
            method: 'GET',
            url: '/api/cancel-add-friend/' + userId
        }).then(response => {
            // set friendshipStatus = friends
        }).catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
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
        if (userId && currentProfileUserId) {
            let channel = window.Echo.private('notifications.' + userId);

            const friendshipRequestSentCallback = (e) => {
                const friendship = e.friendship;
                if (
                    friendship.user.id === currentProfileUserId
                    &&
                    friendship.requester.id === userId
                ) {
                    setFriendshipStatus('requested');
                }

                if (
                    friendship.user.id === userId
                    &&
                    friendship.requester.id === currentProfileUserId
                ) {
                    setFriendshipStatus('received_request');
                }
            };

            const friendshipRequestAcceptedCallback = (e) => {
                const friendship = e.friendship;
                if (
                    (
                        friendship.user.id === currentProfileUserId
                        &&
                        friendship.requester.id === userId
                    )
                    ||
                    (
                        friendship.user.id === userId
                        &&
                        friendship.requester.id === currentProfileUserId
                    )
                ) {
                    setFriendshipStatus('friends');
                }
            };

            const friendshipRequestCancelledCallback = (e) => {
                if (
                    (
                        e.requester_id === userId
                        &&
                        e.user_id === currentProfileUserId
                    )
                    ||
                    (
                        e.requester_id === currentProfileUserId
                        &&
                        e.user_id === userId
                    )
                ) {
                    setFriendshipStatus(null);
                }
            };

            channel.listen('FriendshipRequestSent', friendshipRequestSentCallback);
            channel.listen('FriendshipRequestAccepted', friendshipRequestAcceptedCallback);
            channel.listen('FriendshipRequestCanceled', friendshipRequestCancelledCallback);


            return () => {
                channel.stopListening('FriendshipRequestSent', friendshipRequestSentCallback);
                channel.stopListening('FriendshipRequestAccepted', friendshipRequestAcceptedCallback);
                channel.stopListening('FriendshipRequestCanceled', friendshipRequestCancelledCallback);
            };
        }
    }, [userId, currentProfileUserId]);

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
