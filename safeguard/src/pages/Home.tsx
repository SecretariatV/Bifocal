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

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
`;

const BinocularsWrapper = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 3rem;
  z-index: 1;
`;

const Spotlight = styled.div`
  position: absolute;
  top: 90%;
  left: 50%;
  width: 300px;
  height: 400px;
  background: radial-gradient(
    ellipse at top,
    rgba(96, 165, 250, 0.15),
    rgba(96, 165, 250, 0)
  );
  transform: translateX(-100%) rotate(30deg);
  z-index: -1;
  filter: blur(8px);
  animation: ${shimmer} 3s ease-in-out infinite;
  pointer-events: none;

  &.right {
    transform: translateX(0%) rotate(-30deg);
  }
`;

const BinocularsIcon = styled.svg`
  width: 120px;
  height: 120px;
  fill: none;
  stroke: #60a5fa;
  stroke-width: 1.5;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out forwards,
             ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.3));

  &:hover {
    stroke: #3b82f6;
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
  text-shadow: 
    0 0 30px rgba(97, 153, 255, 0.2),
    0 0 60px rgba(97, 153, 255, 0.1);
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out forwards;
  position: relative;
  z-index: 2;
  
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
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4rem;
  font-weight: 300;
  letter-spacing: 4px;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out 0.2s forwards;
  text-transform: lowercase;
  position: relative;
  z-index: 2;

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

const IconContainer = styled.div`
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out forwards;
  margin-bottom: 1rem;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <BinocularsWrapper>
          <BinocularsIcon viewBox="0 0 24 24">
            <path d="M5 3h1v7H5zM18 3h1v7h-1z" />
            <circle cx="7.5" cy="14" r="3" />
            <circle cx="16.5" cy="14" r="3" />
            <path d="M10.5 14h3" strokeLinecap="round" />
          </BinocularsIcon>
          <Spotlight />
          <Spotlight className="right" />
        </BinocularsWrapper>
        <Title>bifocal</Title>
        <Subtitle>bringing patterns to light through dual lens clarity</Subtitle>
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