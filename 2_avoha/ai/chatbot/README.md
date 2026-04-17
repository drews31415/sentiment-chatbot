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
| 사진 기록 | 사진 전송 → 텍스트 유도 → 사진+텍스트 분류 |
| 하루 5회 제한 | 채집권 소진 시 안내 메시지 |
| 원석 조회 | "내 원석" 입력 시 캐러셀 카드로 목록 표시 |
| 웰컴 메시지 | 채널 첫 진입 시 자동 안내 |

## 기술 스택

| 항목 | 선택 |
|---|---|
| 백엔드 | FastAPI + uvicorn |
| AI | OpenRouter (google/gemma-3-4b-it:free) |
| DB | Supabase (PostgreSQL) |
| 배포 | Railway |
| 챗봇 플랫폼 | 카카오 i 오픈빌더 |

## 환경 변수 (.env)

```
OPENROUTER_API_KEY=your_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## 실행 방법

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Supabase 테이블

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

## 감정-원석 매핑

| 감정 | 원석 |
|---|---|
| 기쁨 | 루비 🔴 |
| 평온 | 아쿠아마린 🔵 |
| 슬픔 | 사파이어 💙 |
| 설렘 | 로즈쿼츠 🌸 |
| 피로 | 스모키쿼츠 🩶 |

## 웹훅 엔드포인트

`POST /webhook` — 카카오 오픈빌더 스킬 URL로 등록
