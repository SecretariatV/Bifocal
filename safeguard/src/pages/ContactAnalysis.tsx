import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #14161f;
  position: relative;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
`

const ContactAnalysis = () => {
  const { id } = useParams()
  return (
    <Container>
      <Content>
        Loading contact details...
      </Content>
    </Container>
  )
}

export default ContactAnalysis