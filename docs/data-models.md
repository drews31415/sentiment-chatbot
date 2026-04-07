# 데이터 모델

## SQL 스키마

### sohwakhaeng_records

```sql
CREATE TABLE sohwakhaeng_records (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES auth.users(id),
    image_url        TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude         DOUBLE PRECISION,
    longitude        DOUBLE PRECISION,
    raw_user_text    TEXT,
    vision_tags      JSONB DEFAULT '[]',
    emotion_tags     JSONB DEFAULT '[]',
    context_keywords JSONB DEFAULT '[]',
    ai_comment       TEXT,
    skip_flag        BOOLEAN NOT NULL DEFAULT FALSE,
    emotion_polarity VARCHAR(10) CHECK (emotion_polarity IN ('positive', 'neutral', 'negative')),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_records_user_id ON sohwakhaeng_records(user_id);
CREATE INDEX idx_records_created_at ON sohwakhaeng_records(created_at DESC);
CREATE INDEX idx_records_location ON sohwakhaeng_records USING GIST (
    ST_MakePoint(longitude, latitude)
);

-- RLS 정책
ALTER TABLE sohwakhaeng_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records"
    ON sohwakhaeng_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
    ON sohwakhaeng_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### user_preferences

```sql
CREATE TABLE user_preferences (
    user_id              UUID PRIMARY KEY REFERENCES auth.users(id),
    preference_vector    vector(256),
    top_emotion_tags     JSONB DEFAULT '[]',
    top_context_keywords JSONB DEFAULT '[]',
    preferred_time_slots JSONB DEFAULT '[]',
    preferred_place_types JSONB DEFAULT '[]',
    emotion_frequency    JSONB DEFAULT '{}',
    total_records        INTEGER DEFAULT 0,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);
```

### 필요 익스텐션

```sql
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

## TypeScript 타입

### 핵심 데이터

```typescript
// 소확행 기록
interface SohwakhaengRecord {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: Date;
  latitude: number | null;
  longitude: number | null;
  rawUserText: string | null;
  visionTags: string[];
  emotionTags: string[];
  contextKeywords: string[];
  aiComment: string | null;
  skipFlag: boolean;
  emotionPolarity: 'positive' | 'neutral' | 'negative' | null;
}

// EXIF 메타데이터
interface ExifMetadata {
  dateTaken: Date | null;
  latitude: number | null;
  longitude: number | null;
}

// 지도 핀 뷰모델
interface RecordPin {
  id: string;
  latitude: number;
  longitude: number;
  thumbnailUrl: string;
  emotionKeyword: string;
  shortText: string;
}

// 최근 카드 뷰모델
interface RecentCard {
  id: string;
  imageUrl: string;
  emotionKeyword: string;
  shortText: string;
  createdAt: Date;
}
```

### AI/감정 분석

```typescript
// Vision API 결과
interface VisionResult {
  visionTags: string[];
  confidence: number;
  rawResponse: object;
}

// 감정 추출 결과
interface EmotionResult {
  emotionPolarity: 'positive' | 'neutral' | 'negative';
  emotionTags: string[];
  contextKeywords: string[];
}

// 감정 분석 데이터 (직렬화 대상)
interface EmotionAnalysisData {
  emotionTags: string[];
  emotionPolarity: 'positive' | 'neutral' | 'negative';
  contextKeywords: string[];
  visionTags: string[];
}

// AI 코멘트 생성 입력
interface CommentInput {
  visionTags: string[];
  emotionTags: string[];
  contextKeywords: string[];
  userText: string | null;
  location: { latitude: number; longitude: number } | null;
  createdAt: Date;
  userPreferences: PreferenceVector | null;
}
```

### 사용자 취향

```typescript
interface PreferenceVector {
  vector: number[];
  topEmotionTags: string[];
  topContextKeywords: string[];
  preferredTimeSlots: string[];
  preferredPlaceTypes: string[];
  emotionFrequency: Record<string, number>;
  totalRecords: number;
}
```

### FSM (대화 상태 관리)

```typescript
type ConversationState =
  | 'PHOTO_UPLOADED'
  | 'VISION_ANALYZING'
  | 'VISION_FAILED'
  | 'QUESTION_GENERATED'
  | 'AWAITING_RESPONSE'
  | 'SKIP_HIGHLIGHTED'
  | 'RESPONSE_RECEIVED'
  | 'SKIPPED'
  | 'EMOTION_ANALYZING'
  | 'COMMENT_GENERATING'
  | 'COMMENT_READY'
  | 'COMMENT_FAILED'
  | 'FALLBACK_COMMENT'
  | 'FALLBACK_SAVE'
  | 'INSIGHT_DISPLAYED'
  | 'RECORD_SAVING'
  | 'COMPLETED';

type ConversationEvent =
  | { type: 'PHOTO_UPLOAD_COMPLETE'; imageUrl: string; exif: ExifMetadata }
  | { type: 'VISION_ANALYSIS_COMPLETE'; result: VisionResult }
  | { type: 'VISION_ANALYSIS_FAILED'; error: Error }
  | { type: 'USER_RESPONSE'; text: string }
  | { type: 'USER_SKIP' }
  | { type: 'TIMEOUT_10S' }
  | { type: 'EMOTION_ANALYSIS_COMPLETE'; result: EmotionResult }
  | { type: 'COMMENT_GENERATED'; comment: string }
  | { type: 'COMMENT_GENERATION_FAILED'; error: Error }
  | { type: 'INSIGHT_CLOSED' }
  | { type: 'RECORD_SAVED' };

interface ConversationContext {
  imageUrl: string | null;
  exifMetadata: ExifMetadata | null;
  visionResult: VisionResult | null;
  userText: string | null;
  emotionResult: EmotionResult | null;
  aiComment: string | null;
  skipFlag: boolean;
}

interface MapBounds {
  northEast: { latitude: number; longitude: number };
  southWest: { latitude: number; longitude: number };
}
```

## Zod 스키마 (런타임 검증)

```typescript
import { z } from 'zod';

export const EmotionAnalysisDataSchema = z.object({
  emotionTags: z.array(z.string()).min(1),
  emotionPolarity: z.enum(['positive', 'neutral', 'negative']),
  contextKeywords: z.array(z.string()).min(1),
  visionTags: z.array(z.string()),
});

export const VisionResultSchema = z.object({
  visionTags: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  rawResponse: z.object({}).passthrough(),
});

export const SohwakhaengRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  imageUrl: z.string().url(),
  createdAt: z.coerce.date(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  rawUserText: z.string().nullable(),
  visionTags: z.array(z.string()),
  emotionTags: z.array(z.string()),
  contextKeywords: z.array(z.string()),
  aiComment: z.string().nullable(),
  skipFlag: z.boolean(),
  emotionPolarity: z.enum(['positive', 'neutral', 'negative']).nullable(),
});
```
