import React, { useState, useEffect, useRef } from 'react';
import type { Persona, Situation, DifficultyLevel, ChatMessage, HintOption } from '../types';
import { speechService } from '../services/speech';
import { aiService } from '../services/ai';
import { Mic, MicOff, Send, Volume2, HelpCircle, RefreshCw, LogOut, Sparkles, Keyboard, Home } from 'lucide-react';

interface ChatScreenProps {
  persona: Persona;
  situation: Situation;
  level: DifficultyLevel;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onEndConversation: () => void;
  onGoHome: () => void;
  isAiThinking: boolean;
  isAiSpeaking: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  persona,
  situation,
  level,
  messages,
  onSendMessage,
  onEndConversation,
  onGoHome,
  isAiThinking,
  isAiSpeaking
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [hints, setHints] = useState<HintOption[]>([]);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 항상 최하단으로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking, interimText]);

  // 마이크 토글
  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.stopSpeaking();
      setInterimText('');
      setIsListening(true);

      speechService.startListening(
        (text, isFinal) => {
          setInterimText(text);
          if (isFinal && text.trim().length > 0) {
            setIsListening(false);
            setInterimText('');
            onSendMessage(text);
          }
        },
        (err) => {
          console.warn('Speech Error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // 텍스트 직접 전송
  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;
    const msg = typedText;
    setTypedText('');
    onSendMessage(msg);
  };

  // 힌트 요청
  const handleRequestHint = async () => {
    const lastAiMsg = [...messages].reverse().find(m => m.sender === 'ai')?.text || situation.firstTurnPrompt;
    setIsHintLoading(true);
    try {
      const generated = await aiService.generateHints(persona, situation, lastAiMsg, level);
      setHints(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsHintLoading(false);
    }
  };

  // 힌트 문장 터치 시 자동 발화 또는 입력
  const handleSelectHint = (hintText: string) => {
    setHints([]);
    onSendMessage(hintText);
  };

  // 생존 영어: "다시 말해줘"
  const handleAskRepeat = () => {
    onSendMessage("Sorry, could you run that by me one more time?");
  };

  // AI 발화 다시 듣기
  const handleReplayVoice = (text: string) => {
    speechService.speak(text, persona.voiceGender, persona.voicePitch, persona.voiceRate);
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full justify-between gap-2.5 p-1">
      {/* 1. 상단 미니 컨트롤 바: 홈으로 + 캐릭터 프로필 + 대화 마무리 */}
      <div className="bg-white rounded-2xl comic-border-thick comic-shadow-sm px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="comic-btn bg-gray-100 hover:bg-gray-200 p-1.5 rounded-xl text-gray-700"
            title="시작 화면으로 돌아가기"
          >
            <Home className="w-4 h-4" />
          </button>

          <div
            className={`w-9 h-9 rounded-xl comic-border flex items-center justify-center text-xl shrink-0 transition-transform ${
              isAiSpeaking ? 'scale-110 rotate-3' : isAiThinking ? 'comic-float' : ''
            }`}
            style={{ backgroundColor: persona.avatarBg }}
          >
            {persona.emoji}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-gray-900">{persona.name}</h3>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full comic-border ${
                isAiSpeaking ? 'bg-green-300 animate-pulse' : isAiThinking ? 'bg-amber-300' : 'bg-gray-100'
              }`}>
                {isAiSpeaking ? '말하는 중 🗣️' : isAiThinking ? '생각 중 🤔' : '듣는 중 👂'}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 line-clamp-1">{situation.title}</p>
          </div>
        </div>

        {/* 대화 마무리 버튼 (소프트 엔딩) */}
        <button
          onClick={onEndConversation}
          className="comic-btn bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>대화 마무리 👋</span>
        </button>
      </div>

      {/* 2. 대화 말풍선 스크롤 영역 (이 안쪽만 스크롤됨) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 rounded-2xl bg-white/70 comic-border backdrop-blur-xs min-h-[220px]">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div className="flex items-end gap-1.5 max-w-[88%]">
                {isAi && (
                  <button
                    onClick={() => handleReplayVoice(msg.text)}
                    className="comic-btn bg-white p-1 rounded-full text-gray-700 shrink-0 hover:bg-amber-100"
                    title="다시 듣기"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}

                <div
                  className={`relative p-3 rounded-2xl comic-border text-xs sm:text-sm font-medium leading-relaxed ${
                    isAi
                      ? 'bg-[var(--bubble-ai)] text-gray-900 comic-shadow-sm rounded-tl-xs'
                      : 'bg-[var(--bubble-user)] text-gray-900 comic-shadow-sm rounded-tr-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI 타이핑/생각 중 애니메이션 */}
        {isAiThinking && (
          <div className="flex items-start gap-2">
            <div className="p-2.5 bg-[var(--bubble-ai)] comic-border rounded-2xl rounded-tl-xs comic-shadow-sm flex items-center gap-1.5">
              <span className="animate-bounce text-sm">💭</span>
              <span className="text-[11px] font-bold text-gray-700 animate-pulse">
                {persona.name} 답변 준비 중...
              </span>
            </div>
          </div>
        )}

        {/* 유저 실시간 발화 중간 텍스트 */}
        {interimText && (
          <div className="flex justify-end">
            <div className="p-2.5 bg-blue-50 comic-border rounded-2xl rounded-tr-xs border-dashed text-xs font-semibold text-blue-700 animate-pulse">
              "{interimText}..."
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. 실시간 힌트 팝업 (열렸을 때) */}
      {hints.length > 0 && (
        <div className="bg-white rounded-2xl comic-border-thick comic-shadow p-3 space-y-1.5 animate-in slide-in-from-bottom-2 shrink-0">
          <div className="flex items-center justify-between pb-1 border-b border-gray-200">
            <span className="font-bold text-[11px] text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 탭하면 바로 전송돼요:
            </span>
            <button
              onClick={() => setHints([])}
              className="text-xs font-bold text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {hints.map((h, i) => (
              <button
                key={i}
                onClick={() => handleSelectHint(h.english)}
                className="comic-btn bg-amber-50 hover:bg-amber-100 p-2 rounded-xl text-left flex flex-col"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-900">
                  <span>{h.label}</span>
                  <span className="text-gray-400 font-normal">탭해서 말하기 💬</span>
                </div>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{h.english}</p>
                <p className="text-[10px] text-gray-500">{h.korean}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. 빠른 힌트 & 생존영어 액션 바 */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={handleRequestHint}
          disabled={isHintLoading}
          className="comic-btn bg-yellow-300 hover:bg-yellow-400 text-gray-900 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isHintLoading ? '생각 중...' : '💡 힌트 보기'}</span>
        </button>

        <button
          onClick={handleAskRepeat}
          className="comic-btn bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>❓ 뭐라고? (다시 말해줘)</span>
        </button>
      </div>

      {/* 5. 하단 마이크 버튼 도크 (한눈에 쏙 들어오게 고정) */}
      <div className="bg-white rounded-2xl comic-border-thick comic-shadow p-2.5 flex flex-col gap-2 shrink-0">
        {showKeyboard ? (
          <form onSubmit={handleSendTyped} className="flex items-center gap-1.5">
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="영어로 직접 입력..."
              className="flex-1 bg-gray-100 comic-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              className="comic-btn bg-[var(--accent)] text-white p-2 rounded-xl font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowKeyboard(false)}
              className="comic-btn bg-gray-200 text-gray-700 p-2 rounded-xl"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowKeyboard(true)}
              className="comic-btn bg-gray-100 hover:bg-gray-200 p-2.5 rounded-xl text-gray-700"
              title="키보드 입력 전환"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* 메인 마이크 버튼 */}
            <button
              onClick={toggleListening}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 comic-btn select-none transition-all ${
                isListening
                  ? 'bg-rose-500 text-white mic-recording shadow-md'
                  : 'bg-[var(--accent)] text-white hover:opacity-95'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-spin" />
                  <span>듣고 있어요! 말씀하세요 🎙️</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>눌러서 영어로 말하기 (Touch to Speak)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
