'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QuizResult } from '@/types/quiz'


export default function Results() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setResults(data || [])
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">퀴즈 결과</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              홈으로
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">아직 퀴즈 결과가 없습니다.</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                퀴즈 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => {
                const percentage = Math.round((result.score / result.total_questions) * 100)
                const date = new Date(result.completed_at).toLocaleDateString('ko-KR')
                const time = new Date(result.completed_at).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })

                return (
                  <div
                    key={result.id || index}
                    className="bg-gray-50 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500">
                          {date} {time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.total_questions}문제 중 {result.score}문제 정답
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">통계</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">총 퀴즈 횟수:</span>
                  <span className="ml-2 font-semibold">{results.length}회</span>
                </div>
                <div>
                  <span className="text-gray-600">평균 점수:</span>
                  <span className="ml-2 font-semibold">
                    {Math.round(
                      results.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0) / results.length
                    )}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}