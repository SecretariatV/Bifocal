import React from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { Global, css, keyframes } from '@emotion/react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #14161f;
  position: relative;
  overflow: hidden;
`

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 1rem;
  z-index: 1;
`

const Tagline = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  text-align: center;
  z-index: 1;
`

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: rgba(20, 22, 31, 0.95);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`

const SignInText = styled.p`
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  z-index: 1;
`

const SignInLink = styled.span`
  color: #3b82f6;
  cursor: pointer;
  margin-left: 0.5rem;
  
  &:hover {
    text-decoration: underline;
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

const SignUp = () => {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the sign-up logic
    navigate('/dashboard')
  }

  const handleSignInClick = () => {
    navigate('/')
  }

  return (
    <>
      <GlobalStyles />
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
        <Logo>SafeScreen</Logo>
        <Tagline>Create your account to get started</Tagline>
        <Form onSubmit={handleSubmit}>
          <Input type="text" placeholder="Full Name" required />
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Password" required />
          <Input type="password" placeholder="Confirm Password" required />
          <Button type="submit">Sign Up</Button>
        </Form>
        <SignInText>
          Already have an account?
          <SignInLink onClick={handleSignInClick}>Sign In</SignInLink>
        </SignInText>
      </Container>
    </>
  )
}

export default SignUp 