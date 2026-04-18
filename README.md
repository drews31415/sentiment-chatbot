# 닥토 공방 카카오톡 챗봇

일상 기록을 감정 원석으로 저장해주는 카카오톡 채널 챗봇.

## 서비스 흐름

```
사용자 → 카카오톡 → 오픈빌더 → FastAPI 서버 → OpenRouter AI
                                      ↓                ↓
                              Supabase DB ←────── 원석 결정
                                      ↓
                              카카오톡 응답
```

## 주요 기능

| 기능 | 설명 |
|---|---|
| 텍스트 기록 | 일상 텍스트 → 감정 분류 → 원석 저장 |
| 사진 기록 | 사진 전송 → 텍스트 유도 (10분 타임아웃) → 사진+텍스트 분류 |
| 감정 퀵 버튼 | 분류 실패 시 10가지 감정 버튼으로 직접 선택 |
| 하루 5회 제한 | 채집권 소진 후에도 기록 허용, 원석만 미제공 |
| 원석 조회 | "내 원석" / "원석 보기" / "가방" 입력 시 캐러셀 카드로 표시 |
| 위험 기록 감지 | 자살/자해 키워드 → 자살예방 문구 + 운영자 이메일 알림 |
| 유해 기록 감지 | 유해 키워드 → 채집 거부 + 운영자 이메일 알림 |
| 분류 2회 실패 | 운영자 이메일 알림 + 운영자 연결 안내 |
| 웰컴 메시지 | 오픈빌더 웰컴 블록에서 설정 |

## 감정-원석 매핑

| 카테고리 | 감정 | 원석 |
|---|---|---|
| 평온 | 무탈 | 월장석 🤍 |
| 평온 | 평온 | 아쿠아마린 🩵 |
| 행복 | 뿌듯 | 황수정 💛 |
| 행복 | 기쁨 | 루비 ❤️ |
| 행복 | 만족 | 앰버 🟠 |
| 행복 | 설렘 | 로즈쿼츠 🌸 |
| 부정 | 슬픔 | 사파이어 💙 |
| 부정 | 짜증 | 가넷 🔴 |
| 부정 | 후회 | 연수정 🤎 |
| 부정 | 위로 | 오팔 🫧 |

## 기술 스택

| 항목 | 선택 |
|---|---|
| 백엔드 | FastAPI + uvicorn |
| AI | OpenRouter (google/gemma-3-4b-it:free) |
| DB | Supabase (PostgreSQL) |
| 배포 | Railway |
| 챗봇 플랫폼 | 카카오 i 오픈빌더 |
| 알림 | Gmail SMTP |

## 환경 변수 (.env)

```
OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
ALERT_EMAIL=
GMAIL_APP_PASSWORD=
```

## 실행 방법

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## 배포

- **운영**: Railway (`https://sentiment-chatbot.up.railway.app/webhook`)
- **개발**: ngrok → 오픈빌더 스킬 URL 임시 교체

## Supabase 스키마

```sql
create table gems (
  id bigint generated always as identity primary key,
  user_id text not null,
  gem text not null,
  record_text text,
  has_photo boolean default false,
  created_at timestamptz default now()
);
```

## 웹훅 엔드포인트

`POST /webhook` — 카카오 오픈빌더 스킬 URL로 등록
