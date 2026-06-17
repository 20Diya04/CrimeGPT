import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHook {
  recording: boolean;
  supported: boolean;
  error: string | null;
  toggle: () => void;
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
  languageOptions: { code: string; name: string; flag: string; nativeName: string }[];
}

const languageOptions = [
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'en-IN', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
];

export function useSpeechRecognition(
  onResult: (text: string, isFinal: boolean) => void
): SpeechRecognitionHook {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('gu-IN');
  const recognitionRef = useRef<any>(null);

  const changeLanguage = useCallback((langCode: string) => {
    setCurrentLanguage(langCode);
    setError(null);
    if (recording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.lang = langCode;
            recognitionRef.current.start();
          }
        }, 100);
      } catch (err) {}
    } else if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  }, [recording]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLanguage;

      recognition.onstart = () => {
        setRecording(true);
        setError(null);
      };

      recognition.onend = () => {
        setRecording(false);
      };

      recognition.onresult = (event: any) => {
        let finalText = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalText += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }

        if (interimText) {
          onResult(interimText, false);
        }
        if (finalText) {
          onResult(finalText, true);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try speaking again.');
        } else {
          setError(`Error: ${event.error}`);
        }
        setRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSupported(false);
      setError('Speech recognition not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [currentLanguage, onResult]);

  const toggle = () => {
    if (!recognitionRef.current) return;

    if (recording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    } else {
      try {
        setError(null);
        recognitionRef.current.lang = currentLanguage;
        recognitionRef.current.start();
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone permissions.');
        } else {
          setError('Could not start speech recognition. Please try again.');
        }
      }
    }
  };

  return {
    recording,
    supported,
    error,
    toggle,
    currentLanguage,
    changeLanguage,
    languageOptions,
  };
}
