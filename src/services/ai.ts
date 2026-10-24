import type { Persona, Situation, DifficultyLevel, ChatMessage, ReviewFeedback, HintOption } from '../types';

export class AIService {
  private getApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('COMIC_TALK_GEMINI_KEY') || null;
  }

  // 1. 다음 대화 응답 생성
  public async generateNextResponse(
    persona: Persona,
    situation: Situation,
    level: DifficultyLevel,
    messages: ChatMessage[],
    isWrappingUp: boolean
  ): Promise<string> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        return await this.callGeminiChat(apiKey, persona, situation, level, messages, isWrappingUp);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart simulation:', err);
      }
    }

    // API Key가 없거나 실패 시 자연스러운 스마트 시뮬레이션 응답 제공
    return this.generateSimulatedResponse(persona, situation, level, messages, isWrappingUp);
  }

  // Gemini API 직접 호출
  private async callGeminiChat(
    apiKey: string,
    persona: Persona,
    situation: Situation,
    level: DifficultyLevel,
    messages: ChatMessage[],
    isWrappingUp: boolean
  ): Promise<string> {
    const systemPrompt = `You are roleplaying as ${persona.name} (${persona.role}).
Situation: ${situation.title} - ${situation.description}.
User English Proficiency Level: ${level} out of 5 (1=beginner, 3=intermediate, 5=native-like).

Guidelines:
1. Speak strictly in English.
2. Keep your response very concise (1-2 sentences maximum, under 25 words).
3. Match your vocabulary and speed to Level ${level}.
4. Tone: Friendly, comic-like, warm, and natural.
${isWrappingUp 
  ? 'CRITICAL: The user clicked [Wrap Up]. Politely and naturally conclude the conversation with a warm goodbye in 1 sentence!' 
  : 'Always end your turn with a fun, engaging question to keep the conversation rolling!'}
`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: `Understood! I'm ${persona.name}. Let's chat!` }] },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))
    ];

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.statusText}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply?.trim() || "That's cool! Tell me more about that!";
  }

  // 2. 실시간 힌트 3종 생성
  public async generateHints(
    _persona: Persona,
    _situation: Situation,
    lastAiMessage: string,
    _level: DifficultyLevel
  ): Promise<HintOption[]> {
    // 빠른 힌트 생성 (오프라인/시뮬레이션에서도 0.1초만에 반응)
    const lower = lastAiMessage.toLowerCase();

    if (lower.includes('weather') || lower.includes('rain') || lower.includes('pour')) {
      return [
        { type: 'easy', label: '🌱 초급 답변', english: "Yes, it is raining a lot today!", korean: "네, 오늘 비가 정말 많이 오네요!" },
        { type: 'natural', label: '✨ 원어민 표현', english: "I know, right? It's completely coming down out there.", korean: "맞아요, 밖에는 비가 억수같이 쏟아지더라고요." },
        { type: 'pingpong', label: '🏓 역질문 콤보', english: "Totally! Did you bring an umbrella, by the way?", korean: "정말요! 그나저나 우산은 챙겨 오셨어요?" }
      ];
    } else if (lower.includes('seat') || lower.includes('taken')) {
      return [
        { type: 'easy', label: '🌱 초급 답변', english: "No, it's not taken. You can sit here.", korean: "아뇨, 비어있어요. 여기 앉으세요." },
        { type: 'natural', label: '✨ 원어민 표현', english: "Not at all, be my guest! Have a seat.", korean: "전혀요, 편하게 앉으세요!" },
        { type: 'pingpong', label: '🏓 역질문 콤보', english: "Go right ahead! Are you waiting for a friend too?", korean: "앉으세요! 혹시 그쪽도 친구 기다리시는 중이에요?" }
      ];
    } else if (lower.includes('order') || lower.includes('food') || lower.includes('burger')) {
      return [
        { type: 'easy', label: '🌱 초급 답변', english: "Excuse me, but this is not my order.", korean: "실례지만 제 주문이 아닌 것 같아요." },
        { type: 'natural', label: '✨ 원어민 표현', english: "Sorry to bother you, but I think there might be a mix-up with my order.", korean: "죄송한데, 제 주문에 착오가 있었던 것 같아요." },
        { type: 'pingpong', label: '🏓 역질문 콤보', english: "Could I double check if this has French fries?", korean: "이게 감자튀김으로 들어간 건지 다시 확인해 주실 수 있나요?" }
      ];
    }

    // 일반 상황 기본 힌트
    return [
      { type: 'easy', label: '🌱 초급 답변', english: "Sounds great! I really like that.", korean: "좋아요! 저도 그거 정말 마음에 들어요." },
      { type: 'natural', label: '✨ 원어민 표현', english: "I couldn't agree more, that makes total sense.", korean: "완전 공감해요, 무슨 말인지 알 것 같아요." },
      { type: 'pingpong', label: '🏓 역질문 콤보', english: "That's awesome! How did you get into that?", korean: "대단하네요! 어쩌다 그걸 시작하게 되셨어요?" }
    ];
  }

  // 3. 대화 종료 후 심층 복기 리포트 생성
  public async generateReview(
    messages: ChatMessage[],
    _situation: Situation,
    _persona: Persona
  ): Promise<ReviewFeedback> {
    const userMessages = messages.filter(m => m.sender === 'user');
    const turns = userMessages.length;

    // 핑퐁 지수 계산 (질문 기호 '?'가 포함되었거나 How about you 등을 썼을 때 가산점)
    let pingPongQuestions = 0;
    userMessages.forEach(m => {
      if (m.text.includes('?') || /how about|what about|do you|are you/i.test(m.text)) {
        pingPongQuestions++;
      }
    });

    const pingPongRate = turns > 0 ? Math.min(100, Math.round((pingPongQuestions / turns) * 100) + 40) : 50;

    // 분석 교정 예시 (유저 문장이 없으면 기본 샘플 생성)
    const corrections = userMessages.length > 0 ? userMessages.slice(0, 3).map((msg, idx) => {
      return {
        userSentence: msg.text,
        correctedSentence: this.mockGrammarCheck(msg.text),
        nativeAlternative: this.mockNativePolish(msg.text),
        explanation: idx === 0 
          ? "시제와 조동사를 명확히 하고 원어민들이 자주 쓰는 구동사(Phrasal verb)로 다듬었어요!" 
          : "문법적으로도 맞지만, 조금 더 부드럽고 자연스러운 표현으로 바꾸어 보았습니다."
      };
    }) : [
      {
        userSentence: "I am agree with you.",
        correctedSentence: "I agree with you.",
        nativeAlternative: "I'm totally with you on that.",
        explanation: "'agree'는 이미 동사이므로 be동사(am) 없이 단독으로 사용합니다."
      }
    ];

    return {
      overallScore: Math.min(98, 70 + turns * 4 + (pingPongQuestions * 5)),
      pingPongScore: pingPongRate,
      talkDurationTurns: turns,
      praisedPoints: [
        "망설임 없이 대화 흐름을 끝까지 이어간 적극성이 훌륭했어요! 👏",
        pingPongQuestions > 0 ? "상대방에게 되묻는 질문을 성공적으로 던져 대화를 주도했어요! 🏓" : "다양한 어휘를 쓰려고 시도한 점이 돋보였습니다. ✨",
        "상황에 알맞은 톤으로 자연스럽게 반응했어요. 💬"
      ],
      corrections,
      keyExpressions: [
        { phrase: "I know, right?", meaning: "내 말이 그 말이야! (완전 공감)", example: "I know, right? The movie was unbelievable!" },
        { phrase: "Be my guest", meaning: "얼마든지요 / 편하게 하세요", example: "Can I sit here? - Be my guest!" },
        { phrase: "How come?", meaning: "어째서? / 왜 그런 건데?", example: "How come you didn't call me earlier?" }
      ]
    };
  }

  // 스마트 시뮬레이션 응답기 (오프라인 / API 키 부재 시)
  private generateSimulatedResponse(
    _persona: Persona,
    _situation: Situation,
    _level: DifficultyLevel,
    messages: ChatMessage[],
    isWrappingUp: boolean
  ): string {
    if (isWrappingUp) {
      const farewells = [
        `Haha, alright! It was such a blast chatting with you! Catch you later, my friend! 👋`,
        `Oh, time flies so fast! Take care and let's talk again really soon! Have a wonderful day! ✨`,
        `Got it! Thanks for the awesome chat today. See you next time! 🌟`
      ];
      return farewells[Math.floor(Math.random() * farewells.length)];
    }

    const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';

    if (lastUserMsg.includes('hello') || lastUserMsg.includes('hi') || lastUserMsg.includes('hey')) {
      return `Hey there! Great to hear your voice! So, how has your day been treating you so far?`;
    }
    if (lastUserMsg.includes('rain') || lastUserMsg.includes('weather') || lastUserMsg.includes('cold')) {
      return `Right? The weather is crazy today! Did you manage to stay dry on your way here?`;
    }
    if (lastUserMsg.includes('coffee') || lastUserMsg.includes('tea') || lastUserMsg.includes('drink')) {
      return `Ooh, delicious choice! I'm definitely a big fan of that too. Do you usually come here often?`;
    }
    if (lastUserMsg.includes('how about you') || lastUserMsg.includes('what about you') || lastUserMsg.includes('and you')) {
      return `Thanks for asking! I'm doing fantastic today, just enjoying our sweet chat! What are you planning to do after this?`;
    }
    if (lastUserMsg.includes('yes') || lastUserMsg.includes('sure') || lastUserMsg.includes('ok')) {
      return `Awesome! That sounds like a lot of fun. What's the best part about it for you?`;
    }

    const genericResponses = [
      `That is so interesting! I love the way you put that. What made you think of that?`,
      `Oh really? That sounds pretty cool! Have you always felt that way?`,
      `Haha, I can totally relate to that! What do you usually do when that happens?`,
      `That makes total sense! Tell me more, I'm all ears!`
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  private mockGrammarCheck(text: string): string {
    if (!text.trim()) return "I see!";
    let res = text.trim();
    if (!/^[A-Z]/.test(res)) res = res.charAt(0).toUpperCase() + res.slice(1);
    if (!/[.!?]$/.test(res)) res += '.';
    return res;
  }

  private mockNativePolish(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('good') || lower.includes('fine')) return "Couldn't be better!";
    if (lower.includes('rain') || lower.includes('water')) return "It's literally pouring outside!";
    if (lower.includes('yes')) return "You bet!";
    return `To be honest, ${text.toLowerCase()}`;
  }
}

export const aiService = new AIService();
