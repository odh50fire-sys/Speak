# 💬 ComicTalk - 만화처럼 즐거운 AI 실전 영어회화 웹 앱

귀엽고 친근한 만화(Cartoon) 스타일의 실시간 영어 회화 코칭 애플리케이션입니다.  
고정된 대본 없이 유저의 대답에 따라 대화 시나리오가 실시간으로 변하며, 모바일과 PC 모두에서 완벽하게 동작합니다.

---

## ✨ 핵심 기능

1. **상황 기반 실시간 음성 대화 (STT & TTS)**:
   - 브라우저 내장 Web Speech API로 **별도 유료 비용 없이 즉시 무료 음성 대화 지원**.
   - Gemini API 키를 넣으면 최신 생성형 AI 모델과 통신, 미입력 시에도 똑똑한 **자체 스마트 시뮬레이션**으로 즉시 체험 가능.
2. **소프트 엔딩 (Soft Exit)**:
   - 강제 시간제한 없이, `[👋 대화 마무리]`를 누르면 AI가 자연스럽게 작별인사를 건네며 대화 종료.
3. **실시간 힌트 & 생존 영어**:
   - `[💡 힌트 보기]`: 초급 / 원어민 / 핑퐁 역질문 3가지 선택지 제공.
   - `[❓ 뭐라고?]`: 당황하지 않고 되묻는 실전 표현 자동 발화.
4. **만화책 컷 스타일 복기 리포트 (Review)**:
   - 팡파레와 함께 종합 회화 점수, 핑퐁(대화 주도) 지수, 문장별 원어민 표현 교정(Diff), 핵심 단어장 제공.
5. **실시간 테마/색감 변경 (DIY Color Changer)**:
   - 🧀 치즈 툰, 🍓 딸기 팝, 🫐 소다 스카이, 🥑 민트 클로버, 🔮 라벤더 드림 프리셋 지원.
   - 컬러 피커로 유저가 원하는 배경색과 버튼색을 실시간으로 직접 지정 가능.

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 후 마이크 버튼을 눌러 바로 영어로 대화해 보세요!

---

## 🌐 GitHub Pages 배포 방법

### 방법 1: GitHub Actions 자동 배포 (권장)
1. GitHub에 새 저장소(Repository)를 생성합니다.
2. 현재 코드를 저장소의 `main` 브랜치에 푸시합니다:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial ComicTalk release"
   git remote add origin https://github.com/사용자이름/저장소이름.git
   git push -u origin main
   ```
3. GitHub 저장소의 **Settings > Pages** 메뉴에서 Source를 **GitHub Actions**로 선택하면, 푸시할 때마다 자동으로 배포됩니다.

### 방법 2: 명령어로 즉시 배포 (`gh-pages`)
```bash
npm run deploy
```
