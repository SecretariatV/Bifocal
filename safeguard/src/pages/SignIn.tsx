import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, Link } from 'react-router-dom';
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
  background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #f8fafc;
`;

const FormBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 2.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  letter-spacing: -1px;
  
  &::after {
    content: '.';
    color: #60a5fa;
    -webkit-text-fill-color: #60a5fa;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #4e8eff 0%, #2563eb 100%);
    box-shadow: 0 4px 12px -2px rgba(96, 165, 250, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BottomLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;

  a {
    color: #60a5fa;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Animation keyframes
const float1 = keyframes`
  0%   { transform: translate(-15%, -10%) scale(1); }
  50%  { transform: translate(20%,  15%) scale(1.15); }
  100% { transform: translate(-15%, -10%) scale(1); }
`;

const float2 = keyframes`
  0%   { transform: translate(10%, 60%)  scale(1); }
  50%  { transform: translate(-25%, 50%) scale(1.25); }
  100% { transform: translate(10%, 60%)  scale(1); }
`;

const float3 = keyframes`
  0%   { transform: translate(70%, -30%) scale(1); }
  50%  { transform: translate(50%, 10%)  scale(1.1); }
  100% { transform: translate(70%, -30%) scale(1); }
`;

const Blob = styled.div<{
  size: number;
  gradient: string;
  animation: ReturnType<typeof keyframes>;
}>`
  position: fixed;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  background: ${p => p.gradient};
  opacity: 0.35;
  filter: blur(180px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: ${p => p.animation} 45s ease-in-out infinite;
`;

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual sign in logic here
    navigate('/dashboard');
  };

  return (
    <>
      {/* Background blobs */}
      <Blob
        size={700}
        gradient="radial-gradient(circle at 30% 30%, #7367f0 0%, rgba(115,103,240,0) 70%)"
        animation={float1}
        style={{ top: '-250px', left: '-200px' }}
      />
      <Blob
        size={800}
        gradient="radial-gradient(circle at 70% 30%, #f472b6 0%, rgba(244,114,182,0) 75%)"
        animation={float2}
        style={{ bottom: '-300px', left: '20%' }}
      />
      <Blob
        size={650}
        gradient="radial-gradient(circle at 50% 50%, #22d3ee 0%, rgba(34,211,238,0) 70%)"
        animation={float3}
        style={{ top: '-200px', right: '-200px' }}
      />
      
      <Container>
        <FormBox>
          <Title>bifocal</Title>
          <Subtitle>begin your journey</Subtitle>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Sign In</Button>
          </form>
          <BottomLink>
            New to bifocal?<Link to="/signup">Sign up</Link>
          </BottomLink>
        </FormBox>
      </Container>
    </>
  );
};

export default SignIn; 