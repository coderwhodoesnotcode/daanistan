import Link from "next/link";

export default function Class10Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        KPK Board - Class 10 Notes
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Download notes and past papers for Class 10 here.
      </p>
      <Link
        href="/kpk-boards"
        className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
      >
        Back to Board
      </Link>
    </div>
  );
}
