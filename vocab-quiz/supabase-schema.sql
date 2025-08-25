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

-- Create enum for difficulty
CREATE TYPE difficulty_enum AS ENUM (
  'easy',
  'medium',
  'hard',
  'mixed'
);

-- Create words table
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  english TEXT NOT NULL,
  korean TEXT NOT NULL,
  part_of_speech part_of_speech_enum NOT NULL,
  difficulty difficulty_enum NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table for tracking user performance
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  difficulty difficulty_enum NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample vocabulary data
INSERT INTO words (english, korean, part_of_speech, difficulty) VALUES
-- Easy words
('cat', '고양이', 'noun', 'easy'),
('dog', '개', 'noun', 'easy'),
('run', '뛰다', 'verb', 'easy'),
('big', '큰', 'adjective', 'easy'),
('small', '작은', 'adjective', 'easy'),
('happy', '행복한', 'adjective', 'easy'),
('eat', '먹다', 'verb', 'easy'),
('book', '책', 'noun', 'easy'),
('water', '물', 'noun', 'easy'),
('good', '좋은', 'adjective', 'easy'),

-- Medium words
('beautiful', '아름다운', 'adjective', 'medium'),
('knowledge', '지식', 'noun', 'medium'),
('understand', '이해하다', 'verb', 'medium'),
('frequently', '자주', 'adverb', 'medium'),
('important', '중요한', 'adjective', 'medium'),
('develop', '개발하다', 'verb', 'medium'),
('education', '교육', 'noun', 'medium'),
('carefully', '조심스럽게', 'adverb', 'medium'),
('environment', '환경', 'noun', 'medium'),
('experience', '경험', 'noun', 'medium'),

-- Hard words
('sophisticated', '세련된', 'adjective', 'hard'),
('phenomenon', '현상', 'noun', 'hard'),
('contemplate', '심사숙고하다', 'verb', 'hard'),
('subsequently', '그 후에', 'adverb', 'hard'),
('magnificent', '장엄한', 'adjective', 'hard'),
('demonstrate', '증명하다', 'verb', 'hard'),
('consciousness', '의식', 'noun', 'hard'),
('nevertheless', '그럼에도 불구하고', 'adverb', 'hard'),
('extraordinary', '특별한', 'adjective', 'hard'),
('philosophy', '철학', 'noun', 'hard');

-- Create indexes for better performance
CREATE INDEX idx_words_difficulty ON words(difficulty);
CREATE INDEX idx_words_part_of_speech ON words(part_of_speech);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at);