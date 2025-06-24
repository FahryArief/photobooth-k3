/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opsi untuk mengabaikan error ESLint saat build
  eslint: {
    // Peringatan: Ini akan membuat build berhasil meskipun ada error linting.
    // Gunakan dengan hati-hati.
    ignoreDuringBuilds: true,
  },

  // Opsi untuk mengabaikan error TypeScript saat build
  typescript: {
    // Peringatan: Ini akan memaksa build untuk mengabaikan error tipe data.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;