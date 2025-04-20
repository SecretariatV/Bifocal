import React from 'react';
import styled from '@emotion/styled';
import Navigation from '../components/Navigation';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  padding: 40px;
  padding-left: ${props => props.sidebarOpen ? '290px' : '40px'};
  background-color: #14161f;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 0;
  transition: padding-left 0.3s ease;
`

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
`

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`

const ProfilePic = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: #3b82f6;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`

const ContactInfo = styled.div`
  flex: 1;
`

const ContactName = styled.h2`
  color: white;
  margin: 0;
  font-size: 24px;
`

const ContactStatus = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
`

const Message = styled.div<{ isSent: boolean }>`
  max-width: 70%;
  margin: ${props => props.isSent ? '10px 0 10px auto' : '10px auto 10px 0'};
  padding: 12px 16px;
  background: ${props => props.isSent ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border-radius: ${props => props.isSent ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
`

const Timestamp = styled.div<{ isSent: boolean }>`
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  margin: 4px ${props => props.isSent ? '0 0 auto' : 'auto 0 0'};
  text-align: ${props => props.isSent ? 'right' : 'left'};
`

const InputContainer = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-top: auto;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`

const messages = [
  { text: "How's the backend API coming along?", isSent: false, timestamp: "Yesterday 1:15 PM" },
  { text: "Just finished the authentication endpoints", isSent: true, timestamp: "Yesterday 1:20 PM" },
  { text: "Nice! Did you add rate limiting?", isSent: false, timestamp: "Yesterday 1:25 PM" },
  { text: "Yep, and added request validation too", isSent: true, timestamp: "Yesterday 1:30 PM" },
  { text: "Perfect! What about error handling?", isSent: false, timestamp: "Yesterday 1:35 PM" },
  { text: "All covered with proper status codes", isSent: true, timestamp: "Yesterday 1:40 PM" },
  { text: "You're on fire! 🔥", isSent: false, timestamp: "Yesterday 1:45 PM" },
  { text: "Thanks! Want to review the PR?", isSent: true, timestamp: "Yesterday 2:00 PM" },
  { text: "Already looking at it!", isSent: false, timestamp: "Yesterday 2:05 PM" },
  { text: "The test coverage looks great", isSent: false, timestamp: "Yesterday 2:10 PM" },
  { text: "Added some edge cases too", isSent: true, timestamp: "Yesterday 2:15 PM" },
  { text: "Approved! Ready to merge 🚀", isSent: false, timestamp: "Yesterday 2:20 PM" }
];

const Sanya = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />
      <MainContent sidebarOpen={isSidebarOpen}>
        <ChatContainer>
          <ChatHeader>
            <ProfilePic>S</ProfilePic>
            <ContactInfo>
              <ContactName>Sanya</ContactName>
              <ContactStatus>sanyahegde7@gmail.com • Online</ContactStatus>
            </ContactInfo>
          </ChatHeader>

          <MessageList>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <Message isSent={message.isSent}>
                  {message.text}
                </Message>
                <Timestamp isSent={message.isSent}>
                  {message.timestamp}
                </Timestamp>
              </React.Fragment>
            ))}
          </MessageList>

          <InputContainer>
            <Input 
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Handle message send
                }
              }}
            />
          </InputContainer>
        </ChatContainer>
      </MainContent>
    </Container>
  );
};

export default Sanya; 