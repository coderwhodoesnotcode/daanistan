"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, ArrowLeft, FileText } from "lucide-react";

export default function SubjectPage() {
  const params = useParams();
  const classNum = params.class as string;
  const subject = params.subject as string;
  
  if (!classNum || !subject) {
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
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);

  // ============================================================
  // CHAPTER COUNT CONFIGURATION
  // Define how many chapters each subject has per class
  // ============================================================
  
  // Mathematics chapter counts
  const mathsChapterCounts: { [key: string]: number } = {
    "9": 15,
    "10": 14,
    "11": 12,
    "12": 12
  };

  // Physics chapter counts
  const physicsChapterCounts: { [key: string]: number } = {
    "9": 8,
    "10": 10,
    "11": 10,  // Changed from 12 to 10
    "12": 10
  };

  // Chemistry chapter counts
  const chemistryChapterCounts: { [key: string]: number } = {
    "9": 8,
    "10": 9,
    "11": 10,
    "12": 9
  };

  // Biology chapter counts
  const biologyChapterCounts: { [key: string]: number } = {
    "9": 9,
    "10": 8,
    "11": 11,
    "12": 10
  };

  // Get chapter count based on subject and class
  let chapterCount = 12; // default
  
  if (subject === "maths") {
    chapterCount = mathsChapterCounts[classNumber] || 12;
  } else if (subject === "physics") {
    chapterCount = physicsChapterCounts[classNumber] || 10;
  } else if (subject === "chemistry") {
    chapterCount = chemistryChapterCounts[classNumber] || 10;
  } else if (subject === "biology") {
    chapterCount = biologyChapterCounts[classNumber] || 10;
  }

  // Generate chapters array based on the count
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  const subjectColors: { [key: string]: any } = {
    maths: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-500", hover: "hover:bg-blue-600", shadow: "hover:shadow-blue-500/50", text: "text-blue-600" },
    physics: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-500", hover: "hover:bg-purple-600", shadow: "hover:shadow-purple-500/50", text: "text-purple-600" },
    chemistry: { gradient: "from-green-500 to-green-600", bg: "bg-green-500", hover: "hover:bg-green-600", shadow: "hover:shadow-green-500/50", text: "text-green-600" },
    biology: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500", hover: "hover:bg-emerald-600", shadow: "hover:shadow-emerald-500/50", text: "text-emerald-600" }
  };

  const colors = subjectColors[subject] || subjectColors.maths;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="px-8 pt-8">
        <Link
          href={`/kpk-boards/${classNum}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Class {classNumber}
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center px-8 py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center mb-6 p-4 bg-gradient-to-r ${colors.gradient} rounded-2xl shadow-2xl ${colors.shadow} transition-all duration-300`}>
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4">
              {subjectName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Chapters</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Class {classNumber} - Select a chapter to access comprehensive notes and study materials.
            </p>
            <div className={`w-24 h-1 bg-gradient-to-r ${colors.gradient} mx-auto rounded-full mt-6`}></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {chapters.map((chapter) => (
              <Link
                key={chapter}
                href={`/kpk-boards/${classNum}/${subject}/chapter-${chapter}`}
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

          <div className="mt-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Download All Chapters</h2>
                <p className="text-gray-800">Get the complete {subjectName} notes in one PDF file</p>
              </div>
              <Link
                href={`/kpk-boards/${classNum}/${subject}/download-all`}
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