import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1f36 0%, #121629 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 4rem;
  justify-content: center;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const Justification: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  useEffect(() => {
    // Load the selected emotions from localStorage
    const savedEmotions = localStorage.getItem('userEmotions');
    if (savedEmotions) {
      const { emotions } = JSON.parse(savedEmotions);
      setSelectedEmotions(emotions);
    }
  }, []);

  return (
    <Container>
      <Content>
        <Title>Tell us more</Title>
        {/* Content will be added here in the next iteration */}
        <ButtonContainer>
          <BackButton onClick={() => navigate('/conversation')}>
            Back
          </BackButton>
          <Button onClick={() => navigate('/upload')}>
            Continue
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Justification; 