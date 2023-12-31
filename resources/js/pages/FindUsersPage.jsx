import { useState, useEffect } from "react";
import Header from "../components/Header";
import Container from "../components/Container";
import TextBox from "../components/TextBox";
import Text from "../components/Text";
import Navbar from "../components/Navbar";
import UserListItem from "../components/UserListItem";

const FindUsersPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearchError, setHasSearchError] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // search effect to find users on search change
    useEffect(() => {
        let searchTimerId;

        if (searchInput) {
            setIsLoading(true);
        }

        const fetchData = () => {
            setIsLoading(true);
            axios({
                method: 'POST',
                url: '/api/find-users',
                data: {
                    searchInput
                }
            })
            .then(response => {
                const responseData = response.data;
                setHasSearchError(false);
                setIsLoading(false);
                setSearchResults(responseData);
            })
            .catch(error => {
                // Handle any errors that occur during the request.
                console.error('Error:', error);
                setHasSearchError(true);
                setIsLoading(false);
            });
        }

         // Debounce the search input by waiting for 1.5 seconds before making the request
        searchTimerId = setTimeout(() => {
            if (searchInput) {
                fetchData();
            }
        }, 1500);

        return () => {
            setHasSearchError(false);
            clearTimeout(searchTimerId);
        }
    }, [searchInput]);

    return <>
        <Navbar authenticated={true}/>
        <Container>
            <Header type="h1">Find other users</Header>


            <TextBox value={searchInput} setTextFunc={setSearchInput}/>
            {
                !searchInput
                &&
                <Text style={{color: 'gray'}}>Use the box above to start searching..</Text>
            }
            {
                searchInput
                &&
                isLoading
                &&
                !hasSearchError
                &&
                <Text style={{color: 'blue'}}>Searching for users..</Text>
            }

            {
                searchInput
                &&
                !isLoading
                &&
                searchResults.length == 0
                &&
                <Text style={{color: 'gray'}}>No users found  ..</Text>
            }

            {
                hasSearchError
                &&
                !isLoading
                &&
                <Text style={{color: 'red'}}>Something went wrong..</Text>
            }

            {
                searchInput
                &&
                !isLoading
                &&
                searchResults.length > 0
                &&
                searchResults.map((user, index) => (
                    <UserListItem key={'user_list_item_' + index} user={user}
                        style={{
                            marginTop: '18px'
                        }}/>
                ))
            }

        </Container>

    </>;
};

export default FindUsersPage;
