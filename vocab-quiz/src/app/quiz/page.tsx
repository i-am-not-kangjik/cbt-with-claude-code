'use client'

import { useEffect, useState, Suspense } from 'react'
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

function QuizContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const questionCount = parseInt(searchParams.get('count') || '10')
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<Array<{word: Word, userAnswer: string, isCorrect: boolean}>>([])
  const [, setQuizResultId] = useState<string>('')

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      
      // Get random words by ordering randomly
      const { data: words, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error

      // Shuffle and take the requested number of questions
      const shuffledWords = words?.sort(() => Math.random() - 0.5).slice(0, questionCount) || []

      if (shuffledWords && shuffledWords.length > 0) {
        const quizQuestions = await Promise.all(
          shuffledWords.map(async (word) => {
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

  useEffect(() => {
    loadQuestions()
  }, [questionCount])


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
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    const newScore = isCorrect ? score + 1 : score
    
    // Record the user's answer
    const answerRecord = {
      word: questions[currentQuestion].word,
      userAnswer: selectedAnswer,
      isCorrect: isCorrect
    }
    setUserAnswers(prev => [...prev, answerRecord])
    
    setScore(newScore)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      const resultId = await saveQuizResult(newScore, [...userAnswers, answerRecord])
      setQuizResultId(resultId)
      setShowResult(true)
    }
  }

  const saveQuizResult = async (finalScore: number, answers: Array<{word: Word, userAnswer: string, isCorrect: boolean}>) => {
    try {
      // Save quiz result
      const { data: quizResult, error: quizError } = await supabase
        .from('quiz_results')
        .insert({
          score: finalScore,
          total_questions: questions.length,
          completed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (quizError) throw quizError

      const resultId = quizResult.id

      // Save individual answers
      const answersToInsert = answers.map(answer => ({
        quiz_result_id: resultId,
        word_id: answer.word.id,
        user_answer: answer.userAnswer,
        correct_answer: answer.word.korean,
        is_correct: answer.isCorrect,
        answered_at: new Date().toISOString()
      }))

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answersToInsert)

      if (answersError) throw answersError

      // Update word statistics
      await updateWordStats(answers)

      return resultId
    } catch (error) {
      console.error('Error saving quiz result:', error)
      return null
    }
  }

  const updateWordStats = async (answers: Array<{word: Word, userAnswer: string, isCorrect: boolean}>) => {
    try {
      for (const answer of answers) {
        // Get existing stats or create new
        const { data: existingStats, error: selectError } = await supabase
          .from('word_stats')
          .select('*')
          .eq('word_id', answer.word.id)
          .maybeSingle()

        if (selectError && selectError.code !== 'PGRST116') {
          console.error('Error fetching word stats:', selectError)
          continue
        }

        if (existingStats) {
          // Update existing stats
          const newTotal = existingStats.total_attempts + 1
          const newCorrect = existingStats.correct_attempts + (answer.isCorrect ? 1 : 0)
          const newAccuracy = (newCorrect / newTotal) * 100

          const { error: updateError } = await supabase
            .from('word_stats')
            .update({
              total_attempts: newTotal,
              correct_attempts: newCorrect,
              accuracy_rate: newAccuracy,
              last_updated: new Date().toISOString()
            })
            .eq('word_id', answer.word.id)

          if (updateError) {
            console.error('Error updating word stats:', updateError)
          }
        } else {
          // Create new stats
          const { error: insertError } = await supabase
            .from('word_stats')
            .insert({
              word_id: answer.word.id,
              total_attempts: 1,
              correct_attempts: answer.isCorrect ? 1 : 0,
              accuracy_rate: answer.isCorrect ? 100 : 0,
              last_updated: new Date().toISOString()
            })

          if (insertError) {
            console.error('Error inserting word stats:', insertError)
          }
        }
      }
    } catch (error) {
      console.error('Error updating word stats:', error)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setShowResult(false)
    setUserAnswers([])
    setQuizResultId('')
    loadQuestions()
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-xl text-white">로딩 중...</div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">퀴즈 완료!</h2>
          <div className="text-6xl font-bold text-blue-400 mb-2">{percentage}%</div>
          <p className="text-gray-300 mb-6">
            {questions.length}문제 중 {score}문제 맞춤
          </p>
          <div className="space-y-3">
            <button
              onClick={restartQuiz}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              다시 도전
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 px-6 bg-gray-700 text-gray-200 rounded-xl font-medium hover:bg-gray-600 transition-colors"
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
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-xl text-white">문제를 불러올 수 없습니다.</div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-400">
            {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            점수: {score}
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="text-sm text-blue-400 mb-2">
            {PART_OF_SPEECH_KOREAN[question.word.part_of_speech]}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {question.word.english}
          </h2>
          <p className="text-gray-300">위 단어의 뜻을 고르세요</p>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-colors ${
                selectedAnswer === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
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
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion + 1 === questions.length ? '결과 보기' : '다음 문제'}
        </button>
      </div>
    </div>
  )
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-xl text-white">로딩 중...</div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}