'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QuizResult, QuizAnswer } from '@/types/quiz'

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

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function QuizResultDetail({ params }: Props) {
  const router = useRouter()
  const { id } = use(params)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadQuizResult = async () => {
    try {
      setIsLoading(true)

      // Load quiz result
      const { data: resultData, error: resultError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', id)
        .single()

      if (resultError) throw resultError
      setQuizResult(resultData)

      // Load quiz answers with word details
      const { data: answersData, error: answersError } = await supabase
        .from('quiz_answers')
        .select(`
          *,
          word:words(*)
        `)
        .eq('quiz_result_id', id)
        .order('answered_at')

      if (answersError) throw answersError
      setAnswers(answersData || [])

    } catch (error) {
      console.error('Error loading quiz result:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQuizResult()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-xl text-white">로딩 중...</div>
      </div>
    )
  }

  if (!quizResult) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-xl text-white">퀴즈 결과를 찾을 수 없습니다.</div>
      </div>
    )
  }

  const percentage = Math.round((quizResult.score / quizResult.total_questions) * 100)
  const wrongAnswers = answers.filter(answer => !answer.is_correct)
  const correctAnswers = answers.filter(answer => answer.is_correct)

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-4 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">퀴즈 상세 결과</h1>
            <button
              onClick={() => router.push('/results')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              결과 목록으로
            </button>
          </div>

          {/* 요약 */}
          <div className="bg-gray-700 rounded-xl p-6 mb-6 border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">{percentage}%</div>
                <div className="text-gray-300">정답률</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{quizResult.score}</div>
                <div className="text-gray-300">맞힌 문제</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">{quizResult.total_questions - quizResult.score}</div>
                <div className="text-gray-300">틀린 문제</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-400">{quizResult.total_questions}</div>
                <div className="text-gray-300">전체 문제</div>
              </div>
            </div>
          </div>

          {/* 틀린 문제들 */}
          {wrongAnswers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-red-400 mb-4">
                틀린 문제 ({wrongAnswers.length}개)
              </h2>
              <div className="space-y-4">
                {wrongAnswers.map((answer, index) => (
                  <div key={answer.id} className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-semibold">#{index + 1}</span>
                        <span className="text-sm text-blue-400">
                          {answer.word && PART_OF_SPEECH_KOREAN[answer.word.part_of_speech]}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {answer.word?.english}
                    </div>
                    <div className="space-y-1">
                      <div className="text-red-400">
                        ❌ 내 답: {answer.user_answer}
                      </div>
                      <div className="text-green-400">
                        ✅ 정답: {answer.correct_answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 맞힌 문제들 */}
          {correctAnswers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-400 mb-4">
                맞힌 문제 ({correctAnswers.length}개)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {correctAnswers.map((answer, index) => (
                  <div key={answer.id} className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-semibold">#{index + 1}</span>
                      <span className="text-sm text-blue-400">
                        {answer.word && PART_OF_SPEECH_KOREAN[answer.word.part_of_speech]}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white mb-1">
                      {answer.word?.english}
                    </div>
                    <div className="text-green-400">
                      ✅ {answer.correct_answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              새 퀴즈 시작
            </button>
            <button
              onClick={() => router.push('/results')}
              className="flex-1 py-3 px-6 bg-gray-700 text-gray-200 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              결과 목록
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}