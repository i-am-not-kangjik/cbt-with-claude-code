'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">영단어 퀴즈</h1>
        <p className="text-gray-600 mb-8">품사별로 영단어를 학습해보세요</p>
        
        <div className="space-y-4">
          <Link 
            href="/quiz"
            className="block w-full py-4 px-6 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            시작하기
          </Link>
          
          <Link 
            href="/results"
            className="block w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            결과 보기
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>명사, 동사, 형용사, 부사 등 다양한 품사의 영단어를 학습하세요</p>
        </div>
      </div>
    </div>
  )
}
