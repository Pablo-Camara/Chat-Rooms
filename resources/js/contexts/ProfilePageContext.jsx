import { createContext, useState } from "react";

export const ProfilePageContext = createContext();

export const ProfilePageContextProvider = ({ children }) => {
    const [currentProfileUserId, setCurrentProfileUserId] = useState(null);

    return (
      <ProfilePageContext.Provider
        value={{
            currentProfileUserId, setCurrentProfileUserId
        }}
      >
        {children}
      </ProfilePageContext.Provider>
    );
  };

export default ProfilePageContextProvider;
