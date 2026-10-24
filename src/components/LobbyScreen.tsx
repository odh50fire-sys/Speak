import React, { useState } from 'react';
import type { Persona, Situation, DifficultyLevel, ThemeId } from '../types';
import { PERSONAS } from '../data/personas';
import { SITUATIONS } from '../data/situations';
import { Settings, Play, Check } from 'lucide-react';

interface LobbyScreenProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  selectedPersona: Persona;
  onSelectPersona: (p: Persona) => void;
  selectedSituation: Situation;
  onSelectSituation: (s: Situation) => void;
  level: DifficultyLevel;
  onLevelChange: (lvl: DifficultyLevel) => void;
  onStartChat: () => void;
  onOpenSettings: () => void;
}

const THEMES: { id: ThemeId; emoji: string; color: string; label: string }[] = [
  { id: 'cheese', emoji: '🧀', color: '#FFA94D', label: '치즈' },
  { id: 'strawberry', emoji: '🍓', color: '#FF5376', label: '딸기' },
  { id: 'soda', emoji: '🫐', color: '#4DABF7', label: '소다' },
  { id: 'mint', emoji: '🥑', color: '#38D9A9', label: '민트' },
  { id: 'lavender', emoji: '🔮', color: '#B197FC', label: '라벤더' }
];

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'cafe', label: '☕ 식당/카페' },
  { id: 'travel', label: '✈️ 여행/호텔' },
  { id: 'friend', label: '💬 친구/사교' },
  { id: 'service', label: '🛍️ 쇼핑/일상' },
  { id: 'work', label: '💼 직장/비즈니스' }
] as const;

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  currentTheme,
  onThemeChange,
  selectedPersona,
  onSelectPersona,
  selectedSituation,
  onSelectSituation,
  level,
  onLevelChange,
  onStartChat,
  onOpenSettings
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredSituations = activeCategory === 'all'
    ? SITUATIONS
    : SITUATIONS.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full justify-between gap-2.5 p-1">
      {/* 1. 상단 바: 로고 & 테마 색상 선택기 & 설정 */}
      <div className="bg-white comic-border-thick comic-shadow-sm px-4 py-2 rounded-2xl flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent)] comic-border flex items-center justify-center text-base">
            💬
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 leading-none">
              ComicTalk
            </h1>
            <span className="text-[10px] text-gray-500 font-medium">실전 영어회화 친구</span>
          </div>
        </div>

        {/* 테마 컬러 팔레트 & 설정 */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl comic-border">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-transform ${
                  currentTheme === t.id
                    ? 'comic-border -translate-y-0.5 shadow-xs scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.color }}
                title={`${t.label} 테마`}
              >
                {t.emoji}
              </button>
            ))}
          </div>
          <button
            onClick={onOpenSettings}
            className="comic-btn bg-white hover:bg-gray-100 p-1.5 rounded-xl text-gray-800"
            title="설정 및 API 키"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. 대화 상대(페르소나) 선택 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm p-2.5 space-y-1.5 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-gray-900">
            <span>🦊 1. 대화 상대</span>
          </h3>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full comic-border">
            {selectedPersona.name} ({selectedPersona.role})
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {PERSONAS.map(p => {
            const isSelected = p.id === selectedPersona.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p)}
                className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all comic-btn ${
                  isSelected
                    ? 'bg-amber-100 comic-border-thick -translate-y-0.5 scale-102'
                    : 'bg-gray-50 hover:bg-amber-50 comic-border opacity-80'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg comic-border flex items-center justify-center text-xl mb-0.5"
                  style={{ backgroundColor: p.avatarBg }}
                >
                  {p.emoji}
                </div>
                <span className="font-bold text-[10px] text-gray-900 truncate w-full text-center">{p.name.split(' ')[0]}</span>
                <span className="text-[8px] text-gray-500 truncate w-full text-center">{p.role.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 대화 상황(시나리오) 선택: 24종 + 카테고리 필터 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm p-2.5 space-y-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1">
            <span>🎭 2. 상황 선택 ({SITUATIONS.length}가지)</span>
          </h3>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full comic-border">
            선택: {selectedSituation.emoji} {selectedSituation.title}
          </span>
        </div>

        {/* 카테고리 필터 탭 */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.8 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white comic-border'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 상황 카드 그리드 (스크롤 가능 영역) */}
        <div className="grid grid-cols-2 gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
          {filteredSituations.map(s => {
            const isSelected = s.id === selectedSituation.id;
            return (
              <div
                key={s.id}
                onClick={() => onSelectSituation(s)}
                className={`p-2 rounded-xl cursor-pointer transition-all comic-btn text-left flex items-start gap-1.5 ${
                  isSelected
                    ? 'bg-amber-100 comic-border-thick'
                    : 'bg-gray-50 hover:bg-gray-100 comic-border'
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[11px] text-gray-900 truncate flex items-center justify-between">
                    <span className="truncate">{s.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-green-600 shrink-0 ml-1" />}
                  </h4>
                  <p className="text-[9px] text-gray-500 line-clamp-1 mt-0.5">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 난이도 조절 바 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <div>
          <h4 className="font-bold text-xs text-gray-900">📈 3. 난이도 (Level)</h4>
          <span className="text-[9px] text-gray-500">어휘 및 속도 조절</span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl as DifficultyLevel)}
              className={`w-6 h-6 rounded-lg font-bold text-xs comic-btn ${
                level === lvl
                  ? 'bg-[var(--accent)] text-white scale-105 shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 하단 메인 액션: [대화 시작하기] 버튼 */}
      <div className="pt-0.5 shrink-0">
        <button
          onClick={onStartChat}
          className="comic-btn w-full bg-[var(--accent)] hover:opacity-95 text-white font-bold py-3 px-5 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-98"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{selectedPersona.name}와 대화 시작하기! ({selectedSituation.emoji})</span>
        </button>
      </div>
    </div>
  );
};
