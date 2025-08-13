import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SpeechRecognizer = ({ onTextReceived, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt'); // 'granted', 'denied', 'prompt'
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Check browser support and permissions on mount
  useEffect(() => {
    const checkSupport = async () => {
      // Check if speech recognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        setError('Speech recognition is not supported in this browser');
        return;
      }

      setIsSupported(true);

      // Check microphone permissions
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' });
          setPermissionState(permission.state);
          
          // Listen for permission changes
          permission.onchange = () => {
            setPermissionState(permission.state);
          };
        }
      } catch (err) {
        console.warn('Could not check microphone permissions:', err);
      }
    };

    checkSupport();
  }, []);

  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      toast.info('Listening... Speak now');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && onTextReceived) {
        onTextReceived(finalTranscript.trim());
        toast.success('Speech recognized successfully');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError(event.error);

      switch (event.error) {
        case 'not-allowed':
          setPermissionState('denied');
          toast.error('Microphone access denied. Please enable microphone permissions and try again.');
          break;
        case 'no-speech':
          toast.warning('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          toast.error('Microphone not found or not working.');
          break;
        case 'network':
          toast.error('Network error occurred during speech recognition.');
          break;
        case 'service-not-allowed':
          toast.error('Speech recognition service not allowed.');
          break;
        case 'aborted':
          toast.info('Speech recognition aborted.');
          break;
        default:
          toast.error(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, [isSupported, onTextReceived]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    if (permissionState === 'denied') {
      toast.error('Microphone access is denied. Please enable microphone permissions in your browser settings.');
      return;
    }

    if (isListening) return;

    try {
      // Request microphone permission if not already granted
      if (permissionState !== 'granted') {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setPermissionState('granted');
        } catch (permissionError) {
          console.error('Microphone permission error:', permissionError);
          setPermissionState('denied');
          toast.error('Microphone access denied. Please enable microphone permissions and try again.');
          return;
        }
      }

      const recognition = initializeRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast.error('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [isSupported, permissionState, isListening, initializeRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Speech recognition stopped');
    }
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const getButtonText = () => {
    if (!isSupported) return 'Not Supported';
    if (permissionState === 'denied') return 'Permission Denied';
    if (isListening) return 'Listening...';
    return 'Start Recording';
  };

  const getButtonVariant = () => {
    if (!isSupported || permissionState === 'denied') return 'outline';
    if (isListening) return 'destructive';
    return 'default';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={isListening ? stopListening : startListening}
        disabled={!isSupported || permissionState === 'denied'}
        variant={getButtonVariant()}
        size="sm"
        className={`flex items-center gap-2 transition-all duration-200 ${
          isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : ''
        }`}
      >
        <ApperIcon 
          name={isListening ? "square" : "mic"} 
          className="w-4 h-4" 
        />
        {getButtonText()}
      </Button>
      
      {error && permissionState === 'denied' && (
        <Button
          onClick={() => {
            toast.info('Please enable microphone permissions in your browser settings and reload the page.');
          }}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
        >
          <ApperIcon name="info" className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SpeechRecognizer;