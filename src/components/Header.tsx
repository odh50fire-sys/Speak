import React from 'react';
import type { ThemeId, DifficultyLevel } from '../types';
import { Settings } from 'lucide-react';

interface HeaderProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  level: DifficultyLevel;
  onLevelChange: (level: DifficultyLevel) => void;
  onOpenSettings: () => void;
  onOpenSituationModal: () => void;
  situationTitle: string;
}

const THEMES: { id: ThemeId; name: string; emoji: string; color: string }[] = [
  { id: 'cheese', name: '치즈 툰', emoji: '🧀', color: '#FFA94D' },
  { id: 'strawberry', name: '딸기 팝', emoji: '🍓', color: '#FF5376' },
  { id: 'soda', name: '소다 스카이', emoji: '🫐', color: '#4DABF7' },
  { id: 'mint', name: '민트 클로버', emoji: '🥑', color: '#38D9A9' },
  { id: 'lavender', name: '라벤더 드림', emoji: '🔮', color: '#B197FC' }
];

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onThemeChange,
  level,
  onLevelChange,
  onOpenSettings,
  onOpenSituationModal,
  situationTitle
}) => {
  return (
    <header className="w-full bg-white comic-border-thick comic-shadow-sm px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 transition-all">
      {/* 로고 & 상황 타이틀 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenSituationModal}>
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] comic-border flex items-center justify-center text-xl shadow-sm">
            💬
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-1">
              ComicTalk
              <span className="text-xs bg-yellow-300 text-gray-900 px-2 py-0.5 rounded-full font-bold comic-border ml-1">
                Lv.{level}
              </span>
            </h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 hover:underline cursor-pointer">
              <span>📍 {situationTitle}</span>
              <span className="text-blue-500 font-bold">(변경)</span>
            </p>
          </div>
        </div>
      </div>

      {/* 우측 도구 모음: 테마 컬러 팔레트 & 난이도 & 설정 */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 테마 팔레트 */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl comic-border">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform ${
                currentTheme === t.id
                  ? 'comic-border -translate-y-0.5 shadow-sm scale-110'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.color }}
              title={`${t.name} 테마`}
            >
              {t.emoji}
            </button>
          ))}
        </div>

        {/* 난이도 선택 드롭다운 (1~5단계) */}
        <div className="relative">
          <select
            value={level}
            onChange={(e) => onLevelChange(Number(e.target.value) as DifficultyLevel)}
            className="comic-btn bg-yellow-100 text-gray-900 text-xs font-bold py-1.5 px-2.5 rounded-xl cursor-pointer"
          >
            <option value={1}>Lv.1 초보 🌱</option>
            <option value={2}>Lv.2 초중급 🐥</option>
            <option value={3}>Lv.3 중급 🦊</option>
            <option value={4}>Lv.4 중고급 🦁</option>
            <option value={5}>Lv.5 마스터 👑</option>
          </select>
        </div>

        {/* 설정 버튼 */}
        <button
          onClick={onOpenSettings}
          className="comic-btn bg-white hover:bg-gray-100 p-2 rounded-xl text-gray-800"
          title="설정 및 API 키"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
