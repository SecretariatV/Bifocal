import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #14161f;
  color: #fff;
  padding: 2rem;
  position: relative;
`;

const JournalContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-top: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 1rem;
  font-family: 'Space Grotesk', sans-serif;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.7;
  resize: vertical;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: rgba(96, 165, 250, 0.5);
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1d2e;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  z-index: 1000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 999;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
`;

const ModalText = styled.p`
  color: #fff;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`;

const ThoughtBubble = styled.div<{ isVisible: boolean }>`
  position: fixed;
  right: 2rem;
  top: 5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 100;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ThoughtText = styled.p`
  color: #f8fafc;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

interface EmergencyButtonProps {
  primary?: boolean;
}

const EmergencyButton = styled(ActionButton)<EmergencyButtonProps>`
  background: ${props => props.primary ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255, 255, 255, 0.1)'};
  margin-bottom: 1rem;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

// Trigger words that might indicate emotional distress
const triggerWords = {
  isolation: ['alone', 'lonely', 'no one', 'nobody'],
  distress: ['overwhelmed', 'cant take', 'tired of', 'breaking down'],
  crisis: ['suicide', 'kill', 'die', 'end it'],
  emotional: ['cry', 'crying', 'tears', 'breaking point']
};

// Supportive acknowledgments
const supportiveResponses = {
  isolation: "I hear you. Feeling isolated is really hard. Would you like to reach out to someone?",
  distress: "I notice you're going through a lot right now. Support is available whenever you need it.",
  crisis: "Your life has value. There are people who want to help right now.",
  emotional: "It's okay to feel emotional and let it out. Would you like to talk to someone?"
};

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const Journal = () => {
  const [journalText, setJournalText] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [closestContact] = useState({ name: "Sarah", number: "555-0123" });
  const navigate = useNavigate();

  const analyzeContent = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Check for trigger words
    for (const [category, words] of Object.entries(triggerWords)) {
      if (words.some(word => lowerText.includes(word))) {
        setCurrentResponse(supportiveResponses[category as keyof typeof supportiveResponses]);
        if (category === 'crisis') {
          setShowEmergency(true);
        }
        return;
      }
    }
  };

  const handleSaveAndReflect = () => {
    if (!journalText.trim()) {
      return;
    }
    
    // Analyze content when saving
    analyzeContent(journalText);
    
    // Clear the text area
    setJournalText('');
    
    // If no specific response was triggered, show default confirmation
    if (!currentResponse) {
      setShowConfirmation(true);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCallSupport = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleCallClosestContact = () => {
    if (closestContact?.number) {
      window.location.href = `tel:${closestContact.number.replace(/\D/g, '')}`;
    }
  };

  return (
    <Container>
      <BackButton onClick={handleBackToDashboard}>
        ← Back to Dashboard
      </BackButton>

      <JournalContainer>
        <Title>Interactive Journal</Title>
        <Subtitle>Write freely. This is your safe space to express yourself.</Subtitle>
        
        <TextArea
          placeholder="Write what's on your mind. No one else sees this but you."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          autoFocus
        />

        <ActionButton onClick={handleSaveAndReflect}>
          Save & Reflect
        </ActionButton>
      </JournalContainer>

      {currentResponse && !showEmergency && (
        <>
          <Overlay onClick={() => setCurrentResponse('')} />
          <Modal>
            <BackButton onClick={handleBackToDashboard} style={{ position: 'static', marginBottom: '1.5rem' }}>
              ← Back to Dashboard
            </BackButton>
            <ModalTitle>We Hear You</ModalTitle>
            <ModalText>
              {currentResponse}
            </ModalText>
            <ActionButton onClick={() => setCurrentResponse('')}>
              Close
            </ActionButton>
          </Modal>
        </>
      )}

      {showEmergency && (
        <>
          <Overlay onClick={() => setShowEmergency(false)} />
          <Modal>
            <BackButton onClick={handleBackToDashboard} style={{ position: 'static', marginBottom: '1.5rem' }}>
              ← Back to Dashboard
            </BackButton>
            <ModalTitle>Let's Get You Support</ModalTitle>
            <ModalText>
              You don't have to go through this alone. How would you like to reach out?
            </ModalText>
            <ButtonGroup>
              {closestContact && (
                <EmergencyButton onClick={handleCallClosestContact}>
                  ❤️ Call {closestContact.name}
                </EmergencyButton>
              )}
              <EmergencyButton primary onClick={() => handleCallSupport('988')}>
                📞 Call 988 Crisis Lifeline
              </EmergencyButton>
              <EmergencyButton onClick={() => handleCallSupport('741741')}>
                💬 Text HOME to 741741
              </EmergencyButton>
              <ActionButton onClick={() => setShowEmergency(false)}>
                Close
              </ActionButton>
            </ButtonGroup>
          </Modal>
        </>
      )}

      {showConfirmation && (
        <>
          <Overlay onClick={() => setShowConfirmation(false)} />
          <Modal>
            <BackButton onClick={handleBackToDashboard} style={{ position: 'static', marginBottom: '1.5rem' }}>
              ← Back to Dashboard
            </BackButton>
            <ModalTitle>Entry Saved</ModalTitle>
            <ModalText>
              We've saved your entry. We're always here if you need us.
            </ModalText>
            <ActionButton onClick={() => setShowConfirmation(false)}>
              Close
            </ActionButton>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Journal; 