// lib/supabaseTypes.ts
import { supabase } from './supabaseClient'

// Types
export interface MCQ {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  category: 'software' | 'physics' | 'chemistry'
  difficulty: 'easy' | 'medium' | 'hard'
  created_at?: string
}

export interface TestResult {
  id?: string
  user_name?: string
  category: string
  difficulty: string
  total_questions: number
  correct_answers: number
  wrong_answers: number
  score: number
  time_taken?: number
  completed_at?: string
}

export interface UserAnswer {
  questionIndex: number
  selectedAnswer: string
  isCorrect: boolean
  correctAnswer: string
}

// Fetch MCQs from Supabase
export async function fetchMCQs(
  category: string,
  difficulty: string,
  limit: number = 60
): Promise<MCQ[]> {
  const { data, error } = await supabase
    .from('mcqs')
    .select('*')
    .eq('category', category)
    .eq('difficulty', difficulty)
    .limit(limit)

  if (error) {
    console.error('Error fetching MCQs:', error)
    throw new Error(`Failed to fetch MCQs: ${error.message}`)
  }

  if (!data || data.length === 0) {
    throw new Error(`No MCQs found for category: ${category}, difficulty: ${difficulty}`)
  }

  // Shuffle the questions
  return shuffleArray(data)
}

// Save test result to Supabase
export async function saveTestResult(result: TestResult): Promise<TestResult | null> {
  const { data, error } = await supabase
    .from('test_results')
    .insert([result])
    .select()
    .single()

  if (error) {
    console.error('Error saving test result:', error)
    throw new Error(`Failed to save test result: ${error.message}`)
  }

  return data
}

// Get user's test history (optional feature)
export async function getUserTestHistory(userName: string): Promise<TestResult[]> {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_name', userName)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('Error fetching test history:', error)
    return []
  }

  return data || []
}

// Get leaderboard (optional feature)
export async function getLeaderboard(
  category?: string,
  difficulty?: string,
  limit: number = 10
): Promise<TestResult[]> {
  let query = supabase
    .from('test_results')
    .select('*')
    .order('score', { ascending: false })
    .order('time_taken', { ascending: true })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }

  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data || []
}

// Utility function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}