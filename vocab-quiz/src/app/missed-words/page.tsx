'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { WordStats } from '@/types/quiz'

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

export default function MissedWords() {
  const router = useRouter()
  const [wordStats, setWordStats] = useState<WordStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMissedWords()
  }, [])

  const loadMissedWords = async () => {
    try {
      setIsLoading(true)
      
      // Get words with lowest accuracy rates (most missed)
      const { data, error } = await supabase
        .from('word_stats')
        .select(`
          *,
          word:words(*)
        `)
        .gte('total_attempts', 2) // Only include words attempted at least twice
        .order('accuracy_rate', { ascending: true })
        .order('total_attempts', { ascending: false })
        .limit(15)

      if (error) throw error

      setWordStats(data || [])
    } catch (error) {
      console.error('Error loading missed words:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createPracticeQuiz = async () => {
    if (wordStats.length === 0) return

    const wordIds = wordStats.slice(0, 10).map(stat => stat.word_id) // 상위 10개만
    // Navigate to a practice quiz with these specific words
    router.push(`/practice-quiz?words=${wordIds.join(',')}`)
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-400'
    if (accuracy >= 60) return 'text-yellow-400'
    if (accuracy >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-xl text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-4 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">많이 틀린 단어 TOP 15</h1>
            <div className="flex gap-3">
              <button
                onClick={createPracticeQuiz}
                disabled={wordStats.length === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  wordStats.length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                약점 단어 연습
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로
              </button>
            </div>
          </div>

          {wordStats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                아직 충분한 데이터가 없습니다
              </h3>
              <p className="text-gray-400 mb-6">
                더 많은 퀴즈를 풀어보시면 약점 단어를 분석해드려요!
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                퀴즈 시작하기
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl">
                <h3 className="font-semibold text-red-400 mb-2">💡 학습 팁</h3>
                <p className="text-gray-300 text-sm">
                  정답률이 낮은 단어들을 집중적으로 학습하면 효과적으로 실력을 향상시킬 수 있어요!
                </p>
              </div>

              <div className="space-y-4">
                {wordStats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="bg-gray-700 rounded-xl p-5 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {stat.word?.english}
                          </div>
                          <div className="text-blue-400 text-sm">
                            {stat.word && PART_OF_SPEECH_KOREAN[stat.word.part_of_speech]}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getAccuracyColor(stat.accuracy_rate)}`}>
                          {Math.round(stat.accuracy_rate)}%
                        </div>
                        <div className="text-gray-400 text-sm">
                          {stat.correct_attempts}/{stat.total_attempts}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-green-400 font-medium">
                        정답: {stat.word?.korean}
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            stat.accuracy_rate >= 80 ? 'bg-green-400' :
                            stat.accuracy_rate >= 60 ? 'bg-yellow-400' :
                            stat.accuracy_rate >= 40 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${stat.accuracy_rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={createPracticeQuiz}
                  className="flex-1 py-4 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  약점 단어로 연습하기
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  새 퀴즈 시작
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}