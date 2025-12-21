"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChapterPage() {
  const params = useParams();
  const classNum = params.class as string;
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  if (!classNum || !subject || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Page
          </h1>
          <Link href="/kpk-boards" className="text-blue-600 hover:underline">
            Go back to KPK Boards
          </Link>
        </div>
      </div>
    );
  }

  const classNumber = classNum.replace("class-", "");
  const chapterNumber = chapter.replace("chapter-", "");

  // Check if subject is maths
  const isMaths = subject === "maths";

  // Exercise counts per class and chapter for Mathematics
  const mathsExerciseData: { [key: string]: { [key: string]: number } } = {
    "9": {
      "1": 3, "2": 4, "3": 5, "4": 4, "5": 3, "6": 4, "7": 3, "8": 4,
      "9": 3, "10": 4, "11": 3, "12": 4, "13": 5, "14": 4, "15": 3
    },
    "10": {
      "1": 4, "2": 5, "3": 4, "4": 5, "5": 4, "6": 5, "7": 4, "8": 3,
      "9": 4, "10": 4, "11": 5, "12": 4, "13": 4, "14": 3
    },
    "11": {
      "1": 3, "2": 4, "3": 5, "4": 6, "5": 4, "6": 5, "7": 3, "8": 3,
      "9": 2, "10": 3, "11": 4, "12": 6
    },
    "12": {
      "1": 1, "2": 4, "3": 5, "4": 3, "5": 2, "6": 6, "7": 4, "8": 3,
      "9": 4, "10": 2, "11": 2, "12": 2
    }
  };

  const numExercises = mathsExerciseData[classNumber]?.[chapterNumber] || 3;

  // Maths exercises - ensure slugs match URL structure
  const mathsExercises = [
    ...Array.from({ length: numExercises }, (_, i) => ({
      name: `Exercise ${chapterNumber}.${i + 1}`,
      slug: `${chapterNumber}.${i + 1}`,
      icon: "📝",
      description: "Problems & solutions",
      gradient: "from-blue-500 to-cyan-500"
    })),
    // {
    //   name: "Review Exercises",
    //   slug: "review",
    //   icon: "🔍",
    //   description: "Chapter review questions",
    //   gradient: "from-indigo-500 to-purple-500"
    // },
    {
      name: "Complete Notes",
      slug: "complete-notes",
      icon: "📚",
      description: "Full chapter summary",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  // Science subjects (Physics, Chemistry, Biology) sections
  const scienceSections = [
    {
      name: "SLO Based Questions",
      slug: "slo-questions",
      icon: "📋",
      description: "Student Learning Outcomes based questions",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "MCQs",
      slug: "mcqs",
      icon: "✓",
      description: "Multiple choice questions",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Numericals",
      slug: "numericals",
      icon: "🔢",
      description: "Numerical problems & solutions",
      gradient: "from-orange-500 to-red-500"
    },
    {
      name: "Complete Notes",
      slug: "complete-notes",
      icon: "📚",
      description: "Full chapter summary",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const sections = isMaths ? mathsExercises : scienceSections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/kpk-boards/${classNum}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                Class {classNumber}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/kpk-boards/${classNum}/${subject}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors capitalize">
                {subject}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 dark:text-blue-400 font-medium capitalize">
              {chapter.replace("-", " ")}
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight capitalize">
            {subject} - {chapter.replace("-", " ")}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Class {classNumber}</span>
            </span>
            <span>•</span>
            <span className="capitalize">{subject}</span>
            <span>•</span>
            <span className="capitalize">{chapter.replace("-", " ")}</span>
            <span>•</span>
            <span>{isMaths ? `${numExercises} Exercises` : '4 Sections'}</span>
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {isMaths 
              ? "Select an exercise to view detailed notes and solutions, or access the complete chapter notes."
              : "Select a section to view detailed study materials and practice questions."
            }
          </p>
        </div>

        {/* Content Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 mb-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMaths ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-2 xl:grid-cols-4'} gap-6`}>
            {sections.map((section) => (
              <Link
                key={section.slug}
                href={`/kpk-boards/${classNum}/${subject}/${chapter}/${section.slug}`}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className={`w-14 h-14 bg-gradient-to-br ${section.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                  <div>
                    <span className="text-base font-bold text-gray-900 dark:text-white block">
                      {section.name}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {section.description}
                    </span>
                  </div>
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
            href={`/kpk-boards/${classNum}/${subject}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-full hover:from-gray-800 hover:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium capitalize">Back to {subject}</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>KPK Board - Class {classNumber} - New Syllabus</p>
        </div>
      </div>
    </div>
  );
}