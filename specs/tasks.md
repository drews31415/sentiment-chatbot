# 구현 계획: 소확행 서비스

## 개요

소확행 서비스의 핵심 백엔드 서비스, 데이터 모델, 클라이언트 컴포넌트를 TypeScript로 구현한다. fast-check 기반 속성 테스트와 단위 테스트를 병행하여 정확성을 보장한다. 각 단계는 이전 단계 위에 점진적으로 구축되며, 마지막에 전체를 통합한다.

## Tasks

- [ ] 1. 프로젝트 구조 및 핵심 타입 정의
  - [ ] 1.1 프로젝트 디렉토리 구조 생성 및 의존성 설정
    - `src/`, `tests/properties/`, `tests/unit/`, `tests/generators/` 디렉토리 생성
    - `package.json`에 fast-check, vitest(또는 jest), TypeScript 등 의존성 추가
    - `tsconfig.json` 설정
    - _Requirements: 전체_
  - [ ] 1.2 핵심 데이터 타입 및 인터페이스 정의
    - `SohwakhaengRecord`, `ExifMetadata`, `RecordPin`, `RecentCard`, `PreferenceVector`, `EmotionAnalysisData`, `MapBounds` 타입 정의
    - `VisionResult`, `EmotionResult`, `CommentInput` 인터페이스 정의
    - `ConversationState`, `ConversationEvent`, `ConversationContext` 타입 정의
    - _Requirements: 6.1, 2.5, 1.2, 1.5, 4.1, 4.2, 7.1_
  - [ ] 1.3 테스트 생성기(Generators) 작성
    - `tests/generators/` 하위에 record, emotion, vision, conversation 생성기 구현
    - fast-check Arbitrary를 사용하여 임의의 테스트 데이터 생성
    - _Requirements: 전체 (테스트 인프라)_

- [ ] 2. EmotionDataSerializer 구현
  - [ ] 2.1 serialize/deserialize 함수 구현
    - `EmotionAnalysisData` → JSON 문자열 직렬화
    - JSON 문자열 → `EmotionAnalysisData` 역직렬화 (유효성 검증 포함)
    - 잘못된 JSON 입력 시 구체적 오류 메시지 반환
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ]* 2.2 속성 테스트: 직렬화 라운드트립
    - **Property 11: 감정 분석 데이터 직렬화 라운드트립**
    - **Validates: Requirements 9.1, 9.2, 9.3**
  - [ ]* 2.3 속성 테스트: 잘못된 JSON 오류 반환
    - **Property 12: 잘못된 JSON 입력 시 오류 반환**
    - **Validates: Requirements 9.4**
  - [ ]* 2.4 단위 테스트: EmotionDataSerializer 엣지 케이스
    - 빈 배열, 특수 문자 포함 태그, 매우 긴 문자열 테스트
    - 필수 필드 누락, 잘못된 타입 테스트
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 3. ConversationStateManager (FSM) 구현
  - [ ] 3.1 FSM 상태 전이 로직 구현
    - `ConversationState` 전체 상태 정의
    - `transition(event)` 함수 구현: 유효한 전이 규칙에 따라 상태 변경
    - 유효하지 않은 이벤트에 대해 현재 상태 유지 또는 오류 발생
    - `ConversationContext` 관리: 각 전이 시 컨텍스트 데이터 갱신
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ] 3.2 건너뛰기 경로 및 오류 복구 로직 구현
    - SKIPPED 상태 전이 시 skip_flag=true 설정, raw_user_text=null 보장
    - VISION_FAILED → FALLBACK_SAVE 경로 구현
    - COMMENT_FAILED → FALLBACK_COMMENT 경로 구현
    - 오류 발생 시 기존 컨텍스트 데이터 보존
    - _Requirements: 3.4, 3.5, 4.5, 5.6, 7.3, 7.4_
  - [ ]* 3.3 속성 테스트: FSM 유효 상태 전이
    - **Property 4: FSM 유효 상태 전이**
    - **Validates: Requirements 2.2, 2.3, 3.3, 3.5, 5.5, 7.1, 7.2**
  - [ ]* 3.4 속성 테스트: 건너뛰기 경로 데이터 무결성
    - **Property 5: 건너뛰기 경로 데이터 무결성**
    - **Validates: Requirements 3.4, 7.3, 8.2**
  - [ ]* 3.5 속성 테스트: 오류 시 데이터 보존 및 복구
    - **Property 8: 오류 시 데이터 보존 및 복구**
    - **Validates: Requirements 4.5, 5.6, 7.4**
  - [ ]* 3.6 단위 테스트: FSM 엣지 케이스
    - 유효하지 않은 상태 전이 시도 테스트
    - 초기 상태 검증
    - 10초 타임아웃 → SKIP_HIGHLIGHTED 전이 테스트
    - _Requirements: 7.1, 7.2, 3.5_

- [ ] 4. 체크포인트 - 핵심 모듈 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [ ] 5. EXIF 메타데이터 추출 및 CaptureView 로직 구현
  - [ ] 5.1 extractExif 함수 구현
    - 사진에서 EXIF 메타데이터(dateTaken, latitude, longitude) 추출
    - EXIF가 없는 사진에 대해 각 필드를 null로 반환
    - _Requirements: 2.5_
  - [ ]* 5.2 속성 테스트: EXIF 메타데이터 추출
    - **Property 3: EXIF 메타데이터 추출**
    - **Validates: Requirements 2.5**
  - [ ]* 5.3 단위 테스트: EXIF 엣지 케이스
    - EXIF 없는 사진, 부분적 EXIF(GPS만 있고 날짜 없음 등) 테스트
    - _Requirements: 2.5_

- [ ] 6. VisionAnalysisService 구현
  - [ ] 6.1 Vision API 호출 및 결과 파싱 구현
    - `analyze(imageUrl)` 함수 구현: Vision API 호출 후 `VisionResult` 반환
    - visionTags, confidence 추출
    - API 호출 실패 시 에러 throw
    - _Requirements: 3.1, 4.1_

- [ ] 7. EmotionExtractionService 구현
  - [ ] 7.1 감정 추출 로직 구현
    - `extractWithText(visionResult, userText)`: 사진+텍스트 통합 감정 분석
    - `extractFromVisionOnly(visionResult)`: 사진만으로 감정 분석
    - emotionPolarity, emotionTags, contextKeywords 생성
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ]* 7.2 속성 테스트: 감정 분석 결과 구조 무결성
    - **Property 6: 감정 분석 결과 구조 무결성**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [ ] 8. CommentGenerationService 구현
  - [ ] 8.1 AI 코멘트 생성 로직 구현
    - `generate(input)` 함수: LLM API를 사용하여 1~2문장 감성 코멘트 생성
    - `getFallbackComment(emotionTags)` 함수: 기본 감성 메시지 반환 (항상 비어있지 않은 문자열)
    - _Requirements: 5.1, 5.2, 5.3, 5.6_
  - [ ]* 8.2 단위 테스트: 대체 코멘트
    - 빈 emotionTags로 getFallbackComment 호출 시 비어있지 않은 문자열 반환 확인
    - 다양한 emotionTags 조합 테스트
    - _Requirements: 5.6_

- [ ] 9. 체크포인트 - AI 서비스 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [ ] 10. RecordStorageService 구현
  - [ ] 10.1 기록 CRUD 및 조회 함수 구현
    - `save(record)`: 소확행 기록 저장
    - `getById(recordId)`: ID로 기록 조회
    - `getByUser(userId, options)`: 사용자별 기록 목록 조회
    - `getRecentByUser(userId, limit)`: 최근 기록 조회 (limit 제한)
    - `getRecordPins(userId, bounds)`: 지도 범위 내 기록 핀 조회
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ]* 10.2 속성 테스트: 기록 저장-조회 라운드트립
    - **Property 9: 기록 저장-조회 라운드트립**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  - [ ]* 10.3 속성 테스트: 최근 기록 카드 개수 제한
    - **Property 2: 최근 기록 카드 개수 제한**
    - **Validates: Requirements 1.4**

- [ ] 11. 기록→뷰모델 변환 및 취향 벡터 구현
  - [ ] 11.1 RecordPin/RecentCard 변환 함수 구현
    - `SohwakhaengRecord` → `RecordPin` 변환: thumbnailUrl, emotionKeyword, shortText 생성
    - `SohwakhaengRecord` → `RecentCard` 변환: imageUrl, emotionKeyword, shortText 생성
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  - [ ] 11.2 취향 벡터 갱신 로직 구현
    - 새로운 EmotionResult 기반으로 PreferenceVector 갱신
    - totalRecords 1 증가, emotionTags/contextKeywords 누적 반영
    - 행복 트리거 키워드, 선호 장소 유형, 선호 시간대, 감정 빈도 분포 갱신
    - _Requirements: 4.4, 6.4_
  - [ ]* 11.3 속성 테스트: 기록→뷰모델 변환 시 필수 필드 포함
    - **Property 1: 기록→뷰모델 변환 시 필수 필드 포함**
    - **Validates: Requirements 1.1, 1.2, 1.5**
  - [ ]* 11.4 속성 테스트: 취향 벡터 갱신 단조성
    - **Property 7: 취향 벡터 갱신 단조성**
    - **Validates: Requirements 4.4**
  - [ ]* 11.5 속성 테스트: 누적 분석 데이터 갱신
    - **Property 10: 누적 분석 데이터 갱신**
    - **Validates: Requirements 6.4**

- [ ] 12. 체크포인트 - 데이터 계층 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [ ] 13. 클라이언트 컴포넌트 구현
  - [ ] 13.1 HomeMapView 구현
    - 지도 렌더링 및 기록_핀 표시 로직
    - `loadRecordPins`, `loadRecentCards` 호출 및 데이터 바인딩
    - 최근_기록_카드 가로 스와이프 영역 구현
    - FAB_버튼 렌더링 및 `onFabTap` 핸들러
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.4_
  - [ ] 13.2 CaptureView 구현
    - 카메라 촬영 / 갤러리 선택 UI
    - 촬영/선택 완료 후 편집 단계 없이 챗봇_화면으로 자동 전환
    - EXIF 추출 연동
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ] 13.3 ChatbotView 구현
    - AI 질문 표시 및 사용자 응답 수집
    - 건너뛰기 버튼 및 10초 타임아웃 시 건너뛰기 강조 로직
    - _Requirements: 3.2, 3.3, 3.4, 3.5_
  - [ ] 13.4 InsightView 구현
    - AI 코멘트 말풍선/카드/팝업 형태 표시
    - 닫기 버튼 → 기록 저장 및 홈_화면 복귀
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 8.3_
  - [ ]* 13.5 단위 테스트: UX 플로우 검증
    - 홈→촬영→건너뛰기→홈이 4단계 이내인지 확인
    - PHOTO_UPLOADED 다음에 편집 상태가 없음 확인
    - _Requirements: 8.1, 8.2, 2.4_

- [ ] 14. 전체 통합 및 플로우 연결
  - [ ] 14.1 전체 기록 플로우 통합
    - FAB 탭 → CaptureView → 사진 업로드 → VisionAnalysisService → ChatbotView → EmotionExtractionService → CommentGenerationService → InsightView → RecordStorageService → HomeMapView 전체 흐름 연결
    - ConversationStateManager를 통한 상태 전이 기반 플로우 제어
    - _Requirements: 2.2, 2.3, 3.1, 3.2, 3.3, 5.1, 5.4, 5.5, 7.1, 8.1_
  - [ ] 14.2 대체 경로(Fallback) 통합
    - Vision API 실패 → 사진+메타만 저장 경로
    - 코멘트 생성 실패 → 기본 메시지 대체 경로
    - 감정 분석 실패 → 기본 태그+중립 극성 대체 경로
    - _Requirements: 4.5, 5.6, 7.4_
  - [ ]* 14.3 단위 테스트: 통합 플로우 검증
    - 정상 플로우 (사진→질문→답변→코멘트→저장) 테스트
    - 건너뛰기 플로우 (사진→건너뛰기→저장) 테스트
    - 오류 대체 플로우 테스트
    - _Requirements: 7.1, 8.1, 8.2_

- [ ] 15. 최종 체크포인트 - 전체 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

## Notes

- `*` 표시된 태스크는 선택 사항이며, 빠른 MVP를 위해 건너뛸 수 있습니다.
- 각 태스크는 추적 가능성을 위해 특정 요구사항을 참조합니다.
- 체크포인트는 점진적 검증을 보장합니다.
- 속성 테스트는 보편적 정확성 속성을 검증하고, 단위 테스트는 구체적 예시와 엣지 케이스를 검증합니다.
- 테스트 라이브러리: fast-check (속성 테스트), vitest (테스트 러너)
