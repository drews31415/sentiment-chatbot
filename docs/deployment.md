# 배포 가이드

## 환경 변수

### 프론트엔드 (.env)
```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Supabase Edge Functions
```
GEMINI_API_KEY=<gemini-api-key>
```

### Supabase Auth (대시보드 설정)
- Kakao OAuth: Client ID, Client Secret
- Google OAuth: Client ID, Client Secret
- Site URL: 프로덕션 도메인
- Redirect URLs: 프로덕션 도메인 + localhost (개발용)

## Supabase 프로젝트 셋업

### 1. 프로젝트 생성
```bash
supabase init
supabase link --project-ref <project-ref>
```

### 2. 익스텐션 활성화
```sql
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### 3. 마이그레이션 실행
```bash
supabase db push
```

### 4. Storage 버킷 생성
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false);

-- RLS 정책
CREATE POLICY "Users can upload own photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own photos"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
```

### 5. Edge Functions 배포
```bash
supabase functions deploy analyze-photo
supabase functions deploy generate-insight
supabase functions deploy save-record

# 시크릿 설정
supabase secrets set GEMINI_API_KEY=<key>
```

## 프론트엔드 배포 (Vercel)

### 1. 프로젝트 연결
```bash
vercel link
```

### 2. 환경 변수 설정
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### 3. 배포
```bash
vercel --prod
```

### 빌드 설정
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 20

## 로컬 개발

```bash
# 프론트엔드
npm install
npm run dev          # http://localhost:5173

# Supabase 로컬
supabase start       # 로컬 Supabase 스택
supabase functions serve  # Edge Functions 로컬 실행

# 테스트
npm run test         # Vitest
npm run test:e2e     # Playwright
```

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run test
      - run: npm run build
```
