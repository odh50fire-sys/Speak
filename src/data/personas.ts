import type { Persona } from '../types';

export const PERSONAS: Persona[] = [
  {
    id: 'daisy',
    name: 'Daisy 🦊',
    emoji: '🦊',
    avatarBg: '#FFD8A8',
    role: '다정한 영어 과외 선생님',
    tagline: '틀려도 괜찮아요! 차근차근 함께 말해봐요 ✨',
    greeting: "Hi there! I'm Daisy, your English coach. What shall we talk about today?",
    voiceGender: 'female',
    voicePitch: 1.1,
    voiceRate: 0.95
  },
  {
    id: 'leo',
    name: 'Leo 🐶',
    emoji: '🐶',
    avatarBg: '#A5D8FF',
    role: '쾌활한 원어민 남사친',
    tagline: 'Yo! 요즘 어떻게 지내? 우리 재미있게 수다 떨자!',
    greeting: "Hey! What's up? Ready to chat? No stress at all, buddy!",
    voiceGender: 'male',
    voicePitch: 0.95,
    voiceRate: 1.05
  },
  {
    id: 'luna',
    name: 'Luna 🐱',
    emoji: '🐱',
    avatarBg: '#FCC2D7',
    role: '트렌디한 뉴요커 여사친',
    tagline: '진짜 실생활에서 쓰는 힙한 표현만 알려줄게 ☕',
    greeting: "Hey! So good to see you. Tell me what's new in your life!",
    voiceGender: 'female',
    voicePitch: 1.05,
    voiceRate: 1.0
  },
  {
    id: 'max',
    name: 'Max 🐻',
    emoji: '🐻',
    avatarBg: '#D8F5A2',
    role: '유머러스한 여행 가이드',
    tagline: '캐나다에서 온 곰돌이! 편안하게 농담도 섞어가며 대화해요.',
    greeting: "Hello, my friend! It's an awesome day for a great chat, isn't it?",
    voiceGender: 'male',
    voicePitch: 0.9,
    voiceRate: 0.95
  }
];
