export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection'

export interface Word {
  id: string
  english: string
  korean: string
  part_of_speech: PartOfSpeech
  difficulty: 'easy' | 'medium' | 'hard'
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
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  completed_at: string
}