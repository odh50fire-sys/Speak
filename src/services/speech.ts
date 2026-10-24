// Web Speech API Wrapper for Browser STT and TTS

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false; // 한 턴 단위로 인식
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US'; // 영어 인식
      }

      this.loadVoices();
      if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  public isSupported(): { stt: boolean; tts: boolean } {
    const hasWindow = typeof window !== 'undefined';
    return {
      stt: hasWindow && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      tts: hasWindow && !!window.speechSynthesis
    };
  }

  // 음성 인식 시작 (STT)
  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError(new Error('Speech Recognition is not supported in this browser.'));
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      onResult(text, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      this.isListening = false;
      onError(e);
    }
  }

  // 음성 인식 중지
  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // 텍스트를 음성으로 재생 (TTS)
  public speak(
    text: string,
    gender: 'female' | 'male' = 'female',
    pitch: number = 1.0,
    rate: number = 1.0,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // 이전 재생 취소

    const cleanText = text.replace(/[*_#`~]/g, ''); // 마크다운 기호 제거
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.pitch = pitch;
    utterance.rate = rate;

    // 자연스러운 영어 보이스 매칭 시도
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice = englishVoices.find(v => {
      const name = v.name.toLowerCase();
      if (gender === 'female') {
        return name.includes('samantha') || name.includes('zira') || name.includes('google us english') || name.includes('female');
      } else {
        return name.includes('david') || name.includes('daniel') || name.includes('guy') || name.includes('male');
      }
    }) || englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  }

  // TTS 정지
  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
