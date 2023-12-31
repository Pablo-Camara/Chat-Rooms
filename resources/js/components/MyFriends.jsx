import { useState, useEffect } from "react";
import UserListItem from "./UserListItem";
import Header from "./Header";
import Text from "./Text";

export default function MyFriends () {
    const [ isLoadingFriends, setIsLoadingFriends ] = useState(true);
    const [ friends, setFriends ] = useState([]);

    useEffect(() => {
        // fetch friends
        axios({
            method: 'GET',
            url: '/api/friends'
        })
        .then(response => {
            const responseData = response.data;
            const result = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    const friendship = responseData[key];
                    const isRequester = friendship.requestor_id == friendship.requester.id;
                    const isUser = friendship.requestor_id == friendship.user.id;

                    if (!isRequester) {
                        result.push(friendship.requester);
                    }

                    if (!isUser) {
                        result.push(friendship.user);
                    }
                }
            }
            setFriends(result);
            setIsLoadingFriends(false);

        })
        .catch(error => {
            // Handle any errors that occur during the request.
            console.error('Error:', error);
        });
      }, []);

    return <>
        <Header type="h2"
            style={{
                fontSize: '24px',
                color: '#1B1F50'
            }}>My friends ({isLoadingFriends ? '...' : friends.length})</Header>

        {
            isLoadingFriends
            &&
            <Text style={{
                marginTop: '13px'
            }}>
                Loading friends..
            </Text>
        }

        {
            !isLoadingFriends
            &&
            friends.length == 0
            &&
            <Text style={{
                marginTop: '13px'
            }}>
                You haven’t added any friends yet
            </Text>
        }

        {
            friends.length > 0
            &&
            friends.map((user, index) => (
                <UserListItem key={'user_list_item_' + index} user={user}
                    style={{
                        marginTop: '18px'
                    }}/>
            ))
        }
    </>
};
