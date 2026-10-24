import type { Situation } from '../types';

export const SITUATIONS: Situation[] = [
  // 1. 카페 & 식당 (Cafe & Dining)
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
    id: 'cafe_order',
    title: '스타벅스 커스텀 음료 주문하기',
    emoji: '🥤',
    category: 'cafe',
    description: '우유를 오트밀크로 바꾸고 시럽을 덜 달게 커스텀해서 주문해 봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Hi there! Welcome to Coffee Central. What can I brew for you today?",
    hiddenQuests: [
      '원하는 음료 사이즈(Grande/Medium) 말하기',
      '우유 옵션(Oat milk/Soy milk) 바꾸기',
      '덜 달게(Less sweet) 요청하기'
    ]
  },
  {
    id: 'wrong_order',
    title: '식당에서 주문이 잘못 나왔을 때',
    emoji: '🍔',
    category: 'cafe',
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
    id: 'split_bill',
    title: '식사 후 계산서 분할(더치페이) 요청',
    emoji: '🧾',
    category: 'cafe',
    description: '친구와 식사를 마치고 각자 카드로 따로 계산해 달라고 요청하는 상황이에요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Did you enjoy your meal tonight? Are you ready for the check?",
    hiddenQuests: [
      '음식이 맛있었다고 칭찬하기',
      '더치페이(split the bill) 요청하기',
      '카드로 계산하겠다고 말하기'
    ]
  },

  // 2. 여행 & 공항 & 호텔 (Travel)
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
    id: 'hotel_checkin',
    title: '호텔 체크인 & 고층 방 요청하기',
    emoji: '🏨',
    category: 'travel',
    description: '예약 확인 후 조용하고 전망 좋은 높은 층 방으로 배정해 달라고 부탁해 봐요.',
    suggestedLevel: 3,
    firstTurnPrompt: "Welcome to the Grand Horizon Hotel! How can I assist you today, sir/ma'am?",
    hiddenQuests: [
      '예약자 이름 말하기',
      '높은 층(High floor) 방 요청하기',
      '조식 시간(Breakfast time) 물어보기'
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
    id: 'ask_directions',
    title: '길 잃었을 때 지하철역 위치 묻기',
    emoji: '🗺️',
    category: 'travel',
    description: '낯선 도시에서 길을 잃었어요. 지나가는 친절한 행인에게 지하철역 가는 길을 물어봐요.',
    suggestedLevel: 1,
    firstTurnPrompt: "Hello! You look a bit lost. Can I help you with something?",
    hiddenQuests: [
      '실례합니다(Excuse me)로 시작하기',
      '지하철역(Subway station) 위치 묻기',
      '걸어서 얼마나 걸리는지(How long on foot?) 묻기'
    ]
  },
  {
    id: 'airplane_chat',
    title: '비행기 기내에서 옆자리 승객과 대화',
    emoji: '🛫',
    category: 'travel',
    description: '10시간 장거리 비행 중 옆자리 승객과 가볍게 나누는 친근한 스몰토크.',
    suggestedLevel: 3,
    firstTurnPrompt: "Quite a long flight ahead of us, huh? Are you heading home or traveling for fun?",
    hiddenQuests: [
      '여행 목적이나 최종 목적지 말하기',
      '비행 소요 시간에 대해 맞장구치기',
      '상대방에게도 여행인지 되묻기'
    ]
  },

  // 3. 친구 & 사교 & 스몰토크 (Friend & Social)
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
    id: 'movie_discussion',
    title: '방금 본 영화에 대해 친구와 토론하기',
    emoji: '🎬',
    category: 'friend',
    description: '영화관에서 막 나온 뒤, 엔딩에 대해 친구와 서로의 감상을 나누는 상황이에요.',
    suggestedLevel: 4,
    firstTurnPrompt: "Wow, that ending totally blew my mind! What did you think of the plot twist?",
    hiddenQuests: [
      '가장 인상 깊었던 캐릭터나 장면 말하기',
      '나의 솔직한 평점(10점 만점) 주기',
      '원어민 표현(overrated, masterpiece 등) 써보기'
    ]
  },
  {
    id: 'weekend_plans',
    title: '주말 근교 피크닉 제안하기',
    emoji: '🧺',
    category: 'friend',
    description: '날씨 좋은 이번 주말에 친구에게 공원으로 피크닉 가자고 제안해 봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Hey! The weather forecast says it's going to be super sunny this Saturday. Any big plans?",
    hiddenQuests: [
      '피크닉(Picnic) 가자고 제안하기',
      '각자 챙겨올 음식/스낵 정하기',
      '몇 시에 만날지 약속 시간 잡기'
    ]
  },
  {
    id: 'neighbor_greeting',
    title: '옆집에 새로 이사 온 이웃과 인사',
    emoji: '🏡',
    category: 'friend',
    description: '복도에서 새로 이사 온 외국인 이웃을 마주쳐 반갑게 인사를 나누는 상황이에요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Oh, hi! I just moved in next door yesterday. I'm Sam. Good to meet you!",
    hiddenQuests: [
      '환영 인사(Welcome to the neighborhood) 건네기',
      '얼마나 오래 살았는지 말하기',
      '도움이 필요하면 언제든 말하라고 격려하기'
    ]
  },

  // 4. 쇼핑 & 서비스 & 일상 (Service & Daily)
  {
    id: 'clothing_store',
    title: '옷가게에서 다른 사이즈 찾아달라 하기',
    emoji: '👗',
    category: 'service',
    description: '셔츠 디자인은 마음에 드는데 사이즈가 맞지 않아요. 직원에게 M 사이즈나 다른 색상을 요청해 봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Hello! Are you finding everything okay? Let me know if you need a fitting room.",
    hiddenQuests: [
      '이 옷이 마음에 든다고 말하기',
      '미디엄(Medium) 사이즈 있는지 묻기',
      '입어봐도 되는지(Try on) 물어보기'
    ]
  },
  {
    id: 'store_refund',
    title: '매장에서 환불 및 영수증 제시하기',
    emoji: '📦',
    category: 'service',
    description: '어제 산 이어폰에 문제가 있어 환불이나 교환을 정중하게 요구해 봐요.',
    suggestedLevel: 3,
    firstTurnPrompt: "Hi there, welcome to Customer Service. How can I help you today?",
    hiddenQuests: [
      '환불(Refund) 또는 교환(Exchange) 원한다고 말하기',
      '제품의 문제점(defect/doesn\'t fit) 설명하기',
      '영수증(Receipt) 건네기'
    ]
  },
  {
    id: 'pharmacy_cold',
    title: '약국에서 감기 증상 설명하고 약 사기',
    emoji: '💊',
    category: 'service',
    description: '목이 따갑고 열이 살짝 나요. 약사에게 증상을 설명하고 졸리지 않는 약을 추천받아요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Hello. What symptoms are you experiencing today?",
    hiddenQuests: [
      '목 아픔(Sore throat) 또는 두통(Headache) 말하기',
      '언제부터 아팠는지(Since yesterday) 말하기',
      '졸리지 않는 약(Non-drowsy) 요청하기'
    ]
  },
  {
    id: 'gym_membership',
    title: '피트니스 센터 1일권 문의하기',
    emoji: '🏋️',
    category: 'daily',
    description: '출장 중 들른 헬스장에서 1일권(Day pass) 가격과 샤워실 이용 가능 여부를 물어봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "Welcome to FitLife Gym! Are you a member or visiting us for the first time?",
    hiddenQuests: [
      '처음 방문했고 1일권(Day pass) 원한다고 말하기',
      '라커룸과 샤워실 이용 여부 묻기',
      '운동화 대여 가능한지 묻기'
    ]
  },
  {
    id: 'uber_ride',
    title: '우버 기사님과 목적지 가며 스몰토크',
    emoji: '🚕',
    category: 'daily',
    description: '공항으로 가는 우버 안에서 유쾌한 기사님과 교통 상황 및 음악 이야기를 나눠요.',
    suggestedLevel: 3,
    firstTurnPrompt: "Hop on in! Headed to the airport, right? How has your day been so far?",
    hiddenQuests: [
      '오늘 하루 어땠는지 가볍게 대답하기',
      '에어컨 온도 조절 요청해보기',
      '기사님에게도 오늘 일 어떠신지 역질문하기'
    ]
  },
  {
    id: 'hair_salon',
    title: '미용실에서 원하는 헤어스타일 설명',
    emoji: '💇',
    category: 'daily',
    description: '너무 짧지 않게 기장은 다듬기만 하고 숱을 쳐달라고 미용사에게 구체적으로 말해봐요.',
    suggestedLevel: 4,
    firstTurnPrompt: "Have a seat! What are we doing with your hair today? Any specific look in mind?",
    hiddenQuests: [
      '다듬기만 해달라(Just a trim)고 말하기',
      '옆머리와 윗머리 길이 구체적으로 설명하기',
      '왁스나 스타일링 팁 물어보기'
    ]
  },
  {
    id: 'library_seat',
    title: '도서관에서 자리 콘센트 양해 구하기',
    emoji: '📚',
    category: 'daily',
    description: '조용한 도서관에서 노트북 충전을 위해 옆자리 사람에게 콘센트를 같이 써도 되는지 조용히 물어봐요.',
    suggestedLevel: 2,
    firstTurnPrompt: "(Whispering) Hi, do you need some help finding a spot?",
    hiddenQuests: [
      '속삭이며 공손하게(Mind if I ~) 묻기',
      '콘센트(Power outlet) 나눠 쓰기 양해 구하기',
      '감사 인사 조용히 전하기'
    ]
  },

  // 5. 직장 & 비즈니스 (Work & Career)
  {
    id: 'weekend_chat',
    title: '월요일 아침 직장 동료와 주말 수다',
    emoji: '💼',
    category: 'work',
    description: '출근 후 탕비실에서 마주친 동료와 가볍게 주말에 뭐 했는지 스몰토크를 나눠요.',
    suggestedLevel: 3,
    firstTurnPrompt: "Morning! How was your weekend? Did you get to relax or do anything fun?",
    hiddenQuests: [
      '주말에 한 일 2가지 이상 말하기',
      '상대방 주말은 어땠는지 역질문하기',
      '필러 워드(Well, Honestly 등) 써보기'
    ]
  },
  {
    id: 'project_deadline',
    title: '외국인 동료에게 마감 일정 조율하기',
    emoji: '📅',
    category: 'work',
    description: '자료 수집에 시간이 더 필요해 보고서 마감일을 이틀만 미룰 수 있는지 논의해 봐요.',
    suggestedLevel: 4,
    firstTurnPrompt: "Hey! Just checking in on the quarterly report. Will you be able to submit it by tomorrow?",
    hiddenQuests: [
      '상황을 솔직하게 설명하기 (Running behind)',
      '마감 기한 연장(Extension) 정중히 요청하기',
      '새로운 마감 날짜(e.g., Friday) 제안하기'
    ]
  },
  {
    id: 'after_work_beer',
    title: '퇴근 후 동료에게 맥주 한잔 제안하기',
    emoji: '🍻',
    category: 'work',
    description: '힘든 한 주가 끝난 금요일 오후, 가볍게 생맥주 한잔하고 가자고 동료를 설득해 봐요.',
    suggestedLevel: 3,
    firstTurnPrompt: "Phew, what an exhausting week! I'm so glad it's finally Friday afternoon.",
    hiddenQuests: [
      '이번 주 정말 힘들었다고 공감하기',
      '생맥주 한잔(Grab a beer/drink) 하자고 꼬시기',
      '내가 첫 잔 쏘겠다고(It\'s on me) 말해보기'
    ]
  },
  {
    id: 'job_interview_icebreak',
    title: '영어 면접 시작 전 면접관과 아이스브레이킹',
    emoji: '🤝',
    category: 'work',
    description: '본격적인 인터뷰에 앞서, 면접관이 긴장을 풀어주기 위해 건네는 스몰토크에 유쾌하게 답해봐요.',
    suggestedLevel: 4,
    firstTurnPrompt: "Welcome! Thank you for taking the time to meet with us today. Did you find our office okay?",
    hiddenQuests: [
      '찾아오는 길이 편했다고 밝게 답하기',
      '면접 기회에 감사 인사 전하기',
      '오늘 날씨나 회사 분위기 칭찬하기'
    ]
  }
];
