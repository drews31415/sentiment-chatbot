# 디자인 시스템

## 컬러 팔레트 (Material 3)

### Primary (올리브 그린)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#5b6a31` | 주요 액션, 강조 |
| `--color-primary-dim` | `#505e26` | 눌림 상태 |
| `--color-primary-container` | `#d9eaa3` | 배경 강조 |
| `--color-primary-fixed` | `#d9eaa3` | 고정 강조 |
| `--color-primary-fixed-dim` | `#cbdc96` | 고정 강조 (어두운) |
| `--color-on-primary` | `#ffffff` | primary 위 텍스트 |
| `--color-on-primary-container` | `#495720` | container 위 텍스트 |

### Secondary (따뜻한 브라운)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-secondary` | `#845c32` | 보조 강조 |
| `--color-secondary-container` | `#ffdcbd` | 보조 배경 |
| `--color-on-secondary` | `#ffffff` | secondary 위 텍스트 |

### Tertiary (모브 로즈)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-tertiary` | `#925255` | 삼차 강조 |
| `--color-tertiary-container` | `#f9a9ac` | 삼차 배경 |
| `--color-on-tertiary` | `#ffffff` | tertiary 위 텍스트 |

### Surface (크림)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-surface` | `#fefee5` | 기본 배경 |
| `--color-surface-dim` | `#e3e6bb` | 어두운 배경 |
| `--color-surface-container-lowest` | `#ffffff` | 최밝은 컨테이너 |
| `--color-surface-container-low` | `#fbfcdc` | 밝은 컨테이너 |
| `--color-surface-container` | `#f4f6d2` | 기본 컨테이너 |
| `--color-surface-container-high` | `#eef1cb` | 어두운 컨테이너 |
| `--color-surface-container-highest` | `#e8ebc0` | 최어두운 컨테이너 |
| `--color-on-surface` | `#373a1c` | surface 위 텍스트 |
| `--color-on-surface-variant` | `#636745` | 보조 텍스트 |

### Error
| 토큰 | 값 |
|------|-----|
| `--color-error` | `#ae4025` |
| `--color-error-container` | `#fd795a` |
| `--color-on-error` | `#ffffff` |

### Outline
| 토큰 | 값 |
|------|-----|
| `--color-outline` | `#80835f` |
| `--color-outline-variant` | `#b9bc94` |

---

## 타이포그래피

### 폰트 패밀리
| 변수 | 폰트 | 용도 |
|------|------|------|
| `--font-serif` | Noto Serif KR (400, 600, 700) | 감성 콘텐츠, AI 코멘트, 사용자 기록 인용 |
| `--font-sans` | Plus Jakarta Sans (400-700, italic) | UI 라벨, 버튼, 본문 |

### 사용 규칙
- **serif**: AI 코멘트, 사용자 텍스트 인용, 인사이트 메시지, 페이지 헤딩
- **sans**: 네비게이션 라벨, 버튼 텍스트, 메타데이터, 태그, 입력 필드

---

## 간격 스케일 (Spacing)

| 토큰 | 값 | Tailwind |
|------|-----|---------|
| `--spacing-xs` | 4px | `gap-1`, `p-1` |
| `--spacing-sm` | 8px | `gap-2`, `p-2` |
| `--spacing-md` | 16px | `gap-4`, `p-4` |
| `--spacing-lg` | 24px | `gap-6`, `p-6` |
| `--spacing-xl` | 32px | `gap-8`, `p-8` |
| `--spacing-2xl` | 48px | `gap-12`, `p-12` |

---

## 엘리베이션 (Elevation)

| 레벨 | 값 | 용도 |
|------|-----|------|
| Level 1 | `0px 4px 12px rgba(55,58,28,0.03)` | 카드, 채팅 버블 |
| Level 2 | `0px 8px 24px rgba(55,58,28,0.06)` | 사진 프레임, 하단 시트 |
| Level 3 | `0px 12px 32px rgba(55,58,28,0.10)` | FAB 버튼, 모달 |

---

## 모션 토큰

| 토큰 | 값 |
|------|-----|
| `--duration-fast` | 150ms |
| `--duration-normal` | 300ms |
| `--duration-slow` | 500ms |
| `--easing-out` | `cubic-bezier(0.0, 0, 0.2, 1)` |
| `--easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### reduced-motion 지원
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 라운드 (Border Radius)

| 용도 | 값 |
|------|-----|
| 소형 (태그, 칩) | `rounded-full` |
| 중형 (카드, 버블) | `rounded-2xl` (1rem) |
| 대형 (사진 프레임, 시트) | `rounded-[2rem]` |
| 특대 (하단 네비, FAB) | `rounded-[3rem]` / `--radius-xl` |

---

## 아이콘 스케일

| 크기 | 값 | 용도 |
|------|-----|------|
| sm | 16px | 보조 아이콘 |
| md | 20px | 인라인 아이콘 |
| lg | 24px | 네비게이션, 버튼 |
| xl | 32px | FAB, 헤더 강조 |

라이브러리: **Lucide React**

---

## 공유 컴포넌트

### GlassCard
글래스모피즘 카드 (맵 마커, 최근 기록 카드)
```
bg-white/70 backdrop-blur-md rounded-2xl shadow-[elevation-1] border border-white/30
```

### EmotionChip
감정 태그 칩
```
bg-surface-container px-5 py-2 rounded-full text-sm font-medium text-primary tracking-wide
```

### PhotoFrame
4:5 비율 사진 프레임
```
aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[elevation-2]
```

### AIBubble
AI 채팅 메시지 버블
```
bg-surface-container-high rounded-tr-xl rounded-br-xl rounded-bl-xl p-5 shadow-[elevation-1]
font-serif text-lg leading-relaxed
```

### LoadingPulse
AI 처리 중 로딩 애니메이션
```
타이핑 도트 애니메이션 (3개 점 순차 페이드)
"소화가 생각하고 있어요..." 텍스트
```

### BottomSheet
맵 위 기록 상세 오버레이
```
fixed bottom-0 rounded-t-[3rem] bg-surface shadow-[elevation-3]
드래그 핸들 + 사진 + 텍스트 + 태그 + AI 코멘트
```

---

## 접근성 가이드라인

1. **ARIA 레이블**: 모든 인터랙티브 요소에 `aria-label` (한국어)
2. **포커스 링**: `focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2`
3. **컬러 대비**: WCAG AA 준수 (최소 4.5:1). `text-on-surface-variant/40` 사용 금지 → `/60` 이상
4. **reduced-motion**: `animate-float` 등 모든 애니메이션에 적용
5. **이미지 alt**: 한국어 설명적 텍스트 (예: "카페에서 촬영한 커피 사진")
6. **safe-area**: `env(safe-area-inset-bottom)` 노치 디바이스 대응

---

## 모든 텍스트 한국어 원칙

| 대상 | 변경 전 | 변경 후 |
|------|---------|---------|
| 하단 네비 | Home, Discovery, Profile | 홈, 발견, 프로필 |
| 맵 마커 | Wildflowers, Quiet Cafe | 들꽃, 조용한 카페 |
| 태그 | Peaceful, Me-time, Warmth | 편안함, 나만의 시간, 따뜻함 |
| 캡처 버튼 | Skip for now, Finish entry | 건너뛰기, 기록 완료 |
| 입력 힌트 | Share a small happiness... | 작은 행복을 나눠주세요... |
| 뱃지 | MOMENT CAPTURED | 순간 포착 |
| AI 이름 | SO-HWA | 소화 |
