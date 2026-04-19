# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 로컬 실행
venv\Scripts\activate
uvicorn main:app --reload

# 외부 노출 (개발용)
ngrok http 8000

# 패키지 설치
venv\Scripts\pip install -r requirements.txt
```

## Architecture

단일 파일 FastAPI 서버 (`main.py`). 카카오 i 오픈빌더에서 `POST /webhook`으로 요청이 들어온다.

**요청 흐름:**
```
카카오톡 → 오픈빌더 → POST /webhook → OpenRouter AI → Supabase → 카카오 응답
```

**인메모리 상태 (서버 재시작 시 초기화):**
- `user_count` — 유저별 하루 5회 채집권 카운트
- `pending_photo` — 사진 전송 후 텍스트 대기 상태 `{"time": datetime, "url": str}` (10분 타임아웃)
- `classify_fail_count` — 유저별 감정 분류 연속 실패 횟수 (2회 시 운영자 알림)

**주요 로직 (webhook 처리 순서):**
1. 위험/유해 키워드 감지 → 즉시 응답 + 이메일 알림
2. 감정 퀵 버튼 직접 선택 (`EMOTION_TO_GEM` 딕셔너리 매칭)
3. 도감 조회 ("도감")
4. 원석 조회 ("내 원석", "원석 보기", "가방", "인벤토리")
5. 이미지 URL 감지 → `pending_photo` 등록 + 텍스트 유도 (버튼 숨김)
6. 채집권 체크 (`check_and_increment`)
7. AI 감정 분류 (`classify_emotion`) — timeout=4s (카카오 스킬 5초 제한)
8. 분류 실패 시 퀵 버튼 노출, 2회 연속 실패 시 운영자 이메일 알림
9. 채집권 소진 시 기록은 허용하되 원석 미제공
10. `pending_photo` 확인 → 10분 이내면 사진+텍스트 분류 (image_url 포함 저장)
11. Supabase 저장 (BackgroundTasks로 비동기 처리)

**카카오 응답 포맷:**
- 텍스트: `simpleText`
- 원석 목록: `basicCard` (1개) 또는 `carousel` (복수)
- 퀵 리플라이: 기본 `[인벤토리 👜, 도감 📖]` 항상 노출 / 분류 실패 시 감정 10개 추가 / 사진 유도 시 숨김

**이메일 알림 발송 시점:**
- 위험 키워드 감지
- 유해 키워드 감지
- 감정 분류 2회 연속 실패

## 감정-원석 매핑

무탈→월장석, 평온→아쿠아마린, 뿌듯→황수정, 기쁨→루비, 만족→앰버, 설렘→로즈쿼츠, 슬픔→사파이어, 짜증→가넷, 후회→연수정, 위로→오팔

## 환경 변수

`.env` 파일 필요:
```
OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
ALERT_EMAIL=
GMAIL_APP_PASSWORD=
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
  image_url text,
  created_at timestamptz default now()
);
```

Storage: `gem-images` 버킷 (Public) — 원석 이미지 호스팅용
