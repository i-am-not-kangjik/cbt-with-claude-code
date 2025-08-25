# 영단어 퀴즈 웹사이트

Next.js와 Supabase를 사용한 모바일 친화적인 영단어 퀴즈 웹사이트입니다.

## 주요 기능

- 🎯 **난이도별 퀴즈**: 초급, 중급, 고급 레벨별 학습
- 📝 **품사별 학습**: 명사, 동사, 형용사, 부사 등 품사 정보 포함
- 📱 **모바일 최적화**: 반응형 디자인으로 모든 기기에서 사용 가능
- 📊 **결과 추적**: 퀴즈 성과 및 통계 확인
- 🎨 **현대적 UI**: Tailwind CSS로 구현한 깔끔한 인터페이스

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **배포**: Vercel
- **상태관리**: React Hooks

## 시작하기

### 1. 프로젝트 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 데이터베이스 설정

Supabase 콘솔에서 `supabase-schema.sql` 파일의 내용을 실행하여 테이블과 초기 데이터를 생성하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 데이터베이스 구조

### words 테이블
- `id`: UUID (Primary Key)
- `english`: 영단어
- `korean`: 한국어 뜻
- `part_of_speech`: 품사 (명사, 동사, 형용사 등)
- `difficulty`: 난이도 (easy, medium, hard)
- `created_at`: 생성 시간

### quiz_results 테이블
- `id`: UUID (Primary Key)
- `user_id`: 사용자 ID (옵션)
- `score`: 맞힌 문제 수
- `total_questions`: 전체 문제 수
- `difficulty`: 퀴즈 난이도
- `completed_at`: 완료 시간

## 배포

### Vercel 배포

1. GitHub에 프로젝트 푸시
2. Vercel 대시보드에서 프로젝트 임포트
3. 환경 변수 설정 (Supabase URL, ANON KEY)
4. 배포 완료

## 커스터마이징

### 새로운 단어 추가

Supabase 콘솔에서 `words` 테이블에 직접 단어를 추가하거나, SQL 명령어를 사용하세요:

```sql
INSERT INTO words (english, korean, part_of_speech, difficulty) 
VALUES ('example', '예시', 'noun', 'medium');
```

### UI 테마 변경

`src/app/globals.css`와 컴포넌트의 Tailwind 클래스를 수정하여 색상과 스타일을 변경할 수 있습니다.

## 라이선스

MIT License
