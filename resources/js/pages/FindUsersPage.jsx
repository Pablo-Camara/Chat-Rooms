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
            setIsLoading(false);
            setSearchResults([
                {
                    firstName: 'Pablo',
                    lastName: 'Câmara',
                    username: 'pc'
                },
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    username: 'johndoe'
                }
              ]);
            console.log(error);
            return;
        }

        if (response.status === 200) {
            setIsLoading(false);
            setSearchResults(response.data.users);
        } else {
            setSearchResults([]);
            throw new Error(response.message);
        }
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

            <TextBoxLabel>search users by name/username:</TextBoxLabel>
            <TextBox value={searchInput} setTextFunc={setSearchInput}/>




            {
                isLoading
                &&
                searchInput
                &&
                <>
                    <Header type="h1">Search results:</Header>
                    <Text style={{color: 'gray'}}>Loading results..</Text>
                </>

            }

            {
                !isLoading
                &&
                searchInput
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
