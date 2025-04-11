import { useState, useEffect, useCallback } from 'react';

// Define TypeScript interfaces for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onError?: (error: Error) => void;
  onEnd?: () => void;
  language?: string;
}

export function useSpeechRecognition({
  onResult,
  onError,
  onEnd,
  language = 'en-US',
}: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (onError) {
        onError(new Error('Speech recognition is not supported in this browser.'));
      }
      return;
    }

    // Create speech recognition instance
    const SpeechRecognitionAPI = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor;
    const recognitionInstance = new SpeechRecognitionAPI();

    // Configure recognition
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    // Set up event handlers
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(currentTranscript);
      if (onResult) {
        onResult(currentTranscript);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (onError) {
        onError(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (onEnd) {
        onEnd();
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language, onResult, onError, onEnd]);

  const startListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      setIsListening(false);
    }
  }, [recognition, onError]);

  const stopListening = useCallback(() => {
    if (!recognition) return;

    recognition.stop();
    setIsListening(false);
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
}

// Add TypeScript definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}
