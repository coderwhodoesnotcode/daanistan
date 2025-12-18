"use client";  
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, ArrowLeft, FileText } from "lucide-react";

export default function SubjectPage() {
  const params = useParams();
  const subject = params.subject as string;
  
  // Add safety check
  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Subject
          </h1>
          <Link href="/kpk-boards/class-11" className="text-blue-600 hover:underline">
            Go back to Class 11
          </Link>
        </div>
      </div>
    );
  }
  
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
  const chapters = Array.from({ length: 12 }, (_, i) => i + 1);

  // Subject-specific colors
  const subjectColors: { [key: string]: any } = {
    maths: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-500", hover: "hover:bg-blue-600", shadow: "hover:shadow-blue-500/50", text: "text-blue-600" },
    physics: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-500", hover: "hover:bg-purple-600", shadow: "hover:shadow-purple-500/50", text: "text-purple-600" },
    chemistry: { gradient: "from-green-500 to-green-600", bg: "bg-green-500", hover: "hover:bg-green-600", shadow: "hover:shadow-green-500/50", text: "text-green-600" },
    biology: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500", hover: "hover:bg-emerald-600", shadow: "hover:shadow-emerald-500/50", text: "text-emerald-600" }
  };

  const colors = subjectColors[subject] || subjectColors.maths;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Back Button */}
      <div className="px-8 pt-8">
        <Link
          href="/kpk-boards/class-11"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Class 11
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-8 py-16">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center mb-6 p-4 bg-gradient-to-r ${colors.gradient} rounded-2xl shadow-2xl ${colors.shadow} transition-all duration-300`}>
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4">
              {subjectName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Chapters</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Class 11 - Select a chapter to access comprehensive notes and study materials.
            </p>
            <div className={`w-24 h-1 bg-gradient-to-r ${colors.gradient} mx-auto rounded-full mt-6`}></div>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {chapters.map((chapter) => (
              <Link
                key={chapter}
                href={`/kpk-boards/class-11/${subject}/chapter-${chapter}`}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl ${colors.shadow} transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient}`}></div>
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className={`mb-3 text-4xl font-black ${colors.text} dark:text-white`}>
                      {chapter}
                    </div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Chapter {chapter}
                    </h3>
                    <div className={`flex items-center gap-1 ${colors.text} dark:${colors.text} text-xs font-semibold group-hover:gap-2 transition-all`}>
                      <FileText className="w-3 h-3" />
                      <span>View Notes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-gradient-to-r ${colors.gradient}`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">📖</span>
                Detailed Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete chapter-wise notes with examples and explanations.
              </p>
            </div>

            <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-gradient-to-r ${colors.gradient}`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                Practice Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Exercise solutions and practice problems for better understanding.
              </p>
            </div>

            <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-gradient-to-r ${colors.gradient}`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Key Points
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Important formulas, concepts, and exam-focused content.
              </p>
            </div>
          </div>

          {/* Quick Access Banner */}
          <div className="mt-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Download All Chapters</h2>
                <p className="text-gray-800">Get the complete {subjectName} notes in one PDF file</p>
              </div>
              <Link
                href={`/kpk-boards/class-11/${subject}/download-all`}
                className="inline-block px-8 py-4 bg-gray-900 text-yellow-400 font-bold text-lg rounded-2xl shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Download All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}