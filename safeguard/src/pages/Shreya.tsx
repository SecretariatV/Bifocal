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
  { text: "Hey, how's the frontend looking?", isSent: false, timestamp: "Yesterday 2:15 PM" },
  { text: "Coming along nicely! Just finished the dashboard", isSent: true, timestamp: "Yesterday 2:20 PM" },
  { text: "Can I see the designs?", isSent: false, timestamp: "Yesterday 2:22 PM" },
  { text: "Sure, I'll share the Figma link", isSent: true, timestamp: "Yesterday 2:25 PM" },
  { text: "Love the color scheme!", isSent: false, timestamp: "Yesterday 2:40 PM" },
  { text: "Thanks! Wanted it to feel modern but calming", isSent: true, timestamp: "Yesterday 2:42 PM" },
  { text: "Mission accomplished 😊", isSent: false, timestamp: "Yesterday 2:45 PM" },
  { text: "Any feedback on the navigation?", isSent: true, timestamp: "Yesterday 3:00 PM" },
  { text: "Maybe add hover states?", isSent: false, timestamp: "Yesterday 3:05 PM" },
  { text: "Good idea! I'll implement that now", isSent: true, timestamp: "Yesterday 3:10 PM" },
  { text: "Perfect! Demo's gonna rock!", isSent: false, timestamp: "Yesterday 3:15 PM" },
  { text: "Can't wait to show everyone!", isSent: true, timestamp: "Yesterday 3:20 PM" }
];

const Shreya = () => {
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
              <ContactName>Shreya</ContactName>
              <ContactStatus>+1 (480) 207-8487 • Online</ContactStatus>
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

export default Shreya; 