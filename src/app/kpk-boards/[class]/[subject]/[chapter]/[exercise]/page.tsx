'use client'

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabaseClient";
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Note {
  id: number;
  title: string;
  content: string;
  pdf_url?: string;
  subject: string;
  chapter: string;
  exercise: string;
}

interface Numerical {
  id: number;
  title: string;
  content: string;
  subject: string;
  chapter: string;
  exercise: string;
}

interface MCQ {
  id: number;
  subject: string;
  chapter: string;
  exercise: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

interface QuizOption {
  label: string;
  text: string;
}

interface QuizQuestion extends MCQ {
  shuffledOptions: QuizOption[];
}

export default function ExercisePage({ 
  params 
}: { 
  params: Promise<{ class: string; subject: string; chapter: string; exercise: string }>
}) {
  const [note, setNote] = useState<Note | null>(null);
  const [numerical, setNumerical] = useState<Numerical | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<{ class: string; subject: string; chapter: string; exercise: string } | null>(null);
  
  // MCQ display states
  const [showAnswers, setShowAnswers] = useState(false);
  
  // Quiz states
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      setUrlParams(resolvedParams);
      
      const { class: classNum, subject, chapter, exercise } = resolvedParams;
      
      const classNumber = classNum.replace("class-", "");
      const dbSubject = `${subject}-kpk-${classNumber}`;
      
      const supabase = createClient();

      console.log('Searching for:', {
        subject: dbSubject.trim(),
        chapter: chapter.trim(),
        exercise: exercise.trim()
      });

      // Fetch notes (existing logic)
      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("subject", dbSubject.trim())
        .eq("chapter", chapter.trim())
        .eq("exercise", exercise.trim());

      console.log('Found notes:', notesData);

      if (notesError) {
        console.error('Notes error:', notesError);
      }

      if (notesData && notesData.length > 0) {
        setNote(notesData[0]);
      }

      // Fetch numericals (new logic)
      const { data: numericalsData, error: numericalsError } = await supabase
        .from("numericals")
        .select("*")
        .eq("subject", dbSubject.trim())
        .eq("chapter", chapter.trim())
        .eq("exercise", exercise.trim());

      console.log('Found numericals:', numericalsData);

      if (numericalsError) {
        console.error('Numericals error:', numericalsError);
      }

      if (numericalsData && numericalsData.length > 0) {
        setNumerical(numericalsData[0]);
      }

      // Fetch MCQs (existing logic)
      const { data: mcqsData, error: mcqsError } = await supabase
        .from("mcqssubject")
        .select("*")
        .eq("subject", dbSubject.trim())
        .eq("chapter", chapter.trim())
        .eq("exercise", exercise.trim())
        .order('id', { ascending: true });

      console.log('Found MCQs:', mcqsData);

      if (mcqsError) {
        console.error('MCQs error:', mcqsError);
      }

      if (mcqsData && mcqsData.length > 0) {
        setMcqs(mcqsData);
      }

      // Set error only if all are empty
      if ((!notesData || notesData.length === 0) && 
          (!numericalsData || numericalsData.length === 0) && 
          (!mcqsData || mcqsData.length === 0)) {
        setError("No content found for this exercise");
      }

      setLoading(false);
    }

    loadData();
  }, [params]);

  const shuffleOptions = (mcq: MCQ): QuizQuestion => {
    const options = [
      { label: 'A', text: mcq.option_a },
      { label: 'B', text: mcq.option_b },
      { label: 'C', text: mcq.option_c },
      { label: 'D', text: mcq.option_d },
    ];

    // Shuffle array
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    return {
      ...mcq,
      shuffledOptions: shuffled
    };
  };

  const startQuiz = () => {
    const shuffledQuestions = mcqs.map(shuffleOptions);
    setQuizQuestions(shuffledQuestions);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizAnswer = (questionId: number, selectedLabel: string) => {
    if (!quizSubmitted) {
      setUserAnswers(prev => ({ ...prev, [questionId]: selectedLabel }));
    }
  };

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (userAnswer) {
        const selectedOption = q.shuffledOptions.find(opt => opt.label === userAnswer);
        if (selectedOption) {
          const originalLabel = 
            selectedOption.text === q.option_a ? 'A' :
            selectedOption.text === q.option_b ? 'B' :
            selectedOption.text === q.option_c ? 'C' : 'D';
          
          if (originalLabel === q.correct_option) {
            score++;
          }
        }
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const exitQuiz = () => {
    setQuizMode(false);
    setQuizQuestions([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error && !note && !numerical && mcqs.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-lg p-8 shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
                  No content found
                </h2>
                {urlParams && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Searching for:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Subject:</span>
                        <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                          {urlParams.subject}-kpk-{urlParams.class.replace("class-", "")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Chapter:</span>
                        <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                          {urlParams.chapter}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Exercise:</span>
                        <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                          {urlParams.exercise}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Mode View
  if (quizMode && quizQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Quiz Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Mode</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {quizQuestions.length} Questions • {quizSubmitted ? `Score: ${quizScore}/${quizQuestions.length}` : 'In Progress'}
                </p>
              </div>
              <button
                onClick={exitQuiz}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Exit Quiz
              </button>
            </div>

            {quizSubmitted && (
              <div className={`p-4 rounded-lg ${quizScore / quizQuestions.length >= 0.7 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                <p className="text-lg font-semibold">
                  Your Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                </p>
              </div>
            )}
          </div>

          {/* Quiz Questions */}
          <div className="space-y-6">
            {quizQuestions.map((q, index) => {
              const userAnswer = userAnswers[q.id];
              
              const correctOptionText = 
                q.correct_option === 'A' ? q.option_a :
                q.correct_option === 'B' ? q.option_b :
                q.correct_option === 'C' ? q.option_c : q.option_d;

              return (
                <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {q.question}
                      </p>

                      <div className="space-y-3">
                        {q.shuffledOptions.map((option) => {
                          const isSelected = userAnswer === option.label;
                          const isCorrect = option.text === correctOptionText;
                          
                          let bgColor = 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
                          if (quizSubmitted) {
                            if (isCorrect) {
                              bgColor = 'bg-green-100 dark:bg-green-900/50 border-2 border-green-500';
                            } else if (isSelected && !isCorrect) {
                              bgColor = 'bg-red-100 dark:bg-red-900/50 border-2 border-red-500';
                            }
                          } else if (isSelected) {
                            bgColor = 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500';
                          }

                          return (
                            <button
                              key={option.label}
                              onClick={() => handleQuizAnswer(q.id, option.label)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-lg transition-all ${bgColor} ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                  {option.label}.
                                </span>
                                <span className="text-gray-800 dark:text-gray-200">
                                  {option.text}
                                </span>
                                {quizSubmitted && isCorrect && (
                                  <span className="ml-auto text-green-600 dark:text-green-400">✓</span>
                                )}
                                {quizSubmitted && isSelected && !isCorrect && (
                                  <span className="ml-auto text-red-600 dark:text-red-400">✗</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && q.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            Explanation:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {!quizSubmitted && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={submitQuiz}
                disabled={Object.keys(userAnswers).length !== quizQuestions.length}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit Quiz ({Object.keys(userAnswers).length}/{quizQuestions.length} answered)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Determine display priority: numericals > notes > nothing
  const displayContent = numerical || note;

  // Normal View (with notes/numericals and MCQs)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb Navigation */}
        {displayContent && (
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">
                  {displayContent.subject}
                </span>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Chapter {displayContent.chapter}
                </span>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-blue-600 dark:text-blue-400 font-medium">
                {displayContent.exercise}
              </li>
            </ol>
          </nav>
        )}

        {/* Title Section */}
        {displayContent && (
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {displayContent.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="capitalize">{displayContent.subject}</span>
              </span>
              <span>•</span>
              <span>Chapter {displayContent.chapter}</span>
              <span>•</span>
              <span>{displayContent.exercise}</span>
              {numerical && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-semibold">
                    Numericals
                  </span>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Main Content Card - Numericals take priority over Notes */}
{displayContent && (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
    <div className="p-8 md:p-12 lg:p-16">
      <MarkdownRenderer 
        content={displayContent.content
          // First, protect math content from markdown processing
          .replace(/\\\[/g, '$$$$')
          .replace(/\\\]/g, '$$$$')
          .replace(/\\\(/g, '$$')
          .replace(/\\\)/g, '$$')
          // Fix asterisks in math mode if they should be plus signs
          .replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
            // This replaces * with + inside display math
            return '$$' + math.replace(/\*/g, '+') + '$$';
          })
        } 
      />
    </div>
  </div>
)}

        {/* MCQs Section */}
        {mcqs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Multiple Choice Questions
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                  </button>
                  <button
                    onClick={startQuiz}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Start Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {mcqs.map((mcq, index) => (
                  <div key={mcq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          {mcq.question}
                        </p>

                        <div className="space-y-2 mb-4">
                          {[
                            { label: 'A', text: mcq.option_a },
                            { label: 'B', text: mcq.option_b },
                            { label: 'C', text: mcq.option_c },
                            { label: 'D', text: mcq.option_d },
                          ].map((option) => {
                            const isCorrect = option.label === mcq.correct_option;
                            return (
                              <div
                                key={option.label}
                                className={`p-3 rounded-lg ${
                                  showAnswers && isCorrect
                                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                    : 'bg-gray-50 dark:bg-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {option.label}.
                                  </span>
                                  <span className="text-gray-800 dark:text-gray-200">
                                    {option.text}
                                  </span>
                                  {showAnswers && isCorrect && (
                                    <span className="ml-auto text-green-600 dark:text-green-400 font-bold">
                                      ✓ Correct
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {showAnswers && mcq.explanation && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {mcq.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}



        {/* PDF Section */}
        {note?.pdf_url && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Document</h2>
              <button
                onClick={() => {
                  const pageUrl = window.location.href;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(pageUrl)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>

            <div className="relative w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <iframe
                src={note.pdf_url}
                className="w-full h-[600px] md:h-[800px]"
                title="PDF Viewer"
              />
              
              <div className="absolute top-0 right-0 w-16 h-16 bg-transparent pointer-events-auto z-10"></div>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Cannot view the PDF?{' '}
                <a href={note.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                  Open in new tab
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>KPK Board - New Syllabus</p>
        </div>
      </div>
    </div>
  );
}