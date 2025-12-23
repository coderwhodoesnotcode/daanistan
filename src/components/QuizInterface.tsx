// app/awc-test-preparation/components/QuizInterface.tsx
'use client'

import { useState, useEffect } from 'react'
import { MCQ, saveTestResult } from '@/lib/supabaseTypes'
import { calculateQuizResults, formatTime, getPerformanceGrade, getRecommendations } from '@/lib/quizLogic'
import { Clock, CheckCircle2, XCircle, Award, TrendingUp } from 'lucide-react'

interface QuizInterfaceProps {
  mcqs: MCQ[]
  category: string
  difficulty: string
}

export default function QuizInterface({ mcqs, category, difficulty }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState<any>(null)

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    })
  }

  const calculateResults = () => {
    const results = calculateQuizResults(mcqs, selectedAnswers, 3600 - timeLeft)
    return results
  }

  const handleSubmit = async () => {
    const results = calculateResults()
    setResults(results)
    setIsSubmitted(true)

    // Save to Supabase
    try {
      await saveTestResult({
        category,
        difficulty,
        total_questions: results.totalQuestions,
        correct_answers: results.correct,
        wrong_answers: results.wrong,
        score: results.score,
        time_taken: results.timeTaken,
      })
    } catch (error) {
      console.error('Failed to save result:', error)
    }
  }

  // Result Screen
  if (isSubmitted && results) {
    const performance = getPerformanceGrade(results.percentage)
    const recommendations = getRecommendations(results.percentage, category)

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Award className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Test Completed!
            </h2>
            <div className={`text-6xl font-black mb-2 ${performance.color}`}>
              {performance.grade}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {performance.message}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border-2 border-green-200 dark:border-green-700">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <div>
                  <p className="text-3xl font-black text-green-600">{results.correct}</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Correct Answers</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+{results.correct * 4} marks</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border-2 border-red-200 dark:border-red-700">
              <div className="flex items-center gap-4">
                <XCircle className="w-12 h-12 text-red-600" />
                <div>
                  <p className="text-3xl font-black text-red-600">{results.wrong}</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Wrong Answers</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">-{results.wrong} marks</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-4">
                <Clock className="w-12 h-12 text-gray-600" />
                <div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{results.unanswered}</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Unanswered</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No marks</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl border-2 border-blue-400">
              <div className="flex items-center gap-4 text-white">
                <Award className="w-12 h-12" />
                <div>
                  <p className="text-3xl font-black">{results.score}</p>
                  <p className="font-semibold">Total Score</p>
                  <p className="text-sm text-blue-100">Out of {results.totalQuestions * 4}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Time Taken: {formatTime(results.timeTaken)}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Accuracy: {results.percentage.toFixed(1)}%
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Interface
  const currentMCQ = mcqs[currentQuestion]
  const progress = ((currentQuestion + 1) / mcqs.length) * 100

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Timer and Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Clock className={`w-6 h-6 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
            <span className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Question {currentQuestion + 1} of {mcqs.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
            Question {currentQuestion + 1}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {currentMCQ.question}
          </h2>
        </div>

        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = currentMCQ[`option_${option.toLowerCase()}` as keyof MCQ] as string
            const isSelected = selectedAnswers[currentQuestion] === option

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option}
                  </div>
                  <span className="text-lg text-gray-900 dark:text-white">{optionText}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          Previous
        </button>

        {currentQuestion === mcqs.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(mcqs.length - 1, currentQuestion + 1))}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Next
          </button>
        )}
      </div>

      {/* MCQ Status Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Question Overview</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Attempted ({Object.keys(selectedAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-700 dark:text-gray-300">Unattempted ({mcqs.length - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {mcqs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`aspect-square rounded-lg font-semibold transition-all hover:scale-110 ${
                selectedAnswers[index]
                  ? 'bg-green-500 text-white'
                  : currentQuestion === index
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}