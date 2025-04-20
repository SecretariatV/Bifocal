import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1f36 0%, #121629 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #f8fafc;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f8fafc;
  }
`;

const BrowseSigns: React.FC = () => {
  const navigate = useNavigate();

  const handleBrowseSigns = () => {
    window.open('/browse-signs.html', '_blank', 'noopener,noreferrer');
  };

  return (
    <Container>
      <Content>
        <Title>Browse Signs</Title>
        <Description>
          This page will help you identify and understand different signs of unhealthy relationships.
        </Description>

        <ButtonContainer>
          <BackButton onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </BackButton>
          <Button onClick={handleBrowseSigns}>
            Browse Signs
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default BrowseSigns; 