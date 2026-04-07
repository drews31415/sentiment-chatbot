# 개발로그 — 2026.04.07 기능 통합 및 디자인 개선

## 개요

다른 팀원이 기획한 디자인을 기존 소확행 프로젝트에 통합하고, 전체 디자인을 리디자인함.

---

## 1. 신규 기능 추가

### 1-1. 온보딩 플로우

- **파일**: `src/components/OnboardingView.tsx`
- 3단계 풀스크린 플로우: Welcome → 이름 입력 → 관심사 선택
- `zustand/middleware`의 `persist`로 `localStorage`에 온보딩 상태 저장
- 완료 시 `UserProfile` 생성 → 스토어에 저장

### 1-2. 로그인 화면

- **파일**: `src/components/LoginView.tsx`
- 목업 로그인 (실제 인증 없음)
- 온보딩에서 입력한 이름 표시
- `App.tsx`에서 `isOnboarded` / `isLoggedIn` 가드로 라우팅 제어

### 1-3. 행복포인트 시스템

- **파일**: `src/components/PointsCelebrationView.tsx`
- 기록 저장 후 +10 포인트 적립 화면
- `addPoints()` 액션으로 스토어의 `totalPoints` / `pointsHistory` 업데이트
- TopAppBar에 총 포인트 배지 표시

### 1-4. 취미 추천 탭

- **파일**: `src/components/HobbyRecommendationView.tsx`
- 하단 네비 "발견" → "추천" 탭으로 교체 (`/discovery` → `/hobby`)
- 섹션: 음악 추천 (가로 캐러셀), 활동 추천 (세로 리스트), 공연&전시 (가로 캐러셀)
- 유저 감정 태그 기반 개인화 필터링

### 1-5. 위치 기반 감정 복기 팝업

- **파일**: `src/components/LocationRecallPopup.tsx`
- HomeMapView 마운트 3초 후 자동 트리거 (데모용)
- 바텀시트 형태, 해당 위치의 기록 카드 표시

---

## 2. 디자인 리디자인

### 2-1. 디자인 시스템 변경 (`src/index.css`)

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| Surface | `#FFFFFF` (순백색) | `#FAF7F4` (웜 크림) |
| on-surface | `#1A1A2E` (쿨 블랙) | `#2D2520` (웜 브라운) |
| on-surface-variant | `#6B7280` (쿨 그레이) | `#8B7E74` (웜 그레이) |
| Primary | `#FF6B6B` | `#E8614D` (채도 조정) |
| Secondary | `#4ECDC4` | `#3AAFA9` (세이지 틸) |
| Elevation | 중성 그림자 | 브라운 틴트 그림자 |
| Easing | 표준 ease | Expo Out (`0.16, 1, 0.3, 1`) |

### 2-2. 컴포넌트 디자인 변경

- **글라스모피즘 제거**: `bg-white/90 backdrop-blur-xl` → 솔리드 `bg-surface-container-lowest`
- **버튼 위계**: 모든 버튼 그라데이션 → 메인 CTA `bg-on-surface`, 보조 텍스트 링크
- **카드**: `rounded-full` 통일 → `rounded-2xl` / `rounded-xl` / `rounded-lg` 혼용
- **FAB 제거**: 맵 위 원형 FAB → 필 형태 `+ 기록` 버튼
- **네비게이션**: `fill-current` → `strokeWidth` 변화로 활성 상태 표현
- **TopAppBar**: 포인트 뱃지 아이콘 → `1,250P` 텍스트로 간결화

---

## 3. 홈 지도 개선

### 3-1. 사용자 위치 표시

- 빨간 점 + 펄스 애니메이션 (`user-dot`, `user-dot-pulse` CSS)
- `L.divIcon`으로 커스텀 마커 구현

### 3-2. 3km 반경 표시

- `react-leaflet`의 `Circle` 컴포넌트, 코랄색 점선 테두리
- `pathOptions`: `dashArray: "6 4"`, `fillOpacity: 0.04`

### 3-3. 초기 줌 맞춤

- `InitialFit` 컴포넌트: `useMap()` + `requestAnimationFrame`으로 컨테이너 사이즈 확정 후 `fitBounds`
- 위도/경도 델타 직접 계산으로 정확한 3km 바운딩 박스 생성

---

## 4. 캡처 플로우 개선

### 4-1. 사진 추가 인터랙션

- **변경 전**: 바로 데모 사진 표시
- **변경 후**: 빈 점선 영역 → 탭하면 사진 추가 (갤러리 시뮬레이션)

### 4-2. 직접 커멘트 입력

- 사진 추가 후 `textarea`로 바로 커멘트 작성 가능
- 챗봇 없이 "저장하기" 가능 (챗봇은 "소화와 대화하기" 보조 링크로 선택적)

### 4-3. AI 코멘트 토스트

- 직접 저장 시 상단에서 슬라이드다운하는 토스트 알림
- 감정별 배경색: 편안함→그린, 행복→핑크, 따뜻함→앰버, 평온함→블루
- 2.5초 표시 → 0.3초 페이드아웃 → 포인트 화면 이동

### 4-4. 데모 이미지 변경

- 커피 사진 → 들꽃 사진으로 변경 (자연 감성)
- InsightView의 AI 코멘트도 꽃 테마로 통일

---

## 5. 타입 및 데이터 추가

### 신규 타입

| 파일 | 타입 |
|------|------|
| `src/types/user.ts` | `UserProfile`, `OnboardingStep` |
| `src/types/points.ts` | `PointsTransaction` |
| `src/types/recommendation.ts` | `HobbyRecommendation`, `LocationRecallData` |

### 목 데이터 추가 (`src/data/mock-data.ts`)

- `mockUserProfile` — 이름 "민서", 관심사 3개, 포인트 1,250
- `mockPointsHistory` — 포인트 적립 내역 6건
- `mockHobbyRecommendations` — 음악 3, 활동 3, 엔터 3 (총 9건)
- `mockLocationRecalls` — 위치 복기 데이터 2건
- `mockOnboardingInterests` — 관심사 선택지 12개

### 스토어 확장 (`src/store/sohwakhaeng-store.ts`)

- `zustand/middleware` `persist` 적용 (`isOnboarded`, `isLoggedIn`, `userProfile`, `totalPoints`)
- 온보딩, 포인트, 추천, 위치 복기 상태 슬라이스 추가

---

## 6. 파일 변경 전체 목록

### 신규 파일 (9개)

```
src/types/user.ts
src/types/points.ts
src/types/recommendation.ts
src/components/OnboardingView.tsx
src/components/LoginView.tsx
src/components/PointsCelebrationView.tsx
src/components/HobbyRecommendationView.tsx
src/components/LocationRecallPopup.tsx
src/components/shared/CelebrationParticles.tsx
```

### 수정 파일 (12개)

```
src/types/index.ts
src/data/mock-data.ts
src/store/sohwakhaeng-store.ts
src/App.tsx
src/index.css
src/components/CaptureView.tsx
src/components/ChatbotView.tsx
src/components/InsightView.tsx
src/components/HomeMapView.tsx
src/components/ProfileView.tsx
src/components/layout/TopAppBar.tsx
src/components/layout/BottomNavBar.tsx
src/components/RecordDetailSheet.tsx
```

---

## 7. 검증 결과

- TypeScript: 에러 없음
- 빌드: 성공 (1.6s)
- 테스트: 18 파일 / 56 테스트 전체 통과
