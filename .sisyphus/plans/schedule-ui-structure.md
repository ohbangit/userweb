# 계획: 카드 UI 리디자인 + 디렉토리 구조 개편

## 목표

- 카드 UI를 Vercel 스타일의 정돈감은 유지하면서 치지직 느낌의 생동감을 반영
- Vite 환경을 유지한 채 Next의 디렉토리 감성을 살린 feature 기반 구조로 개편

## 범위

- UI 대상: `BroadcastCard`, `DailyBroadcastItem`, 관련 배지 컴포넌트
- 구조 대상: `src/pages`, `src/components`, `src/utils` 일부를 `src/app`, `src/features`, `src/shared`로 이동

## 단계

1. 현 구조와 의존성 확인
2. feature 기반 디렉토리 구조 설계 및 이동 계획 수립
3. 카드 UI 리디자인(배지/타이포/레이아웃/그라데이션/보더)
4. 파일 이동 및 import 경로 업데이트
5. 빌드로 타입/번들 확인

## 리스크 및 완화

- import 경로 누락 가능성 → 전체 Grep로 경로 점검
- 공통 컴포넌트 중복 → `shared/components`로 정리
- 스타일 과잉 → 기존 컬러 토큰 유지, 변형은 카드 내부로 제한

## 검증

- `yarn build` 통과
