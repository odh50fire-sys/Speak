import React, { useState, useEffect } from 'react';
import type { Persona, Situation, DifficultyLevel, ThemeId, ChatMessage, ReviewFeedback } from './types';
import { PERSONAS } from './data/personas';
import { SITUATIONS } from './data/situations';
import { speechService } from './services/speech';
import { aiService } from './services/ai';
import { Header } from './components/Header';
import { ChatScreen } from './components/ChatScreen';
import { SituationModal } from './components/SituationModal';
import { ReviewModal } from './components/ReviewModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  // 테마 상태
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('cheese');
  const [level, setLevel] = useState<DifficultyLevel>(2);

  // 대화 페르소나 & 상황 상태
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]);
  const [currentSituation, setCurrentSituation] = useState<Situation>(SITUATIONS[0]);

  // 대화 메시지 상태
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // 모달 상태
  const [isSituationModalOpen, setIsSituationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<ReviewFeedback | null>(null);

  // 테마 변경 시 document 속성 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // 상황 또는 페르소나 변경 시 첫 화두로 초기화
  useEffect(() => {
    resetConversation(currentSituation, currentPersona);
  }, [currentSituation, currentPersona]);

  // 대화 초기화 함수
  const resetConversation = (situation: Situation, persona: Persona) => {
    speechService.stopSpeaking();
    speechService.stopListening();

    const initialMsg: ChatMessage = {
      id: 'init-1',
      sender: 'ai',
      text: situation.firstTurnPrompt,
      timestamp: Date.now()
    };

    setMessages([initialMsg]);
    setIsReviewModalOpen(false);
    setReviewFeedback(null);

    // AI 첫 인사 음성으로 읽어주기 (딜레이 살짝 두고 자연스럽게)
    setTimeout(() => {
      setIsAiSpeaking(true);
      speechService.speak(
        situation.firstTurnPrompt,
        persona.voiceGender,
        persona.voicePitch,
        persona.voiceRate,
        () => setIsAiSpeaking(false)
      );
    }, 400);
  };

  // 유저 메시지 전송 처리
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. 유저 메시지 추가
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
      // 2. AI 다음 응답 생성
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

      // 3. AI 응답 음성 재생
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

  // 소프트 엔딩: "대화 마무리" 버튼 클릭 시
  const handleEndConversation = async () => {
    setIsAiThinking(true);
    speechService.stopListening();

    try {
      // AI의 자연스러운 작별 마무리 멘트 생성
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

      // 마무리 음성 재생
      setIsAiSpeaking(true);
      speechService.speak(
        farewellText,
        currentPersona.voiceGender,
        currentPersona.voicePitch,
        currentPersona.voiceRate,
        async () => {
          setIsAiSpeaking(false);
          // 음성이 끝나면 복기 리포트 생성 및 모달 팝업
          const feedback = await aiService.generateReview(finalMessages, currentSituation, currentPersona);
          setReviewFeedback(feedback);
          setIsReviewModalOpen(true);
        }
      );
    } catch (err) {
      console.error(err);
      setIsAiThinking(false);
      const feedback = await aiService.generateReview(messages, currentSituation, currentPersona);
      setReviewFeedback(feedback);
      setIsReviewModalOpen(true);
    }
  };

  // 유저 직접 DIY 컬러 변경
  const handleCustomColorChange = (bgColor: string, accentColor: string) => {
    document.documentElement.style.setProperty('--bg-main', bgColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--accent-hover', accentColor);
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none transition-colors">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-3 sm:gap-4">
        {/* 상단 헤더 도크 */}
        <Header
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          level={level}
          onLevelChange={setLevel}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenSituationModal={() => setIsSituationModalOpen(true)}
          situationTitle={currentSituation.title}
        />

        {/* 메인 대화 화면 */}
        <ChatScreen
          persona={currentPersona}
          situation={currentSituation}
          level={level}
          messages={messages}
          onSendMessage={handleSendMessage}
          onEndConversation={handleEndConversation}
          isAiThinking={isAiThinking}
          isAiSpeaking={isAiSpeaking}
        />
      </div>

      {/* 상황 & 페르소나 선택 모달 */}
      <SituationModal
        isOpen={isSituationModalOpen}
        onClose={() => setIsSituationModalOpen(false)}
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        currentSituation={currentSituation}
        onSelectSituation={setCurrentSituation}
      />

      {/* 대화 복기 & 팡파레 리포트 모달 */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        feedback={reviewFeedback}
        persona={currentPersona}
        situation={currentSituation}
        onRestart={() => resetConversation(currentSituation, currentPersona)}
        onNewSituation={() => {
          setIsReviewModalOpen(false);
          setIsSituationModalOpen(true);
        }}
      />

      {/* 환경설정 및 컬러 피커 모달 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onCustomColorChange={handleCustomColorChange}
      />
    </div>
  );
};

export default App;
