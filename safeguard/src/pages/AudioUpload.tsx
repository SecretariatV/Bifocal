import React, { useState, useCallback, HTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import AudioRecorder from '../components/AudioRecorder';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #14161f;
  min-height: 100vh;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  max-width: 600px;
  margin-bottom: 2rem;
`;

interface UploadAreaProps extends HTMLAttributes<HTMLDivElement> {
  isDragging?: boolean;
}

const UploadArea = styled.div<UploadAreaProps>`
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  border: 2px dashed ${props => props.isDragging ? '#3b82f6' : '#4a5568'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-bottom: 2rem;
  background: ${props => props.isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const SupportedFormats = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
`;

const OrDivider = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: rgba(255, 255, 255, 0.4);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }

  span {
    padding: 0 1rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
  }
`;

const LabelButton = styled.label`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  display: inline-block;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const AudioUpload = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      setSelectedFile(audioFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleAnalyze = () => {
    // Here you would typically process the file
    // For now, we'll just go back to dashboard
    navigate('/dashboard');
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </BackButton>
      <Title>Upload Audio</Title>
      <Description>
        Upload a voice recording or voicemail to analyze for behavioral patterns. We'll
        transcribe and analyze it for signs of manipulation, gaslighting, or obsessive
        speech.
      </Description>

      <UploadArea
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        isDragging={isDragging}
      >
        <Icon>🎙️</Icon>
        <UploadText>Drag and drop your audio file here</UploadText>
        <SupportedFormats>Supported formats: MP3, WAV, M4A</SupportedFormats>
        <input
          type="file"
          id="audio-upload"
          accept="audio/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <LabelButton htmlFor="audio-upload">
          Browse Files
        </LabelButton>
        {selectedFile && (
          <p style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Selected: {selectedFile.name}
          </p>
        )}
      </UploadArea>

      <OrDivider>
        <span>or record directly</span>
      </OrDivider>

      <AudioRecorder />

      <Button
        onClick={handleAnalyze}
        disabled={!selectedFile}
        style={{ marginTop: '2rem' }}
      >
        Analyze Audio
      </Button>
    </Container>
  );
};

export default AudioUpload; 