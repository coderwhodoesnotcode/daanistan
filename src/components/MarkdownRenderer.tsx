'use client'

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import 'katex/dist/katex.min.css';

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none
      /* Headings */
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:leading-tight
      prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-blue-600 dark:prose-h2:text-blue-400 prose-h2:leading-tight
      prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-snug
      prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
      
      /* Paragraphs */
      prose-p:text-gray-700 dark:prose-p:text-gray-300 
      prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
      
      /* Strong/Bold */
      prose-strong:text-gray-900 dark:prose-strong:text-white 
      prose-strong:font-semibold
      
      /* Lists */
      prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
      prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
      prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
      
      /* Code */
      prose-code:text-blue-600 dark:prose-code:text-blue-400 
      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 
      prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
      prose-code:before:content-none prose-code:after:content-none
      
      /* Pre/Code blocks */
      prose-pre:bg-gray-900 prose-pre:text-gray-100 
      prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-pre:my-8 prose-pre:shadow-lg
      
      /* Blockquotes */
      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
      prose-blockquote:pl-6 prose-blockquote:italic 
      prose-blockquote:my-8 prose-blockquote:py-2
      prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20
      
      /* Horizontal rules */
      prose-hr:my-12 prose-hr:border-gray-300 dark:prose-hr:border-gray-700
      prose-hr:border-t-2
      
      /* Links */
      prose-a:text-blue-600 dark:prose-a:text-blue-400 
      prose-a:no-underline hover:prose-a:underline
      prose-a:transition-all
      
      /* Images */
      prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
      
      /* Tables */
      prose-table:my-8 prose-table:border-collapse
      prose-thead:bg-gray-100 dark:prose-thead:bg-gray-800
      prose-th:p-3 prose-th:text-left prose-th:font-semibold
      prose-td:p-3 prose-td:border-t prose-td:border-gray-200 
      dark:prose-td:border-gray-700
    ">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-6">{children}</p>,
          li: ({ children }) => <li className="mb-2">{children}</li>,
          h2: ({ children }) => <h2 className="mt-12 mb-6">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-8 mb-4">{children}</h3>,
          h4: ({ children }) => <h4 className="mt-6 mb-3">{children}</h4>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}