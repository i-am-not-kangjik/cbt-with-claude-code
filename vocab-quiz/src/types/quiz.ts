export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection'

export interface Word {
  id: string
  english: string
  korean: string
  part_of_speech: PartOfSpeech
  created_at?: string
}

export interface QuizQuestion {
  word: Word
  options: string[]
  correctAnswer: string
}

export interface QuizResult {
  id?: string
  user_id?: string
  score: number
  total_questions: number
  completed_at: string
}

export interface QuizAnswer {
  id?: string
  quiz_result_id: string
  word_id: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
  answered_at?: string
  word?: Word
}

export interface WordStats {
  id?: string
  word_id: string
  total_attempts: number
  correct_attempts: number
  accuracy_rate: number
  last_updated?: string
  word?: Word
}