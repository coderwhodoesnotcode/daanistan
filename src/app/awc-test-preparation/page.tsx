// app/awc-test-preparation/page.tsx
import Link from 'next/link';
import { BookOpen, Cpu, Atom, FlaskConical, Clock, Award, Target } from 'lucide-react';

export const metadata = {
  title: 'AWC Test Preparation - Free Practice MCQs | Daanistan',
  description: 'Prepare for AWC Assistant Manager tests with free practice MCQs. Software, Physics, and Chemistry test preparation with easy, medium, and hard difficulty levels.',
  keywords: 'AWC test preparation, Assistant Manager test, AWC MCQs, Software test, Physics test, Chemistry test',
};

export default function AWCTestPreparation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              AWC Test Preparation
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Master your AWC Assistant Manager exam with our comprehensive practice tests. 
              <span className="font-semibold text-blue-600"> 60 MCQs, 1 Hour, Real Exam Experience.</span>
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-blue-500">
              <Clock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Timed Tests</h3>
              <p className="text-gray-600 dark:text-gray-300">60 MCQs in 60 minutes - just like the real exam</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-purple-500">
              <Target className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Difficulty Levels</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose from Easy, Medium, or Hard difficulty</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-green-500">
              <Award className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Instant Results</h3>
              <p className="text-gray-600 dark:text-gray-300">Get detailed results with negative marking system</p>
            </div>
          </div>

          {/* Scoring System Info */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl shadow-2xl mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Scoring System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <span className="text-3xl font-black">+4</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Correct Answer</p>
                  <p className="text-blue-100">Each correct answer gives 4 marks</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <span className="text-3xl font-black">-1</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Wrong Answer</p>
                  <p className="text-blue-100">Each wrong answer deducts 1 mark</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Categories */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white text-center mb-12">
              Choose Your Test Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Software Test */}
              <Link
                href="/awc-test-preparation/assistant-manager-software"
                className="group relative bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-200 dark:border-blue-600 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-block p-4 bg-blue-500 rounded-xl mb-6 group-hover:bg-blue-600 transition-colors">
                    <Cpu className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Assistant Manager Software
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Practice MCQs covering programming, databases, networking, and software engineering concepts.
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Start Practice Test →
                  </div>
                </div>
              </Link>

              {/* Physics Test */}
              <Link
                href="/awc-test-preparation/am-physics"
                className="group relative bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-purple-200 dark:border-purple-600 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-block p-4 bg-purple-500 rounded-xl mb-6 group-hover:bg-purple-600 transition-colors">
                    <Atom className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    AM Physics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Test your knowledge in mechanics, thermodynamics, electromagnetism, and modern physics.
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Start Practice Test →
                  </div>
                </div>
              </Link>

              {/* Chemistry Test */}
              <Link
                href="/awc-test-preparation/am-chemistry"
                className="group relative bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-200 dark:border-green-600 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-block p-4 bg-green-500 rounded-xl mb-6 group-hover:bg-green-600 transition-colors">
                    <FlaskConical className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    AM Chemistry
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Practice questions on organic, inorganic, physical chemistry, and chemical reactions.
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Start Practice Test →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Start Your Preparation?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose your category and difficulty level to begin practicing now!
          </p>
        </div>
      </section>
    </div>
  );
}