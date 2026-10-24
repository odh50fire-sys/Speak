import React, { useState, useEffect } from 'react';
import type { Persona, Situation, DifficultyLevel, ThemeId, ChatMessage, ReviewFeedback, ScreenMode } from './types';
import { PERSONAS } from './data/personas';
import { SITUATIONS } from './data/situations';
import { speechService } from './services/speech';
import { aiService } from './services/ai';
import { LobbyScreen } from './components/LobbyScreen';
import { ChatScreen } from './components/ChatScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  // 화면 모드: 'lobby' (시작화면) | 'chat' (대화창) | 'review' (카드넘김 결과화면)
  const [screenMode, setScreenMode] = useState<ScreenMode>('lobby');

  // 테마 & 난이도
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('cheese');
  const [level, setLevel] = useState<DifficultyLevel>(2);

  // 대화 페르소나 & 상황
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]);
  const [currentSituation, setCurrentSituation] = useState<Situation>(SITUATIONS[0]);

  // 대화 메시지 및 AI 상태
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // 복기 피드백 결과 데이터
  const [reviewFeedback, setReviewFeedback] = useState<ReviewFeedback | null>(null);

  // 설정 모달
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 테마 변경 시 document 속성 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // 대화 시작하기 (Lobby -> Chat)
  const handleStartChat = () => {
    speechService.stopSpeaking();
    speechService.stopListening();

    const initialMsg: ChatMessage = {
      id: `init-${Date.now()}`,
      sender: 'ai',
      text: currentSituation.firstTurnPrompt,
      timestamp: Date.now()
    };

    setMessages([initialMsg]);
    setScreenMode('chat');

    // 0.3초 후 AI 첫 질문 발화
    setTimeout(() => {
      setIsAiSpeaking(true);
      speechService.speak(
        currentSituation.firstTurnPrompt,
        currentPersona.voiceGender,
        currentPersona.voicePitch,
        currentPersona.voiceRate,
        () => setIsAiSpeaking(false)
      );
    }, 300);
  };

  // 유저 메시지 전송 처리
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsAiThinking(true);

    try {
      const replyText = await aiService.generateNextResponse(
        currentPersona,
        currentSituation,
        level,
        updatedMessages,
        false
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: Date.now()
      };

      setMessages([...updatedMessages, aiMsg]);
      setIsAiThinking(false);

      // AI 음성 발화
      setIsAiSpeaking(true);
      speechService.speak(
        replyText,
        currentPersona.voiceGender,
        currentPersona.voicePitch,
        currentPersona.voiceRate,
        () => setIsAiSpeaking(false)
      );
    } catch (err) {
      console.error(err);
      setIsAiThinking(false);
    }
  };

  // 대화 마무리 (Chat -> Review)
  const handleEndConversation = async () => {
    setIsAiThinking(true);
    speechService.stopListening();

    try {
      const farewellText = await aiService.generateNextResponse(
        currentPersona,
        currentSituation,
        level,
        messages,
        true
      );

      const farewellMsg: ChatMessage = {
        id: `farewell-${Date.now()}`,
        sender: 'ai',
        text: farewellText,
        timestamp: Date.now()
      };

      const finalMessages = [...messages, farewellMsg];
      setMessages(finalMessages);
      setIsAiThinking(false);

      // 작별 인사 발화 후 결과 화면으로 전환
      setIsAiSpeaking(true);
      speechService.speak(
        farewellText,
        currentPersona.voiceGender,
        currentPersona.voicePitch,
        currentPersona.voiceRate,
        async () => {
          setIsAiSpeaking(false);
          const feedback = await aiService.generateReview(finalMessages, currentSituation, currentPersona);
          setReviewFeedback(feedback);
          setScreenMode('review');
        }
      );
    } catch (err) {
      console.error(err);
      setIsAiThinking(false);
      const feedback = await aiService.generateReview(messages, currentSituation, currentPersona);
      setReviewFeedback(feedback);
      setScreenMode('review');
    }
  };

  // 같은 상황 다시 연습 (Review -> Chat)
  const handleRestartChat = () => {
    handleStartChat();
  };

  // 홈으로 이동 (Chat/Review -> Lobby)
  const handleGoHome = () => {
    speechService.stopSpeaking();
    speechService.stopListening();
    setScreenMode('lobby');
  };

  // 유저 직접 커스텀 색상 지정
  const handleCustomColorChange = (bgColor: string, accentColor: string) => {
    document.documentElement.style.setProperty('--bg-main', bgColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--accent-hover', accentColor);
  };

  return (
    <main className="h-[100dvh] max-h-[100dvh] w-screen overflow-hidden flex flex-col p-2.5 sm:p-4 select-none transition-colors">
      {/* 1. 시작 화면 (Lobby) */}
      {screenMode === 'lobby' && (
        <LobbyScreen
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          selectedPersona={currentPersona}
          onSelectPersona={setCurrentPersona}
          selectedSituation={currentSituation}
          onSelectSituation={setCurrentSituation}
          level={level}
          onLevelChange={setLevel}
          onStartChat={handleStartChat}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      )}

      {/* 2. 대화 화면 (Chat) - 스크롤 프리 전체화면 */}
      {screenMode === 'chat' && (
        <ChatScreen
          persona={currentPersona}
          situation={currentSituation}
          level={level}
          messages={messages}
          onSendMessage={handleSendMessage}
          onEndConversation={handleEndConversation}
          onGoHome={handleGoHome}
          isAiThinking={isAiThinking}
          isAiSpeaking={isAiSpeaking}
        />
      )}

      {/* 3. 결과 복기 화면 (Review) - 3단계 카드 넘김 스와이퍼 */}
      {screenMode === 'review' && reviewFeedback && (
        <ReviewScreen
          feedback={reviewFeedback}
          persona={currentPersona}
          situation={currentSituation}
          onRestart={handleRestartChat}
          onGoHome={handleGoHome}
        />
      )}

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onCustomColorChange={handleCustomColorChange}
      />
    </main>
  );
};

export default App;
