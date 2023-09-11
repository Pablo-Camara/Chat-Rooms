import { createContext, useState } from "react";

export const ChatRoomContext = createContext();

export const ChatRoomContextProvider = ({ children }) => {
    const [isPrivateChat, setIsPrivateChat] = useState(null);
    const [chattingWithUserId, setChattingWithUserId] = useState(null);


    return (
      <ChatRoomContext.Provider
        value={{
            chattingWithUserId, setChattingWithUserId,
            isPrivateChat, setIsPrivateChat
        }}
      >
        {children}
      </ChatRoomContext.Provider>
    );
  };

export default ChatRoomContextProvider;
