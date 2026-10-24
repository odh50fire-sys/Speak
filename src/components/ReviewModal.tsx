import React, { useEffect } from 'react';
import type { ReviewFeedback, Persona, Situation } from '../types';
import { speechService } from '../services/speech';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, MessageCircle, Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  feedback: ReviewFeedback | null;
  persona: Persona;
  situation: Situation;
  onRestart: () => void;
  onNewSituation: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  feedback,
  persona,
  situation,
  onRestart,
  onNewSituation
}) => {
  useEffect(() => {
    if (isOpen) {
      // 팡파레 효과 실행
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen || !feedback) return null;

  const playVoice = (text: string) => {
    speechService.speak(text, 'female', 1.0, 1.0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl comic-border-thick comic-shadow-lg p-5 my-6 flex flex-col gap-4">
        {/* 상단 축하 타이틀 */}
        <div className="text-center pb-2 border-b-2 border-gray-900">
          <div className="inline-block p-3 bg-yellow-200 comic-border rounded-2xl text-4xl mb-2 comic-float">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-gray-900">대화 완료! 수고하셨어요</h2>
          <p className="text-xs text-gray-500 font-medium">
            {persona.name}와의 <span className="font-bold text-gray-800">{situation.title}</span> 세션 복기 리포트
          </p>
        </div>

        {/* 1. 스코어 카드 (종합 점수 & 핑퐁 지수) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 comic-border rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> 회화 종합 점수
            </span>
            <div className="text-3xl font-bold text-gray-900 mt-1">
              {feedback.overallScore}<span className="text-base font-normal">점</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">총 {feedback.talkDurationTurns}턴 주고받음</p>
          </div>

          <div className="bg-sky-50 comic-border rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-sky-800 flex items-center justify-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> 핑퐁(대화주도) 지수
            </span>
            <div className="text-3xl font-bold text-blue-600 mt-1">
              {feedback.pingPongScore}<span className="text-base font-normal">%</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">역질문 & 맞장구 반응</p>
          </div>
        </div>

        {/* 2. 칭찬 포인트 */}
        <div className="bg-emerald-50 comic-border rounded-2xl p-3.5 space-y-1.5">
          <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-600" /> 이번 대화에서 돋보인 점
          </h4>
          <div className="space-y-1">
            {feedback.praisedPoints.map((point, i) => (
              <p key={i} className="text-xs font-medium text-gray-800 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </p>
            ))}
          </div>
        </div>

        {/* 3. 문장별 문법 교정 & 원어민 표현 추천 (Comic Card Style) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
            <span>✏️ 내 문장 다듬기 (원어민 표현 체인지)</span>
          </h4>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {feedback.corrections.map((item, idx) => (
              <div key={idx} className="bg-gray-50 comic-border rounded-2xl p-3 text-xs space-y-1.5">
                {/* 내가 한 말 */}
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold shrink-0">내 발화:</span>
                  <span className="text-gray-700 line-through">"{item.userSentence}"</span>
                </div>

                {/* 원어민 추천 표현 */}
                <div className="flex items-start justify-between gap-1.5 bg-yellow-100/70 comic-border rounded-xl p-2">
                  <div>
                    <span className="text-amber-900 font-bold block text-[11px]">✨ 네이티브는 이렇게 말해요:</span>
                    <span className="text-gray-900 font-bold text-sm block mt-0.5">"{item.nativeAlternative}"</span>
                    <span className="text-gray-500 text-[10px] block mt-0.5">{item.explanation}</span>
                  </div>
                  <button
                    onClick={() => playVoice(item.nativeAlternative)}
                    className="comic-btn bg-white p-1.5 rounded-lg text-gray-700 hover:bg-yellow-200 shrink-0 self-center"
                    title="발음 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 오늘의 꿀 표현 플래시카드 */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-gray-900">📌 오늘 챙겨갈 핵심 표현 3선</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {feedback.keyExpressions.map((exp, i) => (
              <div
                key={i}
                onClick={() => playVoice(exp.phrase)}
                className="comic-box bg-purple-50 p-2.5 rounded-xl text-left cursor-pointer hover:bg-purple-100 transition-all comic-btn"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-purple-900">{exp.phrase}</p>
                  <Volume2 className="w-3 h-3 text-purple-500" />
                </div>
                <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{exp.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 모달 하단 버튼 */}
        <div className="pt-2 border-t-2 border-gray-900 flex items-center justify-between gap-2">
          <button
            onClick={onRestart}
            className="comic-btn bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-xs"
          >
            🔄 같은 상황 다시 연습
          </button>
          <button
            onClick={onNewSituation}
            className="comic-btn bg-[var(--accent)] text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1"
          >
            <span>다음 상황 도전하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
