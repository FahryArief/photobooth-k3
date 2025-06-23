import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { Camera } from "lucide-react"; // Import ikon untuk Navbar
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Photobooth Kelompok 3",
  description: "Aplikasi photobooth UAP dibuat dengan Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 flex flex-col min-h-screen`}>
        
        {/* Navbar Aplikasi */}
        <header className="w-full bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
          <nav className="container mx-auto flex justify-between items-center p-4">
            {/* Logo atau Judul Situs */}
            <Link href="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Photobooth K3
              </span>
            </Link>

            {/* Link Navigasi */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
            </div>
          </nav>
        </header>

        {/* Wrapper utama untuk konten */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer Aplikasi */}
        <footer className="w-full bg-white dark:bg-gray-800 shadow-inner mt-10 py-4">
          <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
            <div className="flex justify-center space-x-6 mb-2">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Kelompok 3 - UAP Pemrograman Web.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
