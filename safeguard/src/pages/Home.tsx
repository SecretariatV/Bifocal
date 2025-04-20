import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at 50% 50%, #141b3b 0%, #0a0f2c 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  color: #f8fafc;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(96, 165, 250, 0.1),
      transparent
    );
  }
`;

const Content = styled.div`
  text-align: center;
  max-width: 1200px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 12rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  letter-spacing: -5px;
  line-height: 1;
  text-shadow: 0 0 30px rgba(97, 153, 255, 0.2);
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out forwards;
  
  &::after {
    content: '.';
    color: #60a5fa;
    -webkit-text-fill-color: #60a5fa;
  }

  @media (max-width: 768px) {
    font-size: 8rem;
    letter-spacing: -3px;
  }

  @media (max-width: 480px) {
    font-size: 6rem;
    letter-spacing: -2px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4rem;
  font-weight: 300;
  letter-spacing: 4px;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out 0.2s forwards;
  text-transform: lowercase;

  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 3px;
    margin-bottom: 3rem;
  }
`;

const ButtonContainer = styled.div`
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out 0.4s forwards;
`;

const Button = styled.button`
  padding: 1.25rem 4rem;
  border-radius: 0.75rem;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #4e8eff 0%, #2563eb 100%);
    box-shadow: 0 4px 15px -3px rgba(96, 165, 250, 0.4),
                0 0 20px rgba(96, 165, 250, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title>bifocal</Title>
        <Subtitle>clarity, through dual lens</Subtitle>
        <ButtonContainer>
          <Button onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Home; 