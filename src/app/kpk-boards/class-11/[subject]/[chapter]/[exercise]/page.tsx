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

export default function ExercisePage({ 
  params 
}: { 
  params: Promise<{ subject: string; chapter: string; exercise: string }>
}) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<{ subject: string; chapter: string; exercise: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      setUrlParams(resolvedParams);
      
      const { subject, chapter, exercise } = resolvedParams;
      
      // Transform subject to match database format
      const dbSubject = `${subject}-kpk-11`;
      
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("notes")
        .select("*")
        .eq("subject", dbSubject.trim())
        .eq("chapter", chapter.trim())
        .eq("exercise", exercise.trim())
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("No notes found");
        setLoading(false);
        return;
      }

      setNote(data);
      setLoading(false);
    }

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
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
                  {error || "No notes found"}
                </h2>
                {urlParams && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Searching for:
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                        {urlParams.subject}-kpk-11
                      </span>
                      <span>→</span>
                      <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                        {urlParams.chapter}
                      </span>
                      <span>→</span>
                      <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full">
                        {urlParams.exercise}
                      </span>
                    </div>
                  </div>
                )}
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Please check the URL or contact support if this problem persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb Navigation */}
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
                {note.subject}
              </span>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {note.chapter}
              </span>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-blue-600 dark:text-blue-400 font-medium">
              {note.exercise}
            </li>
          </ol>
        </nav>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {note.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="capitalize">{note.subject}</span>
            </span>
            <span>•</span>
            <span>{note.chapter}</span>
            <span>•</span>
            <span>Exercise {note.exercise}</span>
          </div>
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8 md:p-12 lg:p-16">
            <MarkdownRenderer content={note.content} />
          </div>
        </div>

        {/* PDF Section */}
        {note.pdf_url && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">PDF Document</h2>
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

            {/* Container with overlay */}
            <div className="relative w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <iframe
                src={note.pdf_url}
                className="w-full h-[600px] md:h-[800px]"
                title="PDF Viewer"
              />
              
              {/* Overlay to block the "open in new tab" button */}
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
          <p>KPK Board - Class 11 - New Syllabus</p>
        </div>
      </div>
    </div>
  );
}