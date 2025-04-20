import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1f36 0%, #121629 100%);
  color: #f8fafc;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
`;

const FeatureDescription = styled.p`
  color: #94a3b8;
  line-height: 1.6;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <HeroSection>
          <Title>Welcome to Safeguard</Title>
          <Subtitle>
            Your personal safety companion. We help you identify and understand
            patterns in your relationships to keep you safe and informed.
          </Subtitle>
          <Button onClick={() => navigate('/dashboard')}>
            Get Started
          </Button>
        </HeroSection>

        <Section>
          <SectionTitle>Features</SectionTitle>
          <SectionContent>
            <FeatureCard onClick={() => navigate('/upload')}>
              <FeatureTitle>Pattern Detection</FeatureTitle>
              <FeatureDescription>
                Identify and understand patterns in your relationships through
                advanced analysis of your conversations.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard onClick={() => navigate('/conversation')}>
              <FeatureTitle>Safety Tools</FeatureTitle>
              <FeatureDescription>
                Access a range of tools designed to help you stay safe and
                maintain healthy boundaries in your relationships.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard onClick={() => navigate('/browse-signs')}>
              <FeatureTitle>Support Resources</FeatureTitle>
              <FeatureDescription>
                Connect with resources and support networks to help you navigate
                challenging situations.
              </FeatureDescription>
            </FeatureCard>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <SectionContent>
            <FeatureCard>
              <FeatureTitle>1. Upload Conversations</FeatureTitle>
              <FeatureDescription>
                Share your experiences through audio uploads or text messages.
                Your privacy is our top priority.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>2. Analysis</FeatureTitle>
              <FeatureDescription>
                Our system analyzes patterns and behaviors to identify potential
                concerns in your relationships.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>3. Insights</FeatureTitle>
              <FeatureDescription>
                Receive personalized insights and recommendations to help you
                make informed decisions about your relationships.
              </FeatureDescription>
            </FeatureCard>
          </SectionContent>
        </Section>
      </Content>
    </Container>
  );
};

export default Home; 