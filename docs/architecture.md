# 시스템 아키텍처

## 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | React 19 + Vite 6 | TypeScript |
| 라우팅 | React Router v7 | |
| 상태관리 | Zustand | 경량, 4개 스토어 |
| 유효성검증 | Zod | 런타임 타입 검증 |
| 지도 | Leaflet + React Leaflet | CartoDB Positron 타일셋 |
| 스타일링 | Tailwind CSS 4 | 커스텀 테마 토큰 |
| 백엔드 | Supabase | Auth + DB + Storage + Edge Functions |
| AI | Gemini 2.0 Flash | Edge Functions 경유 |
| 테스트 | Vitest + fast-check | 속성 기반 + 단위 테스트 |
| 배포 | Vercel + Supabase | |

## 시스템 아키텍처

```
┌─────────────────────────────────────┐
│          클라이언트 (React)           │
│                                     │
│  Home ──── Capture Flow ──── Discovery │
│  (지도)    (사진→채팅→인사이트)   (주간요약)  │
│                                     │
│  Zustand Stores:                    │
│  authStore | recordStore | captureStore | uiStore │
└────────────┬────────────────────────┘
             │ Supabase Client SDK
             ▼
┌─────────────────────────────────────┐
│          Supabase                    │
│                                     │
│  Auth ─── Database ─── Storage      │
│  (카카오/  (PostgreSQL  (photos/    │
│   Google)  + pgvector    {uid}/     │
│            + PostGIS)    {rid}.jpg) │
│                                     │
│  Edge Functions:                    │
│  analyze-photo | generate-insight | save-record │
│       │              │                │
│       ▼              ▼                │
│  ┌──────────────────────┐            │
│  │   Gemini 2.0 Flash   │            │
│  │  (Vision + NLP + Gen) │            │
│  └──────────────────────┘            │
└─────────────────────────────────────┘
```

## 사용자 플로우

```
홈 화면 (지도)
    │
    ├── 핀 탭 → 바텀 시트 (기록 상세)
    │
    └── FAB 탭 → 캡처 플로우 (풀스크린)
                    │
                    ├── Step 1: 사진 촬영/선택
                    │   └── EXIF 추출 + Storage 업로드
                    │
                    ├── Step 2: AI 채팅
                    │   ├── analyze-photo → 질문 생성
                    │   ├── 사용자 답변 입력
                    │   └── 10초 무입력 → 스킵 강조
                    │
                    ├── Step 3: 인사이트
                    │   ├── generate-insight → AI 코멘트
                    │   ├── 감정 태그 표시
                    │   └── 저장 → save-record
                    │
                    └── → 홈 복귀
```

## FSM (대화 상태 머신)

17개 상태, 정상/스킵/에러 3가지 경로:

```
PHOTO_UPLOADED
  → VISION_ANALYZING
    → QUESTION_GENERATED → AWAITING_RESPONSE
    → VISION_FAILED → FALLBACK_SAVE ──────────┐
                                                │
AWAITING_RESPONSE                               │
  → RESPONSE_RECEIVED → EMOTION_ANALYZING       │
  → SKIPPED ────────────────────────────────────┤
  → SKIP_HIGHLIGHTED (10초)                     │
    → RESPONSE_RECEIVED / SKIPPED               │
                                                │
EMOTION_ANALYZING                               │
  → COMMENT_GENERATING                          │
    → COMMENT_READY → INSIGHT_DISPLAYED         │
    → COMMENT_FAILED → FALLBACK_COMMENT         │
                                                │
INSIGHT_DISPLAYED / FALLBACK_COMMENT / SKIPPED  │
  → RECORD_SAVING ←────────────────────────────┘
    → COMPLETED → 홈 복귀
```

## Zustand 스토어

### authStore
```typescript
{
  user: User | null;
  session: Session | null;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}
```

### recordStore
```typescript
{
  records: SohwakhaengRecord[];
  pins: RecordPin[];
  recentCards: RecentCard[];
  loadPins(bounds: MapBounds): Promise<void>;
  loadRecentCards(limit: number): Promise<void>;
  addRecord(record: SohwakhaengRecord): void;
}
```

### captureStore
```typescript
{
  state: ConversationState;
  context: ConversationContext;
  transition(event: ConversationEvent): void;
  reset(): void;
}
```

### uiStore
```typescript
{
  bottomSheetRecord: SohwakhaengRecord | null;
  isLoading: boolean;
  openBottomSheet(record: SohwakhaengRecord): void;
  closeBottomSheet(): void;
}
```

## 에러 처리 전략

| 에러 | 처리 | 사용자 메시지 |
|------|------|-------------|
| Vision API 실패 | FALLBACK_SAVE | "분석에 시간이 좀 더 필요해요. 사진은 안전하게 저장했어요." |
| 코멘트 생성 실패 | FALLBACK_COMMENT | "지금은 코멘트를 준비하지 못했어요. 대신 따뜻한 한마디를 남겨둘게요." |
| EXIF 추출 실패 | null 필드 + 기기 위치 폴백 | (무음) |
| 이미지 업로드 실패 | 3회 재시도 → 로컬 큐 | "네트워크 상태를 확인해주세요." |
| DB 저장 실패 | 로컬 큐 → 복구 시 동기화 | "기록을 임시 저장했어요. 곧 동기화할게요." |
| 감정 분석 실패 | 기본 태그('기록됨') + 중립 극성 | (무음, 기본 태그 사용) |
