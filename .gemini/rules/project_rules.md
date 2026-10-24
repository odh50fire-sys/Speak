# 프로젝트 개발 및 Git 백업 규칙 (Project Rules)

이 프로젝트(`ComicTalk / Speak`)에서 작업할 때 아래 규칙을 항상 엄격하게 준수합니다.

## 1. 자동 Git 백업 및 푸시 (Mandatory Git Backup)
- 유저의 요청으로 코드, 스타일, 리소스, 설정 등을 수정한 후에는 **반드시 Git에 커밋하고 원격 저장소(`main` 브랜치)로 푸시**합니다.
- 웹 배포 반영을 위해 변경 시 항상 `npm.cmd run build`를 실행하여 `/docs` 폴더를 함께 빌드 및 커밋합니다.

## 2. 한글 커밋 메시지 (Korean Commit Comments)
- Git 커밋 메시지(commit comment)는 **반드시 한글로 간략하고 명확하게** 작성합니다.
  - 예시: `git commit -m "헤더 색상 변경 기능 추가"`
  - 예시: `git commit -m "마이크 인식 예외 처리 및 UI 개선"`
  - 예시: `git commit -m "구현 계획서 최신화 및 배포 반영"`

## 3. 구현 계획서(Implementation Plan) 지속적 갱신
- 프로젝트의 구조, 주요 기능, 아키텍처, 데이터 모델 등에 중요한 수정사항이 발생할 경우, **반드시 구현 계획서 마크다운 파일(`english_speaking_app_implementation_plan.md`)을 최신 상태로 갱신**합니다.
