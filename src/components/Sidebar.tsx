// "use client";

// import React, { useState } from 'react';
// import { BookOpen, Briefcase, Menu, X, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

// export default function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const notesData = [
//     { id: 'class-12', label: 'Class 12 Notes', href: '/notes/class-12' },
//     { id: 'class-11', label: 'Class 11 Notes', href: '/notes/class-11' },
//     { id: 'class-10', label: 'Class 10 Notes', href: '/notes/class-10' },
//     { id: 'class-9', label: 'Class 9 Notes', href: '/notes/class-9' },
//   ];

//   const jobPrepData = [
//     { id: 'awc', label: 'AWC', href: '/jobs/awc' },
//     { id: 'govt', label: 'Government Jobs', href: '/jobs/government' },
//     { id: 'ppsc', label: 'PPSC', href: '/jobs/ppsc' },
//     { id: 'fpsc', label: 'FPSC', href: '/jobs/fpsc' },
//   ];

//   const socialLinks = [
//     { id: 'facebook', icon: Facebook, href: 'https://facebook.com/daanistan', color: 'hover:bg-blue-600' },
//     { id: 'twitter', icon: Twitter, href: 'https://twitter.com/daanistan', color: 'hover:bg-sky-500' },
//     { id: 'instagram', icon: Instagram, href: 'https://instagram.com/daanistan', color: 'hover:bg-pink-600' },
//     { id: 'linkedin', icon: Linkedin, href: 'https://linkedin.com/company/daanistan', color: 'hover:bg-blue-700' },
//     { id: 'youtube', icon: Youtube, href: 'https://youtube.com/daanistan', color: 'hover:bg-red-600' },
//   ];

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-yellow-400 text-gray-900 rounded-xl shadow-xl hover:bg-yellow-500 transition-all duration-300 hover:scale-105"
//         aria-label="Toggle Sidebar"
//       >
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r-4 border-yellow-400 w-72 overflow-y-auto z-40 transition-transform duration-300 shadow-2xl ${
//           isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         }`}
//       >
//         <div className="p-6">

// {/*  */}
//           {/* Notes Section */}
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-yellow-400">
//               <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
//                 <BookOpen className="text-yellow-600 dark:text-yellow-400" size={20} />
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Class Notes</h3>
//             </div>
//             <nav className="space-y-2">
//               {notesData.map((item) => (
//                 <a
//                   key={item.id}
//                   href={item.href}
//                   className="block px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-yellow-400 dark:hover:bg-yellow-500 hover:text-gray-900 text-gray-700 dark:text-gray-200 transition-all duration-300 text-sm font-semibold hover:translate-x-1 hover:shadow-lg border-l-4 border-transparent hover:border-yellow-600"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.label}
//                 </a>
//               ))}
//             </nav>
//           </div>

//           {/* Job Preparation Section */}
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-yellow-400">
//               <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
//                 <Briefcase className="text-yellow-600 dark:text-yellow-400" size={20} />
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Job Preparation</h3>
//             </div>
//             <nav className="space-y-2">
//               {jobPrepData.map((item) => (
//                 <a
//                   key={item.id}
//                   href={item.href}
//                   className="block px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-yellow-400 dark:hover:bg-yellow-500 hover:text-gray-900 text-gray-700 dark:text-gray-200 transition-all duration-300 text-sm font-semibold hover:translate-x-1 hover:shadow-lg border-l-4 border-transparent hover:border-yellow-600"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.label}
//                 </a>
//               ))}
//             </nav>
//           </div>

//           {/* Social Links */}
//           <div className="border-t-2 border-yellow-400 pt-6">
//             <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Connect With Us</h3>
//             <div className="grid grid-cols-3 gap-2">
//               {socialLinks.map((social) => {
//                 const Icon = social.icon;
//                 return (
//                   <a
//                     key={social.id}
//                     href={social.href}
//                     className={`flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-300 ${social.color} hover:text-white hover:scale-110 hover:shadow-lg text-gray-700 dark:text-gray-300`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={social.id}
//                   >
//                     <Icon size={18} />
//                   </a>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }