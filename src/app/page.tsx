import Photobooth from '@/components/Photobooth'; // Menggunakan alias '@/' yang sudah kita setujui

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Photobooth />
    </main>
  );
}