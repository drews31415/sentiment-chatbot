# 테스트 전략

## 프레임워크

| 도구 | 용도 |
|------|------|
| **Vitest** | 테스트 러너 |
| **fast-check** | 속성 기반 테스트 (Property-Based Testing) |
| **Playwright** | E2E 테스트 |
| **Testing Library** | 컴포넌트 테스트 |

## 디렉토리 구조

```
tests/
├── properties/                          # 속성 기반 테스트 (12개)
│   ├── record-viewmodel.property.test.ts    # P1
│   ├── recent-cards-limit.property.test.ts  # P2
│   ├── exif-extraction.property.test.ts     # P3
│   ├── fsm-transitions.property.test.ts     # P4
│   ├── skip-path.property.test.ts           # P5
│   ├── emotion-analysis.property.test.ts    # P6
│   ├── preference-update.property.test.ts   # P7
│   ├── error-recovery.property.test.ts      # P8
│   ├── record-roundtrip.property.test.ts    # P9
│   ├── cumulative-analysis.property.test.ts # P10
│   ├── serialization.property.test.ts       # P11
│   └── invalid-json.property.test.ts        # P12
├── unit/
│   ├── fsm.test.ts
│   ├── exif.test.ts
│   ├── serializer.test.ts
│   ├── fallback-comment.test.ts
│   └── flow-steps.test.ts
├── components/
│   ├── capture-flow.test.tsx
│   ├── home-map.test.tsx
│   └── bottom-sheet.test.tsx
├── integration/
│   └── edge-functions.test.ts
├── e2e/
│   ├── happy-path.spec.ts
│   └── skip-path.spec.ts
└── generators/
    ├── record.generator.ts
    ├── emotion.generator.ts
    ├── vision.generator.ts
    └── conversation.generator.ts
```

## 12개 정확성 속성

각 속성 테스트는 **최소 100회 반복** 실행. 태그: `Feature: sohwakhaeng-service, Property {N}`

### P1: 기록→뷰모델 변환 필수 필드
- **규칙**: SohwakhaengRecord → RecordPin 변환 시 thumbnailUrl, emotionKeyword, shortText가 항상 비어있지 않음. RecentCard도 동일.
- **검증**: Req 1.1, 1.2, 1.5
- **생성기**: 임의의 SohwakhaengRecord

### P2: 최근 기록 카드 개수 제한
- **규칙**: getRecentByUser(limit=4) → 반환 수 ≤ min(전체 기록 수, 4)
- **검증**: Req 1.4
- **생성기**: 임의의 기록 목록 (0~100개)

### P3: EXIF 메타데이터 추출
- **규칙**: EXIF 있는 사진 → dateTaken, latitude, longitude 포함. 없으면 각 null.
- **검증**: Req 2.5
- **생성기**: EXIF 유무 랜덤 사진

### P4: FSM 유효 상태 전이
- **규칙**: 정의된 전이 규칙에 따라 올바른 다음 상태 반환. 특히:
  - PHOTO_UPLOADED + VISION_ANALYSIS_COMPLETE → QUESTION_GENERATED
  - AWAITING_RESPONSE + USER_RESPONSE → RESPONSE_RECEIVED
  - AWAITING_RESPONSE + USER_SKIP → SKIPPED
  - AWAITING_RESPONSE + TIMEOUT_10S → SKIP_HIGHLIGHTED
  - INSIGHT_DISPLAYED + INSIGHT_CLOSED → RECORD_SAVING
- **검증**: Req 2.2, 2.3, 3.3, 3.5, 5.5, 7.1, 7.2
- **생성기**: 임의의 (상태, 이벤트) 쌍

### P5: 건너뛰기 경로 데이터 무결성
- **규칙**: 스킵 시 skip_flag=true, raw_user_text=null, image_url과 위치 정보 원본 유지
- **검증**: Req 3.4, 7.3, 8.2
- **생성기**: 임의의 ConversationContext + SKIP 이벤트

### P6: 감정 분석 결과 구조 무결성
- **규칙**: 분석 결과에 항상 유효한 emotionPolarity + 비어있지 않은 emotionTags/contextKeywords
- **검증**: Req 4.1, 4.2, 4.3
- **생성기**: 임의의 VisionResult + 선택적 텍스트

### P7: 취향 벡터 갱신 단조성
- **규칙**: 갱신 후 totalRecords 정확히 +1, 새 태그/키워드 누적 반영
- **검증**: Req 4.4
- **생성기**: 임의의 PreferenceVector + EmotionResult

### P8: 오류 시 데이터 보존 및 복구
- **규칙**: 오류 후에도 수집된 imageUrl, exifMetadata 등 보존. getFallbackComment는 항상 비어있지 않은 문자열 반환.
- **검증**: Req 4.5, 5.6, 7.4
- **생성기**: 임의의 ConversationContext + 오류 이벤트

### P9: 기록 저장-조회 라운드트립
- **규칙**: save → getById 시 모든 필드 원본 동일. 저장 후 getRecordPins에 핀 포함.
- **검증**: Req 6.1, 6.2, 6.3
- **생성기**: 임의의 SohwakhaengRecord
- **참고**: DB 필요 (Supabase 로컬 dev)

### P10: 누적 분석 데이터 갱신
- **규칙**: 새 기록 추가 시 누적 데이터 (트리거, 장소, 시간대, 빈도) 일관 갱신
- **검증**: Req 6.4
- **생성기**: 임의의 기록 시퀀스
- **참고**: DB 필요

### P11: 감정 데이터 직렬화 라운드트립
- **규칙**: serialize → deserialize = 원본 동일
- **검증**: Req 9.1, 9.2, 9.3
- **생성기**: 임의의 EmotionAnalysisData

### P12: 잘못된 JSON 오류 반환
- **규칙**: 유효하지 않은 JSON → 구체적 파싱 오류 메시지 포함 에러
- **검증**: Req 9.4
- **생성기**: 임의의 잘못된 JSON 문자열

## 단위 테스트 영역

| 영역 | 테스트 내용 |
|------|-----------|
| FSM 엣지 | 유효하지 않은 전이, 초기 상태, 10초 타임아웃 |
| EXIF 엣지 | EXIF 없는 사진, 부분적 EXIF (GPS만/날짜만) |
| 직렬화 엣지 | 빈 배열, 특수문자, 긴 문자열, 필수 필드 누락, 잘못된 타입 |
| 스킵 플로우 | 스킵 시 정확한 필드 설정 |
| 폴백 코멘트 | 빈 emotionTags → 비어있지 않은 문자열 |
| UX 플로우 | 4단계 이내 완료, 편집 단계 없음 |

## 컴포넌트 테스트

| 컴포넌트 | 테스트 내용 |
|----------|-----------|
| CaptureFlow | 스텝 전환, 스킵 버튼 10초 강조, 입력 → 전송 |
| HomeMap | 핀 렌더링, 카드 스와이프, FAB 클릭 |
| BottomSheet | 열기/닫기, 기록 상세 표시 |

## E2E 테스트 (Playwright)

### happy-path.spec.ts
1. 홈 → FAB 클릭
2. 갤러리에서 사진 선택
3. AI 질문 표시 확인
4. 텍스트 입력 → 전송
5. AI 코멘트 표시 확인
6. 저장 → 홈 복귀
7. 지도에 새 핀 표시 확인

### skip-path.spec.ts
1. 홈 → FAB 클릭
2. 사진 선택
3. 건너뛰기 클릭
4. 홈 복귀
5. 지도에 핀 표시 (skip_flag=true)
