import React from 'react';
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
  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full justify-between gap-3 p-1">
      {/* 1. 상단 바: 로고 & 테마 색상 선택기 & 설정 */}
      <div className="bg-white comic-border-thick comic-shadow-sm px-4 py-2.5 rounded-2xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] comic-border flex items-center justify-center text-lg">
            💬
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
              ComicTalk
            </h1>
            <span className="text-[10px] text-gray-500 font-medium">만화처럼 즐거운 영어회화</span>
          </div>
        </div>

        {/* 테마 컬러 팔레트 & 설정 */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl comic-border">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-transform ${
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
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 대화 상대(페르소나) 선택 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1">
            <span>🦊 1. 대화 상대 선택</span>
          </h3>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full comic-border">
            {selectedPersona.name} ({selectedPersona.role})
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PERSONAS.map(p => {
            const isSelected = p.id === selectedPersona.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p)}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all comic-btn ${
                  isSelected
                    ? 'bg-amber-100 comic-border-thick -translate-y-0.5 scale-105'
                    : 'bg-gray-50 hover:bg-amber-50 comic-border opacity-85'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-xl comic-border flex items-center justify-center text-2xl mb-1"
                  style={{ backgroundColor: p.avatarBg }}
                >
                  {p.emoji}
                </div>
                <span className="font-bold text-[11px] text-gray-900 line-clamp-1">{p.name.split(' ')[0]}</span>
                <span className="text-[9px] text-gray-500 line-clamp-1">{p.role.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 대화 상황(시나리오) 선택 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1">
            <span>🎭 2. 어떤 상황에서 대화할까요?</span>
          </h3>
          <span className="text-[10px] text-gray-500 font-medium">탭해서 상황 변경</span>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
          {SITUATIONS.map(s => {
            const isSelected = s.id === selectedSituation.id;
            return (
              <div
                key={s.id}
                onClick={() => onSelectSituation(s)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all comic-btn text-left flex items-start gap-2 ${
                  isSelected
                    ? 'bg-amber-100 comic-border-thick'
                    : 'bg-gray-50 hover:bg-gray-100 comic-border'
                }`}
              >
                <span className="text-xl shrink-0">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 truncate flex items-center justify-between">
                    <span>{s.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                  </h4>
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 난이도 조절 바 */}
      <div className="bg-white rounded-2xl comic-border comic-shadow-sm p-3 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-xs text-gray-900">📈 3. 대화 난이도</h4>
          <p className="text-[10px] text-gray-500">어휘 및 말하기 속도 조절</p>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl as DifficultyLevel)}
              className={`w-7 h-7 rounded-xl font-bold text-xs comic-btn ${
                level === lvl
                  ? 'bg-[var(--accent)] text-white scale-110 shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 하단 메인 액션: [대화 시작하기] 버튼 */}
      <div className="pt-1">
        <button
          onClick={onStartChat}
          className="comic-btn w-full bg-[var(--accent)] hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl text-base flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{selectedPersona.name}와 대화 시작하기!</span>
        </button>
      </div>
    </div>
  );
};
