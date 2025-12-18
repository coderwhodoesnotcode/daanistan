import Image from "next/image";
import { BookOpen, FileText, Award, Briefcase, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-black dark:to-gray-900 font-sans">
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center text-center py-24 px-4 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10">
          {/* Logo with glow effect */}
          <div className="inline-flex items-center justify-center mb-6 p-4 bg-yellow-400 rounded-2xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105">
            <span className="text-5xl font-black text-gray-900">D</span>
          </div>
          
          <h1 className="mt-6 text-6xl font-black text-gray-900 dark:text-white sm:text-7xl tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Daanistan</span>
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Your <span className="font-semibold text-yellow-600">ultimate learning companion</span> for accessing quality educational resources. Download notes and past papers from all major boards.
          </p>

          {/* Board Buttons with enhanced design */}
          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:gap-6">
            <a
              href="/kpk-boards"
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">KPK Board</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/fbise"
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">FBISE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/punjab-board"
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Punjab Board</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </header>

      {/* Features Section with yellow theme */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Why Choose Daanistan?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-yellow-400">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl group-hover:bg-yellow-400 transition-colors duration-300">
                  <BookOpen className="w-10 h-10 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">Easy to Use</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Browse and download notes with a clean, intuitive interface designed for students.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-yellow-400">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl group-hover:bg-yellow-400 transition-colors duration-300">
                  <FileText className="w-10 h-10 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">Updated Content</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Latest notes and past papers for all major boards, regularly updated for accuracy.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-yellow-400">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl group-hover:bg-yellow-400 transition-colors duration-300">
                  <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">Free Access</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                All educational resources are completely free with no hidden charges or subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Start Your Learning Journey Today</h2>
          <p className="text-xl text-gray-800 mb-8">Join thousands of students who trust Daanistan for their exam preparation</p>
          <a href="#boards" className="inline-block px-12 py-5 bg-gray-900 text-yellow-400 font-bold text-lg rounded-2xl shadow-2xl hover:bg-gray-800 transition-all duration-300 hover:scale-105">
            Explore Now
          </a>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4 p-3 bg-yellow-400 rounded-xl">
              <Briefcase className="w-8 h-8 text-gray-900" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Latest Job Opportunities</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Explore career opportunities at renowned educational institutes</p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/jobs/university"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">University Jobs</h3>
                <Briefcase className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">Faculty & staff positions</p>
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                View Openings →
              </div>
            </a>

            <a
              href="/jobs/school"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">School Jobs</h3>
                <Briefcase className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">Teaching opportunities</p>
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                View Openings →
              </div>
            </a>

            <a
              href="/jobs/government"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Govt. Jobs</h3>
                <Briefcase className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">Public sector positions</p>
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                View Openings →
              </div>
            </a>

            <a
              href="/jobs/private"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Private Sector</h3>
                <Briefcase className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">Corporate opportunities</p>
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                View Openings →
              </div>
            </a>
          </div>

          {/* Featured Institutes */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Featured Institute Postings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/jobs/nust"
                className="group bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-yellow-200 dark:border-yellow-600"
              >
                <div className="text-center">
                  <div className="inline-block p-4 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                    <Briefcase className="w-8 h-8 text-gray-900" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">NUST Jobs</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">National University of Sciences & Technology</p>
                </div>
              </a>

              <a
                href="/jobs/lums"
                className="group bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-yellow-200 dark:border-yellow-600"
              >
                <div className="text-center">
                  <div className="inline-block p-4 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                    <Briefcase className="w-8 h-8 text-gray-900" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">LUMS Jobs</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Lahore University of Management Sciences</p>
                </div>
              </a>

              <a
                href="/jobs/fast"
                className="group bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-yellow-200 dark:border-yellow-600"
              >
                <div className="text-center">
                  <div className="inline-block p-4 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                    <Briefcase className="w-8 h-8 text-gray-900" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">FAST Jobs</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">National University of Computer Sciences</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 px-4 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Connect With Us</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">Stay updated with the latest educational content and opportunities</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://facebook.com/daanistan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <Facebook className="w-6 h-6" />
              <span>Facebook</span>
            </a>

            <a
              href="https://instagram.com/daanistan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              <Instagram className="w-6 h-6" />
              <span>Instagram</span>
            </a>

            <a
              href="https://youtube.com/daanistan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
            >
              <Youtube className="w-6 h-6" />
              <span>YouTube</span>
            </a>

            <a
              href="https://twitter.com/daanistan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105"
            >
              <Twitter className="w-6 h-6" />
              <span>Twitter</span>
            </a>

            <a
              href="https://linkedin.com/company/daanistan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-700/50 transition-all duration-300 hover:scale-105"
            >
              <Linkedin className="w-6 h-6" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}