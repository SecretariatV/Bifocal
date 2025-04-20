import styled from '@emotion/styled'

// Theme Colors
export const colors = {
  background: {
    primary: 'linear-gradient(to bottom, #1a1f36, #121629)',
    card: 'rgba(255, 255, 255, 0.03)',
    hover: 'rgba(255, 255, 255, 0.08)',
    active: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
  },
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.2)',
  },
  accent: {
    primary: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
    title: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
  },
  severity: {
    low: {
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
      color: '#4ade80',
      border: 'rgba(34, 197, 94, 0.2)',
    },
    medium: {
      bg: 'linear-gradient(135deg, rgba(255, 209, 102, 0.2) 0%, rgba(255, 209, 102, 0.1) 100%)',
      color: '#ffd166',
      border: 'rgba(255, 209, 102, 0.2)',
    },
    high: {
      bg: 'linear-gradient(135deg, rgba(239, 71, 111, 0.2) 0%, rgba(239, 71, 111, 0.1) 100%)',
      color: '#ef476f',
      border: 'rgba(239, 71, 111, 0.2)',
    },
  },
}

// Base Layout Components
export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

interface MainContentProps {
  sidebarOpen: boolean;
}

export const MainContent = styled.main<MainContentProps>`
  flex: 1;
  padding: 40px;
  padding-left: ${props => props.sidebarOpen ? '290px' : '40px'};
  background-color: #14161f;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  min-width: 0;
  transition: padding-left 0.3s ease;
`

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

// Typography Components
export const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: -0.02em;
`

export const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(to bottom, #3b82f6, #2563eb);
    border-radius: 2px;
    margin-right: 8px;
  }
`

// Card Components
export const Section = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`

// Message Components
export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
  padding: 0 16px;
`

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 70%;
  
  &[data-type="received"] {
    align-self: flex-start;
  }
  
  &[data-type="sent"] {
    align-self: flex-end;
  }
`

export const MessageBubble = styled.div<{ type: 'sent' | 'received'; isSelected?: boolean }>`
  padding: 20px 24px;
  border-radius: 16px;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  ${props => props.type === 'sent' ? `
    background: ${colors.accent.primary};
    color: white;
    border-bottom-right-radius: 4px;
    margin-left: auto;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 20px;
      height: 20px;
      background: ${colors.accent.primary};
      clip-path: polygon(0 0, 0% 100%, 100% 100%);
    }

    ${props.isSelected && `
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 8px 20px rgba(37, 99, 235, 0.4);
      transform: scale(1.02);

      &:before {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      }
    `}
  ` : `
    background: ${colors.background.card};
    color: #fff;
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 20px;
      height: 20px;
      background: ${colors.background.card};
      clip-path: polygon(0 100%, 100% 100%, 100% 0);
    }

    ${props.isSelected && `
      background: ${colors.background.active};
      box-shadow: 0 0 0 3px ${colors.border.hover}, 0 8px 20px rgba(0, 0, 0, 0.3);
      transform: scale(1.02);

      &:before {
        background: ${colors.background.active};
      }
    `}
  `}

  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: ${props => 
      props.type === 'sent'
      ? '0 8px 20px rgba(59, 130, 246, 0.4)'
      : '0 8px 20px rgba(0, 0, 0, 0.3)'
    };
  }

  &:active {
    transform: scale(0.98);
  }
`

export const MessageTime = styled.div`
  font-size: 12px;
  color: ${colors.text.secondary};
  margin-top: 4px;
  padding: 0 8px;
  text-align: right;
  font-weight: 500;
`

// Severity Components
export const SeverityLevel = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  ${props => {
    const severityColor = colors.severity[props.level];
    return `
      background: ${severityColor.bg};
      color: ${severityColor.color};
      border: 1px solid ${severityColor.border};
      box-shadow: 0 2px 8px ${severityColor.border};
    `;
  }}
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`

export const SeverityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

export const SeverityIndicator = styled.div<{ active?: boolean }>`
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  background: ${props => props.active ? colors.background.active : colors.background.card};
  border: 1px solid ${props => props.active ? colors.border.hover : colors.border.primary};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.background.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`

export const SeverityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`

export const SeverityDescription = styled.p`
  color: ${colors.text.secondary};
  font-size: 14px;
  line-height: 1.6;
`

// Stats Components
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
`

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const StatLabel = styled.div`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`