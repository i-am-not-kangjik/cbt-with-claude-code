'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">강직 영단어</h1>
        <p className="text-gray-300 mb-8">품사별로 영단어를 학습해보세요</p>
        
        <div className="space-y-4">
          <Link 
            href="/quiz?count=10"
            className="block w-full py-4 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            10문제 풀기
          </Link>
          
          <Link 
            href="/quiz?count=30"
            className="block w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            30문제 풀기
          </Link>
          
          <Link 
            href="/quiz?count=50"
            className="block w-full py-4 px-6 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            50문제 풀기
          </Link>
          
          <Link 
            href="/quiz?count=100"
            className="block w-full py-4 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            100문제 풀기
          </Link>
          
          <Link 
            href="/results"
            className="block w-full py-3 px-6 bg-gray-700 text-gray-200 rounded-xl font-medium hover:bg-gray-600 transition-colors"
          >
            결과 보기
          </Link>
          
          <Link 
            href="/missed-words"
            className="block w-full py-3 px-6 bg-red-700 text-gray-200 rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            많이 틀린 단어 보기
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>명사, 동사, 형용사, 부사 등 다양한 품사의 영단어를 학습하세요</p>
        </div>
      </div>
    </div>
  )
}
