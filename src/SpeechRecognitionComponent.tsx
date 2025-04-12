import React, { useState, useEffect, useRef } from 'react';

// Declare only once — safe and type-correct
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const SpeechRecognitionComponent: React.FC = () => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone permission was denied. Please enable it in your browser settings.');
      } else {
        alert(`Speech recognition error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStart = async () => {
    if (!recognitionRef.current || listening) return;

    try {
      const permission = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });

      if (permission.state === 'denied') {
        alert('Microphone access is denied. Please allow it in your browser settings.');
        return;
      }

      recognitionRef.current.start();
      setListening(true);
    } catch (err) {
      console.error('Start error:', err);
      alert('Failed to start speech recognition.');
    }
  };

  const handleStop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">🎙️ Speech to Text</h2>
      <textarea
        value={text}
        readOnly
        rows={6}
        className="w-full p-2 border rounded mb-4"
        placeholder="Your speech will appear here..."
      />
      <div className="flex justify-center gap-4">
        <button
          onClick={handleStart}
          disabled={listening}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Start Listening
        </button>
        <button
          onClick={handleStop}
          disabled={!listening}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Stop Listening
        </button>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
