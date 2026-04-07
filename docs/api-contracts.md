# API 계약 (Supabase Edge Functions)

## 엔드포인트 목록

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/analyze-photo` | POST | 사진 분석 + AI 질문 생성 |
| `/generate-insight` | POST | 감정 추출 + AI 코멘트 생성 |
| `/save-record` | POST | 기록 저장 + 취향 벡터 갱신 |

모든 엔드포인트는 Supabase Auth JWT 토큰 필수 (`Authorization: Bearer <token>`)

---

## POST /analyze-photo

Vision API로 사진 분석 후 공감형 질문을 생성한다.

### Request

```typescript
{
  imageUrl: string;   // Supabase Storage signed URL
}
```

### Response (200)

```typescript
{
  visionResult: {
    visionTags: string[];     // ["커피", "따뜻한 톤", "카페", "오후 빛"]
    confidence: number;       // 0.0 ~ 1.0
  };
  question: string;           // "이 사진, 왠지 마음이 편안해 보여요. 어떤 순간이었나요?"
}
```

### Response (500) - Vision API 실패

```typescript
{
  error: "VISION_ANALYSIS_FAILED";
  message: string;
}
```

**클라이언트 처리**: FSM → VISION_FAILED → FALLBACK_SAVE 경로

---

## POST /generate-insight

감정 추출 + AI 코멘트를 생성한다. 텍스트 없이 비전 결과만으로도 동작.

### Request

```typescript
{
  visionResult: {
    visionTags: string[];
    confidence: number;
  };
  userText: string | null;          // 사용자 답변 (건너뛰기 시 null)
  location: {
    latitude: number;
    longitude: number;
  } | null;
  createdAt: string;                // ISO 8601
}
```

### Response (200)

```typescript
{
  emotionResult: {
    emotionPolarity: 'positive' | 'neutral' | 'negative';
    emotionTags: string[];          // ["편안함", "여유"]
    contextKeywords: string[];      // ["커피", "혼자만의 시간"]
  };
  aiComment: string;                // "잠시 멈춰 쉬는 시간도 충분히 소중한 행복이 될 수 있어요."
}
```

### Response (500) - 코멘트 생성 실패

```typescript
{
  error: "COMMENT_GENERATION_FAILED";
  fallbackComment: string;          // 기본 감성 메시지
  emotionResult: { ... } | null;    // 감정 분석이 성공했으면 포함
}
```

**클라이언트 처리**: fallbackComment를 사용하여 인사이트 표시, 정상 저장 진행

---

## POST /save-record

소확행 기록 저장 + 사용자 취향 벡터 갱신.

### Request

```typescript
{
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  rawUserText: string | null;
  visionTags: string[];
  emotionTags: string[];
  contextKeywords: string[];
  emotionPolarity: 'positive' | 'neutral' | 'negative' | null;
  aiComment: string | null;
  skipFlag: boolean;
}
```

### Response (201)

```typescript
{
  recordId: string;                 // UUID
  createdAt: string;                // ISO 8601
}
```

### Response (400) - 유효성 검증 실패

```typescript
{
  error: "VALIDATION_ERROR";
  details: string[];                // 구체적 필드 오류
}
```

---

## 에러 코드 정리

| 코드 | 의미 | 클라이언트 처리 |
|------|------|----------------|
| `VISION_ANALYSIS_FAILED` | Vision API 호출 실패 | FALLBACK_SAVE (사진+메타만 저장) |
| `COMMENT_GENERATION_FAILED` | AI 코멘트 생성 실패 | fallbackComment 사용 |
| `VALIDATION_ERROR` | 요청 데이터 유효성 실패 | 에러 메시지 표시 |
| `UNAUTHORIZED` | 인증 실패 | 로그인 화면으로 |

## Supabase Storage

### 버킷 구조

```
photos/
  {user_id}/
    {record_id}.jpg
```

### 이미지 업로드 플로우

1. 클라이언트에서 Supabase Storage에 직접 업로드
2. 업로드 완료 → signed URL 획득
3. signed URL을 `/analyze-photo` 에 전달

### 이미지 변환 (썸네일)

Supabase Image Transform 프록시 사용:
```
{storage_url}/render/image/public/photos/{path}?width=200&height=200&resize=cover
```
