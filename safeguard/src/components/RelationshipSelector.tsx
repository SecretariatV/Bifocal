import React from 'react';
import styled from '@emotion/styled';

const SelectContainer = styled.div`
  width: 100%;
  margin: 8px 0;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: #ffffff;
  border: 1px solid #3b3b3b;
  font-size: 1rem;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #4a4a4a;
  }

  &:focus {
    border-color: #646cff;
  }

  option {
    background-color: #1e1e1e;
    color: #ffffff;
    padding: 8px;
  }
`;

const relationshipOptions = [
  'Select relationship',
  'Friend',
  'Family',
  'Colleague',
  'Classmate',
  'Acquaintance',
  'Partner',
  'Ex-Partner',
  'Roommate',
  'Other'
];

interface RelationshipSelectorProps {
  value: string;
  onChange: (value: string) => void;
  contactName: string;
}

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  value,
  onChange,
  contactName
}) => {
  return (
    <SelectContainer>
      <StyledSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Select relationship with ${contactName}`}
      >
        {relationshipOptions.map((option) => (
          <option key={option} value={option === 'Select relationship' ? '' : option}>
            {option}
          </option>
        ))}
      </StyledSelect>
    </SelectContainer>
  );
}; 