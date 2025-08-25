-- Create enum for part of speech
CREATE TYPE part_of_speech_enum AS ENUM (
  'noun',
  'verb', 
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'pronoun',
  'interjection'
);

-- Create words table
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  english TEXT NOT NULL UNIQUE,
  korean TEXT NOT NULL,
  part_of_speech part_of_speech_enum NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table for tracking user performance
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_answers table for tracking individual answers
CREATE TABLE quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_result_id UUID REFERENCES quiz_results(id) ON DELETE CASCADE,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create word_stats table for tracking word performance
CREATE TABLE word_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE UNIQUE,
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample vocabulary data (100 words)
INSERT INTO words (english, korean, part_of_speech) VALUES
-- Nouns (30 words)
('cat', '고양이', 'noun'),
('dog', '개', 'noun'),
('book', '책', 'noun'),
('water', '물', 'noun'),
('knowledge', '지식', 'noun'),
('education', '교육', 'noun'),
('environment', '환경', 'noun'),
('experience', '경험', 'noun'),
('phenomenon', '현상', 'noun'),
('consciousness', '의식', 'noun'),
('philosophy', '철학', 'noun'),
('house', '집', 'noun'),
('tree', '나무', 'noun'),
('car', '자동차', 'noun'),
('computer', '컴퓨터', 'noun'),
('music', '음악', 'noun'),
('movie', '영화', 'noun'),
('school', '학교', 'noun'),
('hospital', '병원', 'noun'),
('restaurant', '식당', 'noun'),
('friend', '친구', 'noun'),
('family', '가족', 'noun'),
('time', '시간', 'noun'),
('money', '돈', 'noun'),
('country', '나라', 'noun'),
('city', '도시', 'noun'),
('mountain', '산', 'noun'),
('ocean', '바다', 'noun'),
('flower', '꽃', 'noun'),
('animal', '동물', 'noun'),

-- Verbs (30 words)
('run', '뛰다', 'verb'),
('eat', '먹다', 'verb'),
('understand', '이해하다', 'verb'),
('develop', '개발하다', 'verb'),
('contemplate', '심사숙고하다', 'verb'),
('demonstrate', '증명하다', 'verb'),
('walk', '걷다', 'verb'),
('speak', '말하다', 'verb'),
('listen', '듣다', 'verb'),
('write', '쓰다', 'verb'),
('read', '읽다', 'verb'),
('think', '생각하다', 'verb'),
('learn', '배우다', 'verb'),
('teach', '가르치다', 'verb'),
('work', '일하다', 'verb'),
('play', '놀다', 'verb'),
('sleep', '자다', 'verb'),
('wake', '깨다', 'verb'),
('cook', '요리하다', 'verb'),
('travel', '여행하다', 'verb'),
('study', '공부하다', 'verb'),
('drive', '운전하다', 'verb'),
('swim', '수영하다', 'verb'),
('dance', '춤추다', 'verb'),
('sing', '노래하다', 'verb'),
('laugh', '웃다', 'verb'),
('cry', '울다', 'verb'),
('help', '돕다', 'verb'),
('love', '사랑하다', 'verb'),
('create', '창조하다', 'verb'),

-- Adjectives (30 words)
('big', '큰', 'adjective'),
('small', '작은', 'adjective'),
('happy', '행복한', 'adjective'),
('good', '좋은', 'adjective'),
('beautiful', '아름다운', 'adjective'),
('important', '중요한', 'adjective'),
('sophisticated', '세련된', 'adjective'),
('magnificent', '장엄한', 'adjective'),
('extraordinary', '특별한', 'adjective'),
('bad', '나쁜', 'adjective'),
('new', '새로운', 'adjective'),
('old', '오래된', 'adjective'),
('young', '젊은', 'adjective'),
('fast', '빠른', 'adjective'),
('slow', '느린', 'adjective'),
('hot', '뜨거운', 'adjective'),
('cold', '차가운', 'adjective'),
('warm', '따뜻한', 'adjective'),
('cool', '시원한', 'adjective'),
('bright', '밝은', 'adjective'),
('dark', '어두운', 'adjective'),
('easy', '쉬운', 'adjective'),
('difficult', '어려운', 'adjective'),
('interesting', '흥미로운', 'adjective'),
('boring', '지루한', 'adjective'),
('funny', '웃긴', 'adjective'),
('serious', '심각한', 'adjective'),
('kind', '친절한', 'adjective'),
('smart', '똑똑한', 'adjective'),
('strong', '강한', 'adjective'),

-- Adverbs (10 words)
('frequently', '자주', 'adverb'),
('carefully', '조심스럽게', 'adverb'),
('subsequently', '그 후에', 'adverb'),
('nevertheless', '그럼에도 불구하고', 'adverb'),
('quickly', '빠르게', 'adverb'),
('slowly', '천천히', 'adverb'),
('always', '항상', 'adverb'),
('never', '절대로', 'adverb'),
('sometimes', '때때로', 'adverb'),
('usually', '보통', 'adverb');

-- Create indexes for better performance
CREATE INDEX idx_words_part_of_speech ON words(part_of_speech);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at);
CREATE INDEX idx_quiz_answers_quiz_result_id ON quiz_answers(quiz_result_id);
CREATE INDEX idx_quiz_answers_word_id ON quiz_answers(word_id);
CREATE INDEX idx_word_stats_word_id ON word_stats(word_id);
CREATE INDEX idx_word_stats_accuracy_rate ON word_stats(accuracy_rate);

-- 모든 사용자에게 접근 권한 부여
GRANT ALL ON word_stats TO anon;
GRANT ALL ON quiz_answers TO anon;

-- 또는 RLS 정책 생성
CREATE POLICY "Allow all operations" ON word_stats FOR ALL USING
(true);
CREATE POLICY "Allow all operations" ON quiz_answers FOR ALL USING
(true);