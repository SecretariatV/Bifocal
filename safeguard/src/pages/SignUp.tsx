import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Link } from 'react-router-dom'
import { Global, css, keyframes } from '@emotion/react'
import useUserStore from '../store/userStore'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

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
`

const FormBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 2.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

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
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 1px;
`

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
`

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
`

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
`

// Animation keyframes
const float1 = keyframes`
  0%   { transform: translate(-15%, -10%) scale(1); }
  50%  { transform: translate(20%,  15%) scale(1.15); }
  100% { transform: translate(-15%, -10%) scale(1); }
`

const float2 = keyframes`
  0%   { transform: translate(10%, 60%)  scale(1); }
  50%  { transform: translate(-25%, 50%) scale(1.25); }
  100% { transform: translate(10%, 60%)  scale(1); }
`

const float3 = keyframes`
  0%   { transform: translate(70%, -30%) scale(1); }
  50%  { transform: translate(50%, 10%)  scale(1.1); }
  100% { transform: translate(70%, -30%) scale(1); }
`

const Blob = styled.div<{
  size: number
  gradient: string
  animation: ReturnType<typeof keyframes>
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
`

const GlobalStyles = () => (
  <Global
    styles={css`
      html, body, #root {
        height: 100%;
        background-color: #14161f;
        background-image: 
          radial-gradient(circle at 0% 0%, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0) 50%),
          radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0) 50%),
          radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.1) 0%, rgba(244, 114, 182, 0) 50%);
      }
    `}
  />
)

const Checkbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SignUp: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUser, login } = useUserStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!consent) {
      setError('Please agree to the terms and conditions')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Save user data to store
    setUser(name, email, phone)
    login()
    
    // Navigate to dashboard
    navigate('/dashboard')
  }

  return (
    <Container>
      <GlobalStyles />
      <FormBox>
        <Title>SafeScreen</Title>
        <Subtitle>Create your account</Subtitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I agree to allow BiFocal to access my contacts and analyze my messages for safety purposes
          </CheckboxLabel>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Sign Up</Button>
        </form>
        <BottomLink>
          Already have an account?<Link to="/login">Sign In</Link>
        </BottomLink>
      </FormBox>

      <Blob size={600} gradient="linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)" animation={float1} />
      <Blob size={500} gradient="linear-gradient(135deg, #34d399 0%, #059669 100%)" animation={float2} />
      <Blob size={550} gradient="linear-gradient(135deg, #f472b6 0%, #db2777 100%)" animation={float3} />
    </Container>
  )
}

export default SignUp 