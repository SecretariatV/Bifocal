import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { Global, css, keyframes } from '@emotion/react'
import useContactsStore from '../store/contactsStore'

// Add these interfaces before the styled components
interface Contact {
  id: number;
  name: string;
  currentRelationship: string;
}

interface ContactRelationship {
  relationship: string;
  customRelationship: string;
}

interface ContactRelationships {
  [key: number]: ContactRelationship;
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  z-index: 100;
  outline: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  padding-top: 100px;
  background-color: transparent;
  overflow-y: auto;
  z-index: 2;
`

const PageTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
  letter-spacing: 0.05em;
  text-align: center;
`

const ProfileForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: rgba(20, 22, 31, 0.95);
  padding: 32px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const FormSection = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
`

const InputGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-size: 14px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`

const Button = styled.button`
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  font-weight: 500;
  color: ${props => (props.active ? '#7367f0' : 'rgba(255, 255, 255, 0.6)')};
  transition: all 0.2s ease;

  &:hover {
    color: #7367f0;
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

const ContactRelationshipsSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const ContactCard = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const ContactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const ContactName = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 16px;
`

const RelationshipSelect = styled.select`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  option {
    background-color: #14161f;
    color: white;
  }
`

const CustomRelationshipInput = styled(Input)`
  margin-top: 8px;
`

const EditProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  })

  const contacts = useContactsStore(state => state.contacts)
  const updateContactRelationship = useContactsStore(state => state.updateContactRelationship)
  const updateCustomRelationship = useContactsStore(state => state.updateCustomRelationship)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRelationshipChange = (contactId: number, value: string) => {
    updateContactRelationship(contactId, value)
  }

  const handleCustomRelationshipChange = (contactId: number, value: string) => {
    updateCustomRelationship(contactId, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    navigate('/dashboard')
  }

  return (
    <Container>
      <GlobalStyles />
      <BackButton onClick={() => navigate('/dashboard')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Dashboard
      </BackButton>

      <MainContent>
        <PageTitle>Edit Profile</PageTitle>
        <ProfileForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>
            <InputGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="bio">Bio</Label>
              <TextArea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
            </InputGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Contact Relationships</SectionTitle>
            {contacts.map(contact => (
              <InputGroup key={contact.id}>
                <Label>{contact.name}</Label>
                <select
                  value={contact.relationship || ''}
                  onChange={(e) => handleRelationshipChange(contact.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '8px'
                  }}
                >
                  <option value="">Select relationship</option>
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="acquaintance">Acquaintance</option>
                  <option value="other">Other</option>
                </select>
                {contact.relationship === 'other' && (
                  <Input
                    type="text"
                    value={contact.customRelationship || ''}
                    onChange={(e) => handleCustomRelationshipChange(contact.id, e.target.value)}
                    placeholder="Specify relationship"
                  />
                )}
              </InputGroup>
            ))}
          </FormSection>

          <Button type="submit">Save Changes</Button>
        </ProfileForm>
      </MainContent>

      <Blob size={600} gradient="linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)" animation={float1} />
      <Blob size={500} gradient="linear-gradient(135deg, #34d399 0%, #059669 100%)" animation={float2} />
      <Blob size={550} gradient="linear-gradient(135deg, #f472b6 0%, #db2777 100%)" animation={float3} />
    </Container>
  )
}

export default EditProfile 