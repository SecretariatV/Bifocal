import React from 'react';
import styled from '@emotion/styled';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  letter-spacing: -1px;
  margin: 0;
  
  &::after {
    content: '.';
    color: #60a5fa;
    -webkit-text-fill-color: #60a5fa;
  }
`;

export const Logo: React.FC = () => {
  return (
    <LogoContainer>
      <LogoText>bifocal</LogoText>
    </LogoContainer>
  );
};

export default Logo; 