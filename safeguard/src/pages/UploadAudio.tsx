import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1f36 0%, #121629 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #f8fafc;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const UploadArea = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#60a5fa' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  background: ${props => props.isDragging ? 'rgba(96, 165, 250, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    border-color: #60a5fa;
    background: rgba(96, 165, 250, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #60a5fa;
`;

const UploadText = styled.div`
  color: #f8fafc;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
`;

const FileInput = styled.input`
  display: none;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f8fafc;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const UploadAudio: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      // TODO: Implement actual file upload logic
      console.log('Uploading file:', selectedFile);
      // After successful upload, navigate to analysis page
      navigate('/analysis');
    }
  }, [selectedFile, navigate]);

  return (
    <Container>
      <Content>
        <Title>Upload Audio</Title>
        <Description>
          Upload a voice recording or voicemail to analyze for behavioral patterns.
          We'll transcribe and analyze it for signs of manipulation, gaslighting, or obsessive speech.
        </Description>

        <UploadArea
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <UploadIcon>🎙️</UploadIcon>
          <UploadText>
            {selectedFile ? selectedFile.name : 'Drag & drop your audio file here'}
          </UploadText>
          <UploadSubtext>
            {selectedFile 
              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
              : 'or click to browse files (MP3, WAV, M4A)'}
          </UploadSubtext>
          <FileInput
            id="file-input"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
          />
        </UploadArea>

        <ButtonContainer>
          <BackButton onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </BackButton>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Analyze Audio
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default UploadAudio; 