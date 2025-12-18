import Link from "next/link";
import { BookOpen, GraduationCap, FileText, ArrowLeft } from "lucide-react";

export default function KPKBoardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Back Button */}
      <div className="px-8 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-8 py-16">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6 p-4 bg-blue-500 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4">
              KPK Board <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Notes</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Access comprehensive notes and study materials for all classes. Select your class below to get started.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mt-6"></div>
          </div>

          {/* Class Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Class 9 */}
            <Link
              href="/kpk-boards/class-9"
              className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl group-hover:bg-blue-500 transition-colors duration-300">
                    <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2">Class 9</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">SSC Part I</p>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all">
                  <span>Explore Notes</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Class 10 */}
            <Link
              href="/kpk-boards/class-10"
              className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl group-hover:bg-green-500 transition-colors duration-300">
                    <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400 group-hover:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2">Class 10</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">SSC Part II</p>
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold group-hover:gap-4 transition-all">
                  <span>Explore Notes</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Class 11 */}
            <Link
              href="/kpk-boards/class-11"
              className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl group-hover:bg-yellow-500 transition-colors duration-300">
                    <BookOpen className="w-10 h-10 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2">Class 11</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">HSSC Part I</p>
                <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold group-hover:gap-4 transition-all">
                  <span>Explore Notes</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Class 12 */}
            <Link
              href="/kpk-boards/class-12"
              className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl group-hover:bg-red-500 transition-colors duration-300">
                    <BookOpen className="w-10 h-10 text-red-600 dark:text-red-400 group-hover:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2">Class 12</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">HSSC Part II</p>
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-semibold group-hover:gap-4 transition-all">
                  <span>Explore Notes</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-3xl p-10 shadow-2xl">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-900 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-900 mb-4">Complete Study Materials</h2>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto">
                Each class includes chapter-wise notes, solved exercises, past papers, and important questions to help you excel in your exams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}