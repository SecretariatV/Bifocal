import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { Global, css } from '@emotion/react'
import useContactsStore, { Contact } from '../store/contactsStore'
import useUserStore from '../store/userStore'
import ContactSelector from '../components/ContactSelector'
import { RelationshipSelector } from '../components/RelationshipSelector'

interface FormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

interface ContactRelationship {
  relationship: string;
  customRelationship: string;
}

interface ContactRelationships {
  [key: number]: ContactRelationship;
}

interface UserState {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

interface User extends UserState {
  name: string;
  email: string;
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

const GlobalStyles = () => (
  <Global
    styles={css`
      html, body, #root {
        height: 100%;
        background-color: #14161f;
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
  const { contacts, selectedContacts, setSelectedContacts, updateContactRelationship, resetStore } = useContactsStore()
  const { name: userName, email: userEmail, phone: userPhone, setUser } = useUserStore()
  const [formData, setFormData] = useState<FormData>({
    name: userName || '',
    email: userEmail || '',
    phone: userPhone || '',
    bio: '',
  })
  const [contactRelationships, setContactRelationships] = useState<ContactRelationships>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactSelect = (contact: Contact) => {
    setSelectedContacts([...selectedContacts, contact])
  }

  const handleContactRemove = (contactId: number) => {
    setSelectedContacts(selectedContacts.filter(c => c.id !== contactId))
  }

  const handleRelationshipChange = (contactId: number, relationship: string) => {
    updateContactRelationship(contactId, relationship)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save form data to user store
    setUser(formData.name, formData.email, formData.phone)
    // Navigate to contacts page to see the changes
    navigate('/contacts')
  }

  return (
    <Container>
      <GlobalStyles />
      <BackButton onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </BackButton>
      <MainContent>
        <PageTitle>Edit Profile</PageTitle>
        <ProfileForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>
            <InputGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </InputGroup>
            <InputGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </InputGroup>
            <InputGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </InputGroup>
            <InputGroup>
              <Label>Bio</Label>
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
            </InputGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Contacts</SectionTitle>
            <Button type="button" onClick={resetStore} style={{ marginBottom: '20px', background: '#4b5563' }}>
              Reset Contacts
            </Button>
            <ContactSelector
              contacts={contacts}
              selectedContacts={selectedContacts}
              onSelectContact={handleContactSelect}
              onRemoveContact={handleContactRemove}
            />
            {selectedContacts.map(contact => (
              <div key={contact.id} style={{ marginTop: '20px' }}>
                <RelationshipSelector
                  value={contact.relationship || ''}
                  onChange={(relationship) => handleRelationshipChange(contact.id, relationship)}
                  contactName={contact.name}
                />
              </div>
            ))}
          </FormSection>

          <Button type="submit">Save Changes</Button>
        </ProfileForm>
      </MainContent>
    </Container>
  )
}

export default EditProfile 