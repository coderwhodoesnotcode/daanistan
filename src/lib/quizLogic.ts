// lib/quizLogic.ts
import { MCQ, UserAnswer } from './supabaseTypes'

export interface QuizResults {
  correct: number
  wrong: number
  unanswered: number
  score: number
  percentage: number
  timeTaken: number
  totalQuestions: number
  userAnswers: UserAnswer[]
}

/**
 * Calculate quiz results based on selected answers
 * Scoring: +4 for correct, -1 for wrong, 0 for unanswered
 */
export function calculateQuizResults(
  mcqs: MCQ[],
  selectedAnswers: { [key: number]: string },
  timeTaken: number
): QuizResults {
  let correct = 0
  let wrong = 0
  let unanswered = 0
  const userAnswers: UserAnswer[] = []

  mcqs.forEach((mcq, index) => {
    const userAnswer = selectedAnswers[index]
    
    if (!userAnswer) {
      unanswered++
      userAnswers.push({
        questionIndex: index,
        selectedAnswer: '',
        isCorrect: false,
        correctAnswer: mcq.correct_answer,
      })
    } else if (userAnswer === mcq.correct_answer) {
      correct++
      userAnswers.push({
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect: true,
        correctAnswer: mcq.correct_answer,
      })
    } else {
      wrong++
      userAnswers.push({
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect: false,
        correctAnswer: mcq.correct_answer,
      })
    }
  })

  // Calculate score: +4 for correct, -1 for wrong
  const score = correct * 4 - wrong * 1
  const maxScore = mcqs.length * 4
  const percentage = (score / maxScore) * 100

  return {
    correct,
    wrong,
    unanswered,
    score,
    percentage: Math.max(0, percentage), // Ensure percentage is not negative
    timeTaken,
    totalQuestions: mcqs.length,
    userAnswers,
  }
}

/**
 * Format time from seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get performance grade based on percentage
 */
export function getPerformanceGrade(percentage: number): {
  grade: string
  color: string
  message: string
} {
  if (percentage >= 90) {
    return {
      grade: 'A+',
      color: 'text-green-600',
      message: 'Outstanding! Excellent performance!',
    }
  } else if (percentage >= 80) {
    return {
      grade: 'A',
      color: 'text-green-500',
      message: 'Great job! You\'re doing very well!',
    }
  } else if (percentage >= 70) {
    return {
      grade: 'B',
      color: 'text-blue-600',
      message: 'Good work! Keep it up!',
    }
  } else if (percentage >= 60) {
    return {
      grade: 'C',
      color: 'text-yellow-600',
      message: 'Fair performance. More practice needed.',
    }
  } else if (percentage >= 50) {
    return {
      grade: 'D',
      color: 'text-orange-600',
      message: 'Need improvement. Keep practicing!',
    }
  } else {
    return {
      grade: 'F',
      color: 'text-red-600',
      message: 'Need more preparation. Don\'t give up!',
    }
  }
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, wrong: number): number {
  const attempted = correct + wrong
  if (attempted === 0) return 0
  return (correct / attempted) * 100
}

/**
 * Get time status (fast, moderate, slow)
 */
export function getTimeStatus(timeTaken: number, totalTime: number = 3600): {
  status: string
  color: string
} {
  const percentageUsed = (timeTaken / totalTime) * 100

  if (percentageUsed < 50) {
    return { status: 'Fast', color: 'text-green-600' }
  } else if (percentageUsed < 80) {
    return { status: 'Moderate', color: 'text-blue-600' }
  } else {
    return { status: 'Slow', color: 'text-orange-600' }
  }
}

/**
 * Check if minimum questions threshold is met
 */
export function hasMinimumQuestions(count: number, required: number = 60): boolean {
  return count >= required
}

/**
 * Get question status for navigation
 */
export function getQuestionStatus(
  index: number,
  currentQuestion: number,
  selectedAnswers: { [key: number]: string }
): 'current' | 'answered' | 'unanswered' {
  if (index === currentQuestion) return 'current'
  if (selectedAnswers[index]) return 'answered'
  return 'unanswered'
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, total: number): number {
  return Math.round(((current + 1) / total) * 100)
}

/**
 * Get completion stats
 */
export function getCompletionStats(selectedAnswers: { [key: number]: string }, total: number): {
  answered: number
  unanswered: number
  percentageComplete: number
} {
  const answered = Object.keys(selectedAnswers).length
  const unanswered = total - answered
  const percentageComplete = (answered / total) * 100

  return {
    answered,
    unanswered,
    percentageComplete: Math.round(percentageComplete),
  }
}

/**
 * Validate if quiz can be submitted
 */
export function canSubmitQuiz(selectedAnswers: { [key: number]: string }): {
  canSubmit: boolean
  message?: string
} {
  const answeredCount = Object.keys(selectedAnswers).length

  if (answeredCount === 0) {
    return {
      canSubmit: false,
      message: 'Please answer at least one question before submitting.',
    }
  }

  return { canSubmit: true }
}

/**
 * Get recommended study areas based on performance
 */
export function getRecommendations(
  percentage: number,
  category: string
): string[] {
  const recommendations: string[] = []

  if (percentage < 50) {
    recommendations.push(`Focus on fundamental concepts in ${category}`)
    recommendations.push('Review basic theory and practice more questions')
    recommendations.push('Consider starting with easier difficulty level')
  } else if (percentage < 70) {
    recommendations.push('Good foundation! Work on intermediate topics')
    recommendations.push('Practice more medium difficulty questions')
    recommendations.push('Review incorrect answers to understand mistakes')
  } else if (percentage < 90) {
    recommendations.push('Excellent progress! Polish your knowledge')
    recommendations.push('Try harder difficulty questions')
    recommendations.push('Focus on speed and accuracy')
  } else {
    recommendations.push('Outstanding! You\'re ready for the exam')
    recommendations.push('Maintain consistency with regular practice')
    recommendations.push('Help others and teach concepts to solidify knowledge')
  }

  return recommendations
}