import React, { useState, useEffect } from 'react';
import { X, Key, Palette, Mic, Check } from 'lucide-react';
import { speechService } from '../services/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomColorChange: (bgColor: string, accentColor: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onCustomColorChange
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [customBg, setCustomBg] = useState('#FFF8E7');
  const [customAccent, setCustomAccent] = useState('#FF6B8B');

  const support = speechService.isSupported();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('COMIC_TALK_GEMINI_KEY') || '';
      setApiKey(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('COMIC_TALK_GEMINI_KEY', apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleApplyCustomColors = () => {
    onCustomColorChange(customBg, customAccent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl comic-border-thick comic-shadow-lg p-5 flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
            ⚙️ 설정 & 맞춤 커스텀
          </h3>
          <button onClick={onClose} className="comic-btn bg-gray-100 p-1.5 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Gemini API 키 설정 */}
        <div className="bg-purple-50 comic-border rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-purple-900 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> Google Gemini API 키 (선택)
            </label>
            <span className="text-[10px] text-purple-700 bg-white comic-border px-1.5 py-0.5 rounded-full font-bold">
              미입력 시 스마트 시뮬레이션 동작
            </span>
          </div>
          <p className="text-[11px] text-gray-600">
            개인 키를 입력하면 내 브라우저에만 안전하게 저장되며 실제 Gemini 1.5 Flash로 대화가 진행됩니다.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-white comic-border rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleSaveKey}
              className="comic-btn bg-purple-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : '저장'}
            </button>
          </div>
        </div>

        {/* 2. 유저 DIY 테마 색감 커스텀 */}
        <div className="bg-amber-50 comic-border rounded-2xl p-3.5 space-y-2.5">
          <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" /> 나만의 색상 직접 선택 (실시간 반영)
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-700 font-semibold block mb-1">전체 배경색:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer comic-border"
                />
                <span className="font-mono text-[11px] text-gray-600">{customBg}</span>
              </div>
            </div>

            <div>
              <span className="text-gray-700 font-semibold block mb-1">버튼/포인트색:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customAccent}
                  onChange={(e) => setCustomAccent(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer comic-border"
                />
                <span className="font-mono text-[11px] text-gray-600">{customAccent}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleApplyCustomColors}
            className="comic-btn w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-1.5 rounded-xl text-xs mt-1"
          >
            선택한 색상 화면에 적용하기 ✨
          </button>
        </div>

        {/* 3. 브라우저 음성 지원 상태 */}
        <div className="bg-gray-50 comic-border rounded-2xl p-3 text-xs space-y-1">
          <h4 className="font-bold text-gray-700 flex items-center gap-1">
            <Mic className="w-3.5 h-3.5" /> 브라우저 음성 엔진 상태:
          </h4>
          <div className="flex justify-between text-[11px] text-gray-600">
            <span>음성 인식(STT):</span>
            <span className={support.stt ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
              {support.stt ? "지원됨 (Chrome/Safari) ✅" : "미지원 (텍스트 모드 가능)"}
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-600">
            <span>음성 출력(TTS):</span>
            <span className={support.tts ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
              {support.tts ? "지원됨 ✅" : "미지원"}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="comic-btn bg-gray-900 text-white font-bold py-2 rounded-xl text-xs w-full"
        >
          확인
        </button>
      </div>
    </div>
  );
};
