'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Word, QuizQuestion } from '@/types/quiz'

const PART_OF_SPEECH_KOREAN: Record<string, string> = {
  noun: '명사',
  verb: '동사',
  adjective: '형용사',
  adverb: '부사',
  preposition: '전치사',
  conjunction: '접속사',
  pronoun: '대명사',
  interjection: '감탄사'
}

export default function Quiz() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      const { data: words, error } = await supabase
        .from('words')
        .select('*')
        .limit(10)

      if (error) throw error

      if (words && words.length > 0) {
        const quizQuestions = await Promise.all(
          words.map(async (word) => {
            const wrongAnswers = await getWrongAnswers(word)
            const options = [...wrongAnswers, word.korean].sort(() => Math.random() - 0.5)
            
            return {
              word,
              options,
              correctAnswer: word.korean
            }
          })
        )
        setQuestions(quizQuestions)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getWrongAnswers = async (currentWord: Word): Promise<string[]> => {
    const { data: words, error } = await supabase
      .from('words')
      .select('korean')
      .neq('id', currentWord.id)
      .limit(20)

    if (error || !words) return ['오답1', '오답2', '오답3']

    const shuffled = words.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3).map(w => w.korean)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = async () => {
    const newScore = selectedAnswer === questions[currentQuestion].correctAnswer 
      ? score + 1 
      : score
    
    setScore(newScore)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      await saveQuizResult(newScore)
      setShowResult(true)
    }
  }

  const saveQuizResult = async (finalScore: number) => {
    try {
      await supabase
        .from('quiz_results')
        .insert({
          score: finalScore,
          total_questions: questions.length,
          completed_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error saving quiz result:', error)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setShowResult(false)
    loadQuestions()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">퀴즈 완료!</h2>
          <div className="text-6xl font-bold text-blue-500 mb-2">{percentage}%</div>
          <p className="text-gray-600 mb-6">
            {questions.length}문제 중 {score}문제 맞춤
          </p>
          <div className="space-y-3">
            <button
              onClick={restartQuiz}
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              다시 도전
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">문제를 불러올 수 없습니다.</div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            점수: {score}
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="text-sm text-blue-600 mb-2">
            {PART_OF_SPEECH_KOREAN[question.word.part_of_speech]}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {question.word.english}
          </h2>
          <p className="text-gray-600">위 단어의 뜻을 고르세요</p>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-colors ${
                selectedAnswer === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
            selectedAnswer
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestion + 1 === questions.length ? '결과 보기' : '다음 문제'}
        </button>
      </div>
    </div>
  )
}