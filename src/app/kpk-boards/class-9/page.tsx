import Link from "next/link";

export default function Class9Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        KPK Board - Class 9 Notes
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Here you can upload and download notes for Class 9.
      </p>
      <Link
        href="/kpk-boards"
        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Back to Board
      </Link>
    </div>
  );
}
