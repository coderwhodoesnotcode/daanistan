// app/awc-test-preparation/assistant-manager-chemistry/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { fetchMCQs, MCQ } from '@/lib/supabaseTypes'
import QuizInterface from '../../../components/QuizInterface'
import { FlaskConical, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SoftwareTestPage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null)
  const [mcqs, setMcqs] = useState<MCQ[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testStarted, setTestStarted] = useState(false)

  const loadMCQs = async (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMCQs('chemistry', selectedDifficulty, 60)
      if (data.length < 60) {
        setError(`Only ${data.length} questions available for ${selectedDifficulty} difficulty. Need at least 60 questions.`)
        setLoading(false)
        return
      }
      setMcqs(data)
      setTestStarted(true)
    } catch (err) {
      setError('Failed to load questions. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty)
    loadMCQs(selectedDifficulty)
  }

  if (testStarted && mcqs.length > 0) {
    return <QuizInterface mcqs={mcqs} category="chemistry" difficulty={difficulty!} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/awc-test-preparation"
          className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Test Categories
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-2xl mb-6">
            <FlaskConical className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Assistant Manager Chemistry Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select your difficulty level to start the 60-question practice test
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-6 mb-8">
            <p className="text-red-600 dark:text-red-400 font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Difficulty Selection */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy */}
            <button
              onClick={() => handleDifficultySelect('easy')}
              className="group relative bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-200 dark:border-green-600"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-green-600 mb-4">Easy</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Beginner Level
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Basic concepts and fundamental questions. Perfect for starting your preparation.
                </p>
                <div className="flex items-center justify-between text-green-600 dark:text-green-400 font-semibold">
                  <span>60 Questions</span>
                  <span>60 Minutes</span>
                </div>
              </div>
            </button>

            {/* Medium */}
            <button
              onClick={() => handleDifficultySelect('medium')}
              className="group relative bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-yellow-200 dark:border-yellow-600"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-yellow-600 mb-4">Medium</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Intermediate Level
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Moderate difficulty with applied concepts. Good for building confidence.
                </p>
                <div className="flex items-center justify-between text-yellow-600 dark:text-yellow-400 font-semibold">
                  <span>60 Questions</span>
                  <span>60 Minutes</span>
                </div>
              </div>
            </button>

            {/* Hard */}
            <button
              onClick={() => handleDifficultySelect('hard')}
              className="group relative bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-200 dark:border-red-600"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-red-600 mb-4">Hard</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Advanced Level
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Challenging questions requiring deep understanding. Test your limits!
                </p>
                <div className="flex items-center justify-between text-red-600 dark:text-red-400 font-semibold">
                  <span>60 Questions</span>
                  <span>60 Minutes</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-16 h-16 text-green-600 animate-spin mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Loading Questions...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Preparing your {difficulty} level test
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!loading && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Test Instructions</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>The test contains 60 multiple-choice questions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>You have 60 minutes (1 hour) to complete the test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Each correct answer gives you +4 marks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Each wrong answer deducts -1 mark (negative marking)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Unanswered questions receive 0 marks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>The test will auto-submit when time runs out</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>You can navigate between questions and change answers before submitting</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}