"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function ClassSubjectsPage() {
  const params = useParams();
  const classNum = params.class as string; // "class-9", "class-10", etc.
  
  // Extract just the number
  const classNumber = classNum.replace("class-", "");
  
  // Determine class level description
  const getClassLevel = () => {
    if (classNumber === "9") return "SSC Part I";
    if (classNumber === "10") return "SSC Part II";
    if (classNumber === "11") return "HSSC Part I";
    if (classNumber === "12") return "HSSC Part II";
    return "";
  };

  const subjects = [
    { name: "Mathematics", slug: "maths", icon: "📐", color: "blue", gradient: "from-blue-500 to-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-600 dark:text-blue-400" },
    { name: "Physics", slug: "physics", icon: "⚛️", color: "purple", gradient: "from-purple-500 to-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30", textColor: "text-purple-600 dark:text-purple-400" },
    { name: "Chemistry", slug: "chemistry", icon: "🧪", color: "green", gradient: "from-green-500 to-green-600", bgColor: "bg-green-100 dark:bg-green-900/30", textColor: "text-green-600 dark:text-green-400" },
    { name: "Biology", slug: "biology", icon: "🌿", color: "emerald", gradient: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/30", textColor: "text-emerald-600 dark:text-emerald-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Back Button */}
      <div className="px-8 pt-8">
        <Link
          href="/kpk-boards"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to KPK Boards
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-8 py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6 p-4 bg-yellow-400 rounded-2xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300">
              <BookOpen className="w-12 h-12 text-gray-900" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Class {classNumber} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Subjects</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {getClassLevel()} - Select a subject to access notes, solved exercises, and past papers.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mt-6"></div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/kpk-boards/${classNum}/${subject.slug}`}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${subject.gradient}`}></div>
                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 ${subject.bgColor} rounded-2xl group-hover:bg-gradient-to-r ${subject.gradient} transition-all duration-300 text-5xl`}>
                      <span className="group-hover:scale-110 inline-block transition-transform">{subject.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-4">
                    {subject.name}
                  </h3>
                  <div className={`flex items-center justify-center gap-2 ${subject.textColor} font-semibold group-hover:gap-4 transition-all`}>
                    <span>View Notes</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Study Resources Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">📚 Chapter Notes</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Comprehensive chapter-wise notes covering all topics in detail.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">📝 Solved Exercises</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Step-by-step solutions to all textbook exercises and problems.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">📄 Past Papers</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Previous years' question papers with detailed solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}