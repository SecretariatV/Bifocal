import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Contact } from '../store/contactsStore';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
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
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: rgba(30, 32, 41, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 4px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const Option = styled.div<{ isSelected: boolean }>`
  padding: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ContactName = styled.span`
  font-weight: 500;
`;

const ContactDetail = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const SelectedContacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const ContactChip = styled.div`
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  padding: 4px 12px;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
  }
`;

interface Props {
  contacts: Contact[];
  selectedContacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onRemoveContact: (contactId: number) => void;
}

const ContactSelector: React.FC<Props> = ({
  contacts,
  selectedContacts,
  onSelectContact,
  onRemoveContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedContacts.some(selected => selected.id === contact.id)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Container ref={containerRef}>
      <SearchInput
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      
      <Dropdown isOpen={isOpen}>
        {filteredContacts.map(contact => (
          <Option
            key={contact.id}
            isSelected={selectedContacts.some(selected => selected.id === contact.id)}
            onClick={() => {
              onSelectContact(contact);
              setSearchTerm('');
            }}
          >
            <ContactInfo>
              <ContactName>{contact.name}</ContactName>
              {(contact.email || contact.phone) && (
                <ContactDetail>
                  {contact.email || contact.phone}
                </ContactDetail>
              )}
            </ContactInfo>
          </Option>
        ))}
      </Dropdown>

      <SelectedContacts>
        {selectedContacts.map(contact => (
          <ContactChip key={contact.id}>
            {contact.name}
            <RemoveButton onClick={() => onRemoveContact(contact.id)}>×</RemoveButton>
          </ContactChip>
        ))}
      </SelectedContacts>
    </Container>
  );
};

export default ContactSelector; 