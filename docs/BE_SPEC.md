# 오뱅잇 BE_SPEC — 백엔드 기능/아키텍처 명세

## 1. 목적/범위

- 프론트 기능(스케줄 조회, 방송 상세, 문의하기)을 안정적으로 제공하는 백엔드 스펙 정의
- 백엔드는 **별도 프로젝트 폴더**로 구성하며, 본 문서는 해당 프로젝트의 기준 스펙으로 사용
- 현재 프론트에는 인증 기능이 없으므로 **공개 조회 + 문의 전송**이 핵심 범위
- 방송 데이터 입력/수정은 **내부 관리자/배치** 영역으로 분리

## 2. 아키텍처 개요

### 2.1. 구성

- **NestJS**: BFF(Backend For Frontend). 화면 단위 데이터 가공, 검증, 에러 표준화
- **Supabase**: Postgres + Auth + Storage
- **RLS(Row Level Security)**: 기본 활성화, 공개 조회 정책만 허용

### 2.2. 역할 분리 원칙

- **NestJS**: 일정 뷰(일간/주간/월간) 응답 가공, 문의 검증, 내부용 관리 API
- **Supabase**: 데이터 저장, 기본 조회, 스토리지(썸네일/아바타)
- **Service Role Key**: 관리자/배치 작업에만 사용(클라이언트 노출 금지)

## 3. 프로젝트 구조(백엔드 별도 폴더 기준)

```
backend/
├── src/
│   ├── app.module.ts
│   ├── modules/
│   │   ├── schedule/
│   │   ├── broadcasts/
│   │   ├── contact/
│   │   └── admin/
│   ├── common/
│   │   ├── filters/   # 예외 필터
│   │   ├── pipes/     # 검증 파이프
│   │   └── utils/
│   └── infra/
│       └── supabase/  # Supabase 클라이언트
└── .env
```

## 4. 도메인/데이터 모델

### 4.1. 테이블 설계 (Supabase Postgres)

#### streamers

| 컬럼        | 타입        | 제약             | 설명              |
| ----------- | ----------- | ---------------- | ----------------- |
| id          | uuid        | PK               | 스트리머 ID       |
| name        | text        | unique, not null | 스트리머명        |
| profile_url | text        |                  | 프로필 이미지 URL |
| channel_url | text        |                  | 방송국 외부 링크  |
| created_at  | timestamptz | default now()    | 생성 시각         |

#### broadcasts

| 컬럼          | 타입        | 제약             | 설명                |
| ------------- | ----------- | ---------------- | ------------------- |
| id            | uuid        | PK               | 방송 ID             |
| streamer_id   | uuid        | FK(streamers.id) | 스트리머            |
| title         | text        | not null         | 방송 제목           |
| category      | text        | not null         | 카테고리            |
| game_title    | text        |                  | 게임 제목(선택)     |
| start_time    | timestamptz | not null         | 시작 시각           |
| end_time      | timestamptz |                  | 종료 시각           |
| thumbnail_url | text        |                  | 썸네일 URL          |
| is_live       | boolean     | default false    | 라이브 여부(캐시용) |
| is_collab     | boolean     | default false    | 합방 여부(캐시용)   |
| created_at    | timestamptz | default now()    | 생성 시각           |
| updated_at    | timestamptz | default now()    | 수정 시각           |

#### participants

| 컬럼       | 타입 | 제약     | 설명        |
| ---------- | ---- | -------- | ----------- |
| id         | uuid | PK       | 참여자 ID   |
| name       | text | not null | 참여자 이름 |
| avatar_url | text |          | 아바타 URL  |

#### broadcast_participants

| 컬럼           | 타입 | 제약                    | 설명   |
| -------------- | ---- | ----------------------- | ------ |
| broadcast_id   | uuid | PK, FK(broadcasts.id)   | 방송   |
| participant_id | uuid | PK, FK(participants.id) | 참여자 |

#### tags

| 컬럼 | 타입 | 제약             | 설명    |
| ---- | ---- | ---------------- | ------- |
| id   | uuid | PK               | 태그 ID |
| name | text | unique, not null | 태그명  |

#### broadcast_tags

| 컬럼         | 타입 | 제약                  | 설명 |
| ------------ | ---- | --------------------- | ---- |
| broadcast_id | uuid | PK, FK(broadcasts.id) | 방송 |
| tag_id       | uuid | PK, FK(tags.id)       | 태그 |

### 4.2. 인덱스 권장

- broadcasts(start_time)
- broadcasts(streamer_id)
- broadcast_participants(broadcast_id)
- broadcast_tags(broadcast_id)

### 4.3. 데이터 가공 규칙

- `is_live`: `now()`가 `start_time ~ end_time` 범위이면 `true`
- `is_collab`: 참여자 수가 2명 이상이면 `true`
- `collabPartners`: 참여자 이름 목록(스트리머 제외)을 응답 시 생성
- 참여자 정렬: `name` 기준 `localeCompare('ko')`
- 참여자 데이터가 없을 경우 `streamerName`을 기본 참여자로 생성

## 5. API 설계 (NestJS)

### 5.1. 공통 규칙

- Base URL: `/api`
- 시간 포맷: ISO 8601 (timestamptz, UTC 저장)
- 응답은 프론트의 `Broadcast` 타입과 1:1 매핑

### 5.2. 스케줄 조회

#### `GET /api/schedule`

**Query**

| 파라미터 | 필수 | 예시                   | 설명                  |
| -------- | ---- | ---------------------- | --------------------- |
| view     | Y    | daily\|weekly\|monthly | 뷰 모드               |
| date     | Y    | 2026-02-15             | 기준 날짜(YYYY-MM-DD) |
| tz       | N    | Asia/Seoul             | 타임존(선택)          |

**Response (daily)**

```json
{
  "view": "daily",
  "date": "2026-02-15",
  "totalCount": 4,
  "items": [Broadcast]
}
```

**Response (weekly)**

```json
{
  "view": "weekly",
  "weekStart": "2026-02-09",
  "weekEnd": "2026-02-15",
  "days": [
    {
      "date": "2026-02-09",
      "totalCount": 3,
      "items": [Broadcast]
    }
  ]
}
```

**Response (monthly)**

```json
{
  "view": "monthly",
  "month": "2026-02",
  "gridStart": "2026-01-26",
  "gridEnd": "2026-03-01",
  "days": [
    {
      "date": "2026-02-01",
      "totalCount": 5,
      "items": [Broadcast]
    }
  ]
}
```

- weekly: `items`는 기본 3개까지 (UI에서 `+N개 더보기` 구현용)
- monthly: `items`는 기본 2개까지

### 5.3. 방송 상세

#### `GET /api/broadcasts/:id`

**Response**

```json
{
    "id": "uuid",
    "title": "...",
    "streamerName": "...",
    "streamerProfileUrl": "...",
    "streamerChannelUrl": "...",
    "category": "...",
    "gameTitle": "...",
    "tags": ["tag1"],
    "participants": [{ "name": "...", "avatarUrl": "..." }],
    "startTime": "2026-02-15T11:00:00Z",
    "endTime": "2026-02-15T14:00:00Z",
    "isLive": true,
    "isCollab": true,
    "collabPartners": ["..."],
    "thumbnailUrl": "..."
}
```

### 5.4. 문의하기

#### `POST /api/contact/inquiries`

**Body**

```json
{
  "title": "string",
  "email": "string?",
  "inquiryType": "schedule" | "other",
  "content": "string"
}
```

**Validation**

- title: 2~80자
- email: 선택, 이메일 형식 검증
- inquiryType: `schedule` 또는 `other`
- content: 10~2000자

**처리**

- 문의는 디스코드로 전달하며 별도 저장하지 않음

**Response**

```json
{ "status": "sent" }
```

### 5.5. 헬스체크

#### `GET /api/health`

```json
{ "status": "ok" }
```

### 5.6. 내부 관리자용(서비스 계정)

- `POST /api/admin/broadcasts`
- `PATCH /api/admin/broadcasts/:id`
- `DELETE /api/admin/broadcasts/:id`
- `POST /api/admin/broadcasts/bulk`

> 내부 관리자 엔드포인트는 **서비스 계정 키** 또는 내부 네트워크에서만 허용

## 6. 인증/권한 정책(RLS)

### 6.1. 공개 정책

- `broadcasts`, `streamers`, `participants`, `tags`: **select 허용(anon/authenticated)**

### 6.2. 관리자 정책

- 서비스 계정 키로만 데이터 수정 가능
- NestJS 서버 환경 변수로만 관리 (`SUPABASE_SERVICE_ROLE_KEY`)

## 7. 스토리지 정책

- 썸네일/아바타는 Supabase Storage 버킷(예: `public-assets`) 사용
- 기본 공개 URL 사용, 필요 시 CDN 캐싱

## 8. 에러 응답 규격

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "...",
        "details": [{ "field": "title", "reason": "too_short" }]
    }
}
```

## 9. 운영/보안

- RLS 기본 활성화
- NestJS는 공개 키(anon) 기반으로 읽기, 서비스 키는 관리자 작업에만 사용
- 요청 제한: `/api/contact/inquiries`는 IP 기반 rate limit 적용(예: 5req/min)
- 로그: 요청 ID, 경로, 처리 시간, status code 기록

## 10. 프론트 모델 매핑

`Broadcast` 타입 필드 매핑 기준:

- `streamerName` ← streamers.name
- `streamerProfileUrl` ← streamers.profile_url
- `category` ← broadcasts.category
- `gameTitle` ← broadcasts.game_title
- `participants` ← broadcast_participants + participants
- `tags` ← broadcast_tags + tags
- `startTime` / `endTime` ← broadcasts.start_time / end_time
- `isLive` / `isCollab` ← 계산 또는 캐시 필드
- `thumbnailUrl` ← broadcasts.thumbnail_url

## 11. 추후 확장 포인트

- 관리자 UI 추가 시 Supabase Auth + RBAC 도입
- 알림 기능(방송 시작 알림) 추가 시 Queue/Worker 분리
- 외부 소스 크롤링 또는 파트너 연동 시 배치 파이프라인 구성
