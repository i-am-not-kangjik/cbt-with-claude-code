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
  english TEXT NOT NULL,
  korean TEXT NOT NULL,
  part_of_speech part_of_speech_enum NOT NULL,
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

-- Insert sample vocabulary data
INSERT INTO words (english, korean, part_of_speech) VALUES
('cat', '고양이', 'noun'),
('dog', '개', 'noun'),
('run', '뛰다', 'verb'),
('big', '큰', 'adjective'),
('small', '작은', 'adjective'),
('happy', '행복한', 'adjective'),
('eat', '먹다', 'verb'),
('book', '책', 'noun'),
('water', '물', 'noun'),
('good', '좋은', 'adjective'),
('beautiful', '아름다운', 'adjective'),
('knowledge', '지식', 'noun'),
('understand', '이해하다', 'verb'),
('frequently', '자주', 'adverb'),
('important', '중요한', 'adjective'),
('develop', '개발하다', 'verb'),
('education', '교육', 'noun'),
('carefully', '조심스럽게', 'adverb'),
('environment', '환경', 'noun'),
('experience', '경험', 'noun'),
('sophisticated', '세련된', 'adjective'),
('phenomenon', '현상', 'noun'),
('contemplate', '심사숙고하다', 'verb'),
('subsequently', '그 후에', 'adverb'),
('magnificent', '장엄한', 'adjective'),
('demonstrate', '증명하다', 'verb'),
('consciousness', '의식', 'noun'),
('nevertheless', '그럼에도 불구하고', 'adverb'),
('extraordinary', '특별한', 'adjective'),
('philosophy', '철학', 'noun');

-- Create indexes for better performance
CREATE INDEX idx_words_part_of_speech ON words(part_of_speech);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at);