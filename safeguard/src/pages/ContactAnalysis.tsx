import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Navigation from '../components/Navigation'

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

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background-color: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const ContactPhoto = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`

const ContactInfo = styled.div`
  h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`

const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  background: rgba(20, 22, 31, 0.95);
  padding: 8px;
  border-radius: 12px;
`

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  border: none;
  border-radius: 8px;
  color: ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const AnalysisCard = styled.div`
  background: rgba(20, 22, 31, 0.95);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
`

const AnalysisTitle = styled.h3`
  color: white;
  font-size: 20px;
  margin: 0 0 16px 0;
`

const AnalysisText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
`

const messages = {
  mouni: [
    { text: "Hey! How's the ML model coming along?", isSent: false, timestamp: "Yesterday 3:45 PM" },
    { text: "Making progress! The accuracy is improving", isSent: true, timestamp: "Yesterday 3:47 PM" },
    { text: "That's great! Any challenges you're facing?", isSent: false, timestamp: "Yesterday 3:50 PM" },
    { text: "The data preprocessing is a bit tricky", isSent: true, timestamp: "Yesterday 3:52 PM" },
    { text: "Need any help with that?", isSent: false, timestamp: "Yesterday 3:55 PM" },
    { text: "Actually yes, could use your expertise!", isSent: true, timestamp: "Yesterday 3:56 PM" },
    { text: "Let's look at it together tomorrow?", isSent: false, timestamp: "Yesterday 4:00 PM" },
    { text: "Perfect! Thanks Mouni!", isSent: true, timestamp: "Yesterday 4:01 PM" }
  ],
  shreya: [
    { text: "Hey, how's the frontend looking?", isSent: false, timestamp: "Yesterday 2:15 PM" },
    { text: "Coming along nicely! Just finished the dashboard", isSent: true, timestamp: "Yesterday 2:20 PM" },
    { text: "Can I see the designs?", isSent: false, timestamp: "Yesterday 2:22 PM" },
    { text: "Sure, I'll share the Figma link", isSent: true, timestamp: "Yesterday 2:25 PM" },
    { text: "Love the color scheme!", isSent: false, timestamp: "Yesterday 2:40 PM" },
    { text: "Thanks! Wanted it to feel modern but calming", isSent: true, timestamp: "Yesterday 2:42 PM" },
    { text: "Mission accomplished 😊", isSent: false, timestamp: "Yesterday 2:45 PM" }
  ],
  sanya: [
    { text: "How's the backend integration going?", isSent: false, timestamp: "Yesterday 1:15 PM" },
    { text: "Just finished the authentication endpoints", isSent: true, timestamp: "Yesterday 1:20 PM" },
    { text: "Nice! Did you add rate limiting?", isSent: false, timestamp: "Yesterday 1:25 PM" },
    { text: "Yep, and added request validation too", isSent: true, timestamp: "Yesterday 1:30 PM" },
    { text: "Perfect! What about error handling?", isSent: false, timestamp: "Yesterday 1:35 PM" },
    { text: "All covered with proper status codes", isSent: true, timestamp: "Yesterday 1:40 PM" },
    { text: "You're on fire! 🔥", isSent: false, timestamp: "Yesterday 1:45 PM" }
  ]
};

const ContactAnalysis = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('messages')

  const getContactName = (id: string) => {
    switch (id) {
      case '1': return 'Mouni';
      case '2': return 'Shreya';
      case '3': return 'Sanya';
      default: return 'Contact';
    }
  }

  const getContactMessages = (id: string) => {
    switch (id) {
      case '1': return messages.mouni;
      case '2': return messages.shreya;
      case '3': return messages.sanya;
      default: return [];
    }
  }

  const contactName = getContactName(id || '')
  const contactMessages = getContactMessages(id || '')

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <MessageList>
            {contactMessages.map((message, index) => (
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
        )
      case 'obsession':
        return (
          <AnalysisCard>
            <AnalysisTitle>Obsessive Behavior Analysis</AnalysisTitle>
            <AnalysisText>
              Our AI has analyzed the message patterns and detected potential signs of obsessive behavior.
              The analysis includes frequency of messages, time patterns, and content analysis.
            </AnalysisText>
          </AnalysisCard>
        )
      case 'stalking':
        return (
          <AnalysisCard>
            <AnalysisTitle>Stalking Behavior Analysis</AnalysisTitle>
            <AnalysisText>
              This analysis focuses on identifying patterns that might indicate stalking behavior,
              including location tracking, surveillance, and persistent unwanted contact attempts.
            </AnalysisText>
          </AnalysisCard>
        )
      case 'gaslighting':
        return (
          <AnalysisCard>
            <AnalysisTitle>Gaslighting Analysis</AnalysisTitle>
            <AnalysisText>
              We analyze communication patterns for signs of gaslighting and emotional manipulation,
              including denial of events, minimizing feelings, and reality distortion.
            </AnalysisText>
          </AnalysisCard>
        )
      default:
        return null
    }
  }

  return (
    <Container>
      <Navigation 
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
      />

      <MainContent sidebarOpen={isSidebarOpen}>
        <Content>
          <Header>
            <ContactPhoto>{contactName[0]}</ContactPhoto>
            <ContactInfo>
              <h1>{contactName}</h1>
              <p>ID: {id}</p>
            </ContactInfo>
          </Header>

          <TabContainer>
            <Tab 
              active={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')}
            >
              Messages
            </Tab>
            <Tab 
              active={activeTab === 'obsession'} 
              onClick={() => setActiveTab('obsession')}
            >
              Obsession
            </Tab>
            <Tab 
              active={activeTab === 'stalking'} 
              onClick={() => setActiveTab('stalking')}
            >
              Stalking
            </Tab>
            <Tab 
              active={activeTab === 'gaslighting'} 
              onClick={() => setActiveTab('gaslighting')}
            >
              Gaslighting
            </Tab>
          </TabContainer>

          {renderContent()}
        </Content>
      </MainContent>
    </Container>
  )
}

export default ContactAnalysis 