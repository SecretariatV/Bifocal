import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

// Add type declarations at the top of the file
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 20px;
`;

const RecordButton = styled.button<{ isRecording: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.isRecording ? '#ef4444' : '#3b82f6'};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Timer = styled.div`
  font-size: 1.2rem;
  color: #fff;
  margin-top: 10px;
`;

const TranscriptContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TranscriptText = styled.p`
  color: #fff;
  line-height: 1.6;
  margin: 0;
`;

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerInterval = useRef<number | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.webkitSpeechRecognition) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();

      // Start speech recognition
      if (recognition.current) {
        setTranscript(''); // Clear previous transcript
        recognition.current.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      stopTimer();
      
      // Stop speech recognition
      if (recognition.current) {
        recognition.current.stop();
      }

      // Stop all audio tracks
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerInterval.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Here you would typically send the audio to a speech-to-text service
      // For now, we'll use a placeholder message
      setTranscript("Transcription in progress... This feature will be connected to a speech-to-text service.");
      
      // Example of how to implement with a real service:
      // const formData = new FormData();
      // formData.append('audio', audioBlob);
      // const response = await fetch('/api/transcribe', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // setTranscript(data.transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscript('Error transcribing audio. Please try again.');
    }
  };

  return (
    <RecorderContainer>
      <RecordButton
        isRecording={isRecording}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? '⬛' : '⏺'}
      </RecordButton>
      
      {isRecording && (
        <Timer>{formatTime(recordingTime)}</Timer>
      )}

      {transcript && (
        <TranscriptContainer>
          <TranscriptText>{transcript}</TranscriptText>
        </TranscriptContainer>
      )}
    </RecorderContainer>
  );
};

export default AudioRecorder; 