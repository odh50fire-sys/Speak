import React, { useState } from 'react';
import type { Persona, Situation } from '../types';
import { PERSONAS } from '../data/personas';
import { SITUATIONS } from '../data/situations';
import { X, Check } from 'lucide-react';

interface SituationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  currentSituation: Situation;
  onSelectSituation: (situation: Situation) => void;
}

export const SituationModal: React.FC<SituationModalProps> = ({
  isOpen,
  onClose,
  currentPersona,
  onSelectPersona,
  currentSituation,
  onSelectSituation
}) => {
  const [activeTab, setActiveTab] = useState<'situation' | 'persona'>('situation');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl comic-border-thick comic-shadow-lg p-5 max-h-[90vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-gray-900">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('situation')}
              className={`px-4 py-2 rounded-xl font-bold text-sm comic-btn ${
                activeTab === 'situation' ? 'bg-[var(--accent)] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              🎭 대화 상황 선택
            </button>
            <button
              onClick={() => setActiveTab('persona')}
              className={`px-4 py-2 rounded-xl font-bold text-sm comic-btn ${
                activeTab === 'persona' ? 'bg-[var(--accent)] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              🦊 AI 친구/선생님 선택
            </button>
          </div>
          <button
            onClick={onClose}
            className="comic-btn bg-gray-100 p-1.5 rounded-xl hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {activeTab === 'situation' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SITUATIONS.map(s => {
                const isSelected = s.id === currentSituation.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSituation(s);
                      onClose();
                    }}
                    className={`comic-box p-4 rounded-2xl cursor-pointer transition-all comic-btn text-left flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-100 border-[var(--accent)]'
                        : 'bg-white hover:bg-amber-50'
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-2">{s.emoji}</div>
                      <h4 className="font-bold text-base text-gray-900 flex items-center justify-between">
                        {s.title}
                        {isSelected && <Check className="w-5 h-5 text-green-600" />}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{s.description}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-500">
                      <span>권장: Lv.{s.suggestedLevel}</span>
                      <span className="text-[var(--accent)] font-bold">대화 시작하기 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONAS.map(p => {
                const isSelected = p.id === currentPersona.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPersona(p);
                      onClose();
                    }}
                    className={`comic-box p-4 rounded-2xl cursor-pointer transition-all comic-btn text-left flex items-start gap-3 ${
                      isSelected
                        ? 'bg-pink-100 border-[var(--accent)]'
                        : 'bg-white hover:bg-pink-50'
                    }`}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl comic-border flex items-center justify-center text-3xl shrink-0"
                      style={{ backgroundColor: p.avatarBg }}
                    >
                      {p.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-gray-900">{p.name}</h4>
                        {isSelected && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                      <span className="inline-block text-[10px] bg-white comic-border px-2 py-0.5 rounded-full font-bold text-purple-700 mt-1">
                        {p.role}
                      </span>
                      <p className="text-xs text-gray-600 mt-2 italic leading-relaxed">
                        "{p.tagline}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="pt-3 border-t-2 border-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="comic-btn bg-gray-900 text-white font-bold py-2 px-5 rounded-xl text-sm"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};
