import type { Situation } from '../types';

export const SITUATIONS: Situation[] = [
  {
    id: 'rainy_cafe',
    title: '비 오는 날 카페 우연한 합석',
    emoji: '☕',
    category: 'cafe',
    description: '빈 자리가 없어 옆 테이블에 합석하게 된 상황! 자연스럽게 첫 스몰토크를 시작해봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Excuse me, is this seat taken? It's pouring outside, isn't it?",
    hiddenQuests: [
      '날씨에 대해 한마디 리액션하기',
      '내가 마시는 음료 메뉴 언급하기',
      '상대방에게 되묻는 질문(How about you?) 던지기'
    ]
  },
  {
    id: 'first_party',
    title: '친구의 홈파티에서 첫 만남',
    emoji: '🎉',
    category: 'friend',
    description: '친구 집들이 파티에서 처음 보는 외국인 친구와 스낵 코너에서 마주쳤어요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Hey there! I don't think we've met yet. How do you know the host?",
    hiddenQuests: [
      '자기 이름이나 친구와의 관계 말하기',
      '파티 음식이나 음악 칭찬하기',
      '주말 계획 물어보기'
    ]
  },
  {
    id: 'wrong_order',
    title: '식당에서 주문이 잘못 나왔을 때',
    emoji: '🍔',
    category: 'daily',
    description: '감자튀김 대신 어니언링이 나왔어요. 공손하면서도 확실하게 바꿔달라고 요청해봐요.',
    suggestedLevel: 3,
    firstTurnPrompt: "Here is your order! One burger with onion rings. Anything else I can get you?",
    hiddenQuests: [
      'Excuse me로 정중하게 시작하기',
      '원래 주문했던 메뉴(French fries) 말하기',
      '감사 인사 잊지 않기'
    ]
  },
  {
    id: 'flea_market',
    title: '런던 플리마켓에서 가격 흥정하기',
    emoji: '🛍️',
    category: 'travel',
    description: '마음에 쏙 드는 빈티지 자켓을 발견했어요! 주인에게 가격을 물어보고 살짝 깎아볼까요?',
    suggestedLevel: 3,
    firstTurnPrompt: "Ah, you have great taste! That vintage jacket is one of a kind. Do you like it?",
    hiddenQuests: [
      '가격 물어보기 (How much is this?)',
      '조금 깎아줄 수 있는지 물어보기 (Could you give me a discount?)',
      '원어민 표현(deal, bargain 등) 사용해보기'
    ]
  },
  {
    id: 'airport_customs',
    title: '뉴욕 공항 입국 심사관 인터뷰',
    emoji: '✈️',
    category: 'travel',
    description: '조금 긴장되는 입국 심사! 방문 목적과 체류 기간을 당당하게 대답해봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Passport, please. What is the main purpose of your visit to the United States?",
    hiddenQuests: [
      '방문 목적(Sightseeing/Vacation) 명확히 말하기',
      '머무를 기간(e.g., Two weeks) 말하기',
      '숙소 위치 말하기'
    ]
  },
  {
    id: 'weekend_chat',
    title: '월요일 아침 직장 동료와 수다',
    emoji: '💼',
    category: 'daily',
    description: '출근 후 탕비실에서 마주친 동료와 가볍게 주말에 뭐 했는지 스몰토크를 나눠요.',
    suggestedLevel: 4,
    firstTurnPrompt: "Morning! How was your weekend? Did you get to relax or do anything fun?",
    hiddenQuests: [
      '주말에 한 일 2가지 이상 말하기',
      '상대방 주말은 어땠는지 역질문하기',
      '필러 워드(Well, Honestly 등) 써보기'
    ]
  }
];
