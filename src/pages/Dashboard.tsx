import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`

const Sidebar = styled.nav`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  padding: 2rem;
`

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`

const NavItem = styled.div`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #64748b;

  &:hover {
    background-color: #f1f5f9;
    color: #3b82f6;
  }
`

const ContactList = styled.div`
  margin-top: 2rem;
`

const Contact = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

  return (
    <Container>
      <Sidebar>
        <NavItem>Dashboard</NavItem>
        <NavItem>Contacts</NavItem>
        <NavItem>Analysis</NavItem>
        <NavItem>Settings</NavItem>
      </Sidebar>
      <MainContent>
        <h1>Message Frequency</h1>
        <BarChart width={700} height={300} data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="frequency" fill="#3b82f6" />
        </BarChart>
        
        <ContactList>
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
        </ContactList>
      </MainContent>
    </Container>
  )
}

export default Dashboard 