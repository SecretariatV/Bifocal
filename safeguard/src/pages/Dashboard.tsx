import styled from '@emotion/styled'
import { useNavigate, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
`

const Sidebar = styled.nav`
  width: 250px;
  padding: 2rem;
  border-right: 1px solid #e2e8f0;
  background-color: #ffffff;
`

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
`

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`

const NavItem = styled.div<{ active?: boolean }>`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  background-color: ${props => props.active ? '#f1f5f9' : 'transparent'};

  &:hover {
    background-color: #f1f5f9;
    color: #3b82f6;
  }
`

const Contact = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`

const RiskIndicator = styled.div<{ risk: 'low' | 'medium' | 'high' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 1rem;
  background-color: ${props => 
    props.risk === 'low' ? '#22c55e' : 
    props.risk === 'medium' ? '#eab308' : 
    '#ef4444'
  };
`

const mockData = [
  { name: 'Mon', frequency: 24 },
  { name: 'Tue', frequency: 18 },
  { name: 'Wed', frequency: 30 },
  { name: 'Thu', frequency: 15 },
  { name: 'Fri', frequency: 28 },
  { name: 'Sat', frequency: 12 },
  { name: 'Sun', frequency: 20 },
]

const mockContacts = [
  { id: 1, name: 'John Doe', risk: 'low' },
  { id: 2, name: 'Jane Smith', risk: 'medium' },
  { id: 3, name: 'Alice Johnson', risk: 'high' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <Container>
      <Sidebar>
        <NavItem 
          active={currentPath === '/dashboard'} 
          onClick={() => handleNavigation('/dashboard')}
        >
          Dashboard
        </NavItem>
        <NavItem 
          active={currentPath === '/contacts'} 
          onClick={() => handleNavigation('/contacts')}
        >
          Contacts
        </NavItem>
        <NavItem 
          active={currentPath === '/analysis'} 
          onClick={() => handleNavigation('/analysis')}
        >
          Analysis
        </NavItem>
        <NavItem 
          active={currentPath === '/settings'} 
          onClick={() => handleNavigation('/settings')}
        >
          Settings
        </NavItem>
      </Sidebar>
      <MainContent>
        <Content>
          <h1>Message Frequency</h1>
          <BarChart width={1200} height={300} data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="#3b82f6" />
          </BarChart>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>Contacts</h2>
            {mockContacts.map(contact => (
              <Contact 
                key={contact.id} 
                onClick={() => navigate(`/contact/${contact.id}`)}
              >
                <RiskIndicator risk={contact.risk as 'low' | 'medium' | 'high'} />
                {contact.name}
              </Contact>
            ))}
          </div>
        </Content>
      </MainContent>
    </Container>
  )
}

export default Dashboard 