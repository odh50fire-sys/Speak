import React, { useState, useEffect, useRef } from 'react';
import type { Persona, Situation, DifficultyLevel, ChatMessage, HintOption } from '../types';
import { speechService } from '../services/speech';
import { aiService } from '../services/ai';
import { Mic, MicOff, Send, Volume2, HelpCircle, RefreshCw, LogOut, ChevronDown, ChevronUp, Sparkles, Keyboard } from 'lucide-react';

interface ChatScreenProps {
  persona: Persona;
  situation: Situation;
  level: DifficultyLevel;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onEndConversation: () => void;
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
  isAiThinking,
  isAiSpeaking
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [hints, setHints] = useState<HintOption[]>([]);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

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
    <div className="flex flex-col flex-1 h-full max-w-2xl mx-auto w-full gap-3">
      {/* 1. 상단 상황 및 캐릭터 상태 카드 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl comic-border flex items-center justify-center text-3xl shrink-0 transition-transform ${
              isAiSpeaking ? 'scale-110 rotate-3' : isAiThinking ? 'comic-float' : ''
            }`}
            style={{ backgroundColor: persona.avatarBg }}
          >
            {persona.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-gray-900">{persona.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full comic-border ${
                isAiSpeaking ? 'bg-green-300 animate-pulse' : isAiThinking ? 'bg-amber-300' : 'bg-gray-100'
              }`}>
                {isAiSpeaking ? '말하는 중 🗣️' : isAiThinking ? '생각하는 중 🤔' : '듣는 중 👂'}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-1">{situation.title}</p>
          </div>
        </div>

        {/* 퀘스트 토글 버튼 */}
        <button
          onClick={() => setShowQuests(!showQuests)}
          className="comic-btn bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 text-gray-800"
        >
          <span>🎯 미션</span>
          {showQuests ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 미션 아코디언 드롭다운 */}
      {showQuests && (
        <div className="bg-amber-100/90 rounded-2xl comic-border p-3 text-xs space-y-1.5 animate-in slide-in-from-top-2">
          <p className="font-bold text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 이번 대화의 비밀 미션 (선택):
          </p>
          {situation.hiddenQuests.map((quest, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-gray-700 font-medium">
              <span className="w-4 h-4 rounded-full bg-white comic-border flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              <span>{quest}</span>
            </div>
          ))}
        </div>
      )}

      {/* 2. 대화 말풍선 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-2xl bg-white/70 comic-border min-h-[340px] max-h-[55vh] backdrop-blur-xs">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div className="flex items-end gap-1.5 max-w-[85%]">
                {isAi && (
                  <button
                    onClick={() => handleReplayVoice(msg.text)}
                    className="comic-btn bg-white p-1.5 rounded-full text-gray-700 shrink-0 hover:bg-amber-100"
                    title="다시 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  className={`relative p-3.5 rounded-2xl comic-border text-sm sm:text-base font-medium leading-relaxed ${
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
            <div className="p-3 bg-[var(--bubble-ai)] comic-border rounded-2xl rounded-tl-xs comic-shadow-sm flex items-center gap-2">
              <span className="animate-bounce">💭</span>
              <span className="text-xs font-bold text-gray-700 animate-pulse">
                {persona.name} 생각 중...
              </span>
            </div>
          </div>
        )}

        {/* 유저가 말하고 있는 실시간 중간 텍스트 */}
        {interimText && (
          <div className="flex justify-end">
            <div className="p-3 bg-blue-50 comic-border rounded-2xl rounded-tr-xs border-dashed text-sm font-semibold text-blue-700 animate-pulse">
              "{interimText}..."
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. 실시간 힌트 팝업 (열렸을 때) */}
      {hints.length > 0 && (
        <div className="bg-white rounded-2xl comic-border-thick comic-shadow p-3.5 space-y-2 animate-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between pb-1 border-b border-gray-200">
            <h4 className="font-bold text-xs text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 마음에 드는 힌트를 터치하면 바로 대답해요!
            </h4>
            <button
              onClick={() => setHints([])}
              className="text-xs font-bold text-gray-400 hover:text-gray-700"
            >
              닫기 ✕
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {hints.map((h, i) => (
              <button
                key={i}
                onClick={() => handleSelectHint(h.english)}
                className="comic-btn bg-amber-50 hover:bg-amber-100 p-2.5 rounded-xl text-left flex flex-col"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span>{h.label}</span>
                  <span className="text-gray-400 font-normal">탭해서 말하기 💬</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{h.english}</p>
                <p className="text-xs text-gray-500">{h.korean}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. 빠른 액션 바 (힌트 / 다시말해줘 / 대화종료) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestHint}
            disabled={isHintLoading}
            className="comic-btn bg-yellow-300 hover:bg-yellow-400 text-gray-900 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isHintLoading ? '힌트 찾는 중...' : '💡 힌트 보기'}</span>
          </button>

          <button
            onClick={handleAskRepeat}
            className="comic-btn bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5"
            title="다시 말해달라고 요청"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>❓ 뭐라고?</span>
          </button>
        </div>

        {/* 대화 마무리 버튼 (소프트 엔딩) */}
        <button
          onClick={onEndConversation}
          className="comic-btn bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5"
          title="자연스럽게 대화 끝내기"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>👋 대화 마무리</span>
        </button>
      </div>

      {/* 5. 음성 마이크 및 텍스트 입력 영역 (모바일 최적화) */}
      <div className="bg-white rounded-3xl comic-border-thick comic-shadow p-3 flex flex-col gap-2">
        {showKeyboard ? (
          <form onSubmit={handleSendTyped} className="flex items-center gap-2">
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="영어로 직접 입력해보세요..."
              className="flex-1 bg-gray-100 comic-border rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              className="comic-btn bg-[var(--accent)] text-white p-2.5 rounded-xl font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowKeyboard(false)}
              className="comic-btn bg-gray-200 text-gray-700 p-2.5 rounded-xl"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowKeyboard(true)}
              className="comic-btn bg-gray-100 hover:bg-gray-200 p-3 rounded-2xl text-gray-700"
              title="키보드로 직접 입력"
            >
              <Keyboard className="w-5 h-5" />
            </button>

            {/* 메인 만화풍 마이크 버튼 */}
            <button
              onClick={toggleListening}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 comic-btn select-none transition-all ${
                isListening
                  ? 'bg-rose-500 text-white mic-recording shadow-lg'
                  : 'bg-[var(--accent)] text-white hover:opacity-95'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-spin" />
                  <span>듣고 있어요! 말씀하세요 🎙️</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
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
