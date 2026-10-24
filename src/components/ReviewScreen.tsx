import React, { useState, useEffect } from 'react';
import type { ReviewFeedback, Persona, Situation } from '../types';
import { speechService } from '../services/speech';
import confetti from 'canvas-confetti';
import { Trophy, MessageCircle, Sparkles, Volume2, ArrowLeft, ArrowRight, RotateCcw, Home, CheckCircle2 } from 'lucide-react';

interface ReviewScreenProps {
  feedback: ReviewFeedback;
  persona: Persona;
  situation: Situation;
  onRestart: () => void;
  onGoHome: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  feedback,
  persona,
  situation,
  onRestart,
  onGoHome
}) => {
  // 3단계 카드 넘김 상태: 1 = 종합 스코어, 2 = 문장 교정, 3 = 핵심 표현 & 마무리
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    // 팡파레 효과 1회 실행
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  }, []);

  const playVoice = (text: string) => {
    speechService.speak(text, 'female', 1.0, 1.0);
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full justify-between gap-3 p-1">
      {/* 1. 상단 인디케이터 바: [홈으로] 버튼 상시 노출 */}
      <div className="bg-white rounded-2xl comic-border-thick comic-shadow-sm px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="comic-btn bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
            title="시작 화면(홈)으로 이동"
          >
            <Home className="w-3.5 h-3.5" />
            <span>홈으로</span>
          </button>

          <div>
            <h2 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight flex items-center gap-1">
              <span>🎉 대화 복기</span>
            </h2>
            <p className="text-[10px] text-gray-500 line-clamp-1">{persona.name} • {situation.title}</p>
          </div>
        </div>

        {/* 3단계 스텝 배지 */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl comic-border">
          {[1, 2, 3].map(step => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                currentStep === step
                  ? 'bg-[var(--accent)] text-white comic-border scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {step}
            </button>
          ))}
          <span className="text-[10px] text-gray-400 font-bold px-0.5">/3</span>
        </div>
      </div>

      {/* 2. 메인 카드 영역 (페이지 넘김 컨텐츠) */}
      <div className="flex-1 bg-white rounded-3xl comic-border-thick comic-shadow p-4 sm:p-5 flex flex-col justify-between overflow-y-auto min-h-[380px] animate-in fade-in duration-200">
        {/* Step 1: 종합 스코어 & 칭찬 카드 */}
        {currentStep === 1 && (
          <div className="space-y-4 flex flex-col justify-center my-auto">
            <div className="text-center">
              <span className="inline-block text-3xl mb-1 comic-float">🏆</span>
              <h3 className="text-lg font-bold text-gray-900">종합 회화 분석</h3>
              <p className="text-xs text-gray-500">대화가 끝까지 아주 매끄럽게 이어졌어요!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 comic-border rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> 회화 점수
                </span>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                  {feedback.overallScore}<span className="text-base font-normal">점</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">총 {feedback.talkDurationTurns}턴 소통</p>
              </div>

              <div className="bg-sky-50 comic-border rounded-2xl p-3 text-center">
                <span className="text-xs font-bold text-sky-900 flex items-center justify-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" /> 핑퐁 주도권
                </span>
                <div className="text-3xl font-bold text-blue-600 mt-1">
                  {feedback.pingPongScore}<span className="text-base font-normal">%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">역질문 & 맞장구</p>
              </div>
            </div>

            <div className="bg-emerald-50 comic-border rounded-2xl p-3.5 space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 이번 대화의 칭찬 포인트
              </h4>
              <div className="space-y-1">
                {feedback.praisedPoints.map((point, idx) => (
                  <p key={idx} className="text-xs text-gray-800 font-medium flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 내 문장 다듬기 (원어민 표현 체인지) */}
        {currentStep === 2 && (
          <div className="space-y-3 my-auto">
            <div className="text-center pb-1">
              <span className="inline-block text-3xl mb-1">✏️</span>
              <h3 className="text-lg font-bold text-gray-900">내 문장 원어민처럼 바꾸기</h3>
              <p className="text-xs text-gray-500">조금만 바꾸면 훨씬 더 자연스러운 표현들입니다.</p>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {feedback.corrections.map((item, idx) => (
                <div key={idx} className="bg-gray-50 comic-border rounded-2xl p-3 text-xs space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold shrink-0">내가 한 말:</span>
                    <span className="text-gray-700 line-through">"{item.userSentence}"</span>
                  </div>

                  <div className="bg-yellow-100/80 comic-border rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-amber-900 block">✨ 네이티브 추천 표현:</span>
                      <span className="text-sm font-bold text-gray-900 block mt-0.5">"{item.nativeAlternative}"</span>
                      <span className="text-[10px] text-gray-600 block mt-0.5">{item.explanation}</span>
                    </div>
                    <button
                      onClick={() => playVoice(item.nativeAlternative)}
                      className="comic-btn bg-white p-2 rounded-xl text-gray-800 hover:bg-yellow-200 shrink-0"
                      title="발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 오늘의 꿀 표현 3선 & 학습 완료 */}
        {currentStep === 3 && (
          <div className="space-y-4 my-auto">
            <div className="text-center">
              <span className="inline-block text-3xl mb-1">📌</span>
              <h3 className="text-lg font-bold text-gray-900">오늘 챙겨갈 핵심 표현 3선</h3>
              <p className="text-xs text-gray-500">카드를 탭하면 원어민 발음을 다시 들을 수 있어요.</p>
            </div>

            <div className="space-y-2">
              {feedback.keyExpressions.map((exp, idx) => (
                <div
                  key={idx}
                  onClick={() => playVoice(exp.phrase)}
                  className="bg-purple-50 comic-border p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-purple-100 comic-btn transition-all"
                >
                  <div>
                    <span className="font-bold text-sm text-purple-900 block">{exp.phrase}</span>
                    <span className="text-xs text-gray-700 block mt-0.5">{exp.meaning}</span>
                    <span className="text-[10px] text-gray-500 block italic mt-0.5">"{exp.example}"</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white comic-border flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. 하단 페이지 넘김 & 액션 도크 */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* 이전 카드 버튼 */}
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className={`comic-btn px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 ${
            currentStep === 1 ? 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-800'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>이전</span>
        </button>

        {/* 중앙 액션: 마지막 단계면 홈/다시하기, 아니면 다음 버튼 */}
        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
            className="comic-btn flex-1 bg-[var(--accent)] hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>다음 카드 보기 ({currentStep}/3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex-1 flex gap-2">
            <button
              onClick={onRestart}
              className="comic-btn flex-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 연습</span>
            </button>
            <button
              onClick={onGoHome}
              className="comic-btn flex-1 bg-[var(--accent)] hover:opacity-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>새 대화 시작</span>
            </button>
          </div>
        )}

        {/* 다음 카드 버튼 (1, 2단계에서 활성) */}
        {currentStep < 3 && (
          <button
            onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
            className="comic-btn px-4 py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-gray-100 text-gray-800 flex items-center gap-1"
          >
            <span>다음</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
