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

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3rem;
  text-align: center;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const EmotionTag = styled.button<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.selected ? '#fff' : '#94a3b8'};
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.selected 
    ? 'rgba(96, 165, 250, 0.5)'
    : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.selected 
      ? 'rgba(96, 165, 250, 0.8)'
      : 'rgba(255, 255, 255, 0.2)'};

    &:before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
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

const emotions = [
  'Neutral',
  'Concerned',
  'Anxious',
  'Fearful',
  'Manipulated',
  'Distressed',
  'On edge',
  'Powerless',
  'Hopeless',
  'Scared'
];

const ConversationExperience: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleContinue = async () => {
    if (selectedEmotions.length === 0) return;

    setIsSubmitting(true);
    try {
      // Store in localStorage for persistence
      localStorage.setItem('userEmotions', JSON.stringify({
        emotions: selectedEmotions,
        timestamp: new Date().toISOString()
      }));

      navigate('/analysis');
    } catch (error) {
      console.error('Error saving emotions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load previously selected emotions if they exist
  useEffect(() => {
    const savedEmotions = localStorage.getItem('userEmotions');
    if (savedEmotions) {
      const { emotions } = JSON.parse(savedEmotions);
      setSelectedEmotions(emotions);
    }
  }, []);

  return (
    <Container>
      <Title>How are you feeling?</Title>
      <EmotionGrid>
        {emotions.map(emotion => (
          <EmotionTag
            key={emotion}
            selected={selectedEmotions.includes(emotion)}
            onClick={() => handleEmotionClick(emotion)}
          >
            {emotion}
          </EmotionTag>
        ))}
      </EmotionGrid>
      <ButtonContainer>
        <BackButton onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </BackButton>
        <Button 
          onClick={handleContinue}
          disabled={selectedEmotions.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default ConversationExperience; 