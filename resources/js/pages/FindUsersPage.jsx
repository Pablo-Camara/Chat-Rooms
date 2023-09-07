import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import Container from "../components/Container";
import TextBoxLabel from "../components/TextBoxLabel";
import TextBox from "../components/TextBox";
import Text from "../components/Text";
import Navbar from "../components/Navbar";
import UserListItem from "../components/UserListItem";

const FindUsersPage = () => {
  const { authToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHasError, setSearchHasError] = useState(false);
  useEffect(() => {
    let timerId;

    // Function to send the GET request
    const fetchData = async () => {
        try {
            setIsLoading(true);
            response = await axios.post('/api/find-users', {
                searchInput
            },{
                headers: {
                  Authorization: `Bearer ` + authToken,
                },
            });
        } catch (error) {
            setSearchHasError(true);
            console.log(error);
        }

        if (response.status === 200) {
            setSearchResults(response.data.users);
            setSearchHasError(false);
            console.log(response.data);
        } else {
            setSearchHasError(true);
            console.log(response);
        }

        setIsLoading(false);

    };

    // Debounce the search input by waiting for 1.5 seconds before making the request
    timerId = setTimeout(() => {
      if (searchInput) {
        fetchData();
      }
    }, 1500);

    // Cleanup function to cancel the timer when the input changes
    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);


  return <>
        <Navbar />
        <Container>
            <Header type="h1">Find other users</Header>


            <TextBox value={searchInput} setTextFunc={setSearchInput}/>

            {
                searchInput
                &&
                <Header type="h1">Search results:</Header>
            }

            {
                !isLoading
                &&
                !searchInput
                &&
                <>
                    <Text style={{color: 'gray'}}>Use the box above to start searching..</Text>
                </>
            }

            {
                isLoading
                ||
                searchInput
                &&
                <>
                    <Text style={{color: 'gray'}}>Loading results..</Text>
                </>
            }
            {
                searchHasError
                &&
                <>
                    <Text style={{color: 'gray'}}>Could't load search results..</Text>
                </>
            }

            {
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
