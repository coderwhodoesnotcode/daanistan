"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChapterPage() {
  const { subject, chapter } = useParams();

  // Extract chapter number from the chapter param (e.g., "chapter-1" -> "1")
const chapterNumber = chapter?.toString().replace("chapter-", "") || "";

  // Define the number of exercises per chapter
  const exerciseCounts: { [key: string]: number } = {
    "1": 3,  // Chapter 1 has exercises 1.1, 1.2, 1.3
    "2": 4,  // Chapter 2 has exercises 2.1, 2.2, 2.3, 2.4
    "3": 5,  // Example: Chapter 3 has 5 exercises
    "4": 6,
    "5": 4,
    "6": 5,
    "7": 3,
    "8": 3,
    "9": 2,
    "10": 3,
    "11": 4,
    "12": 6,
    // Add more chapters as needed
  };

  // Get the number of exercises for this chapter (default to 3 if not specified)
  const numExercises = exerciseCounts[chapterNumber] || 3;

  // Dynamically generate exercises based on the actual count
  const exercises = [
    ...Array.from({ length: numExercises }, (_, i) => `${chapterNumber}.${i + 1}`),
    "complete-notes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href="/kpk-boards/class-11" 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Class 11
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href={`/kpk-boards/class-11/${subject}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors capitalize"
              >
                {subject.toString()}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 dark:text-blue-400 font-medium capitalize">
              {chapter.toString().replace("-", " ")}
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight capitalize">
            {subject.toString()} - {chapter.toString().replace("-", " ")}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="capitalize">{subject.toString()}</span>
            </span>
            <span>•</span>
            <span className="capitalize">{chapter.toString().replace("-", " ")}</span>
            <span>•</span>
            <span>{numExercises} Exercises</span>
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Select an exercise to view detailed notes and solutions, or access the complete chapter notes.
          </p>
        </div>

        {/* Exercise Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exercises.map((ex) => (
              <Link
                key={ex}
                href={`/kpk-boards/class-11/${subject}/${chapter}/${ex}`}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  {ex === "complete-notes" ? (
                    <>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-base font-bold text-gray-900 dark:text-white block">
                          Complete Notes
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Full chapter summary
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-base font-bold text-gray-900 dark:text-white block">
                          Exercise {ex}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Problems & solutions
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-xl transition-colors pointer-events-none"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link
            href={`/kpk-boards/class-11/${subject}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-full hover:from-gray-800 hover:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium capitalize">Back to {subject.toString()}</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>KPK Board - Class 11 - New Syllabus</p>
        </div>
      </div>
    </div>
  );
}