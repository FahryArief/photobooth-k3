import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  // Baris `searchParams` yang tidak terpakai telah dihapus.
  
  // Buat nama file unik, misalnya dengan timestamp
  const filename = `photobooth-${Date.now()}.jpeg`;

  // Dapatkan data gambar dari body request
  const blob = await request.blob();
  
  try {
    // Unggah file ke Vercel Blob
    const blobResult = await put(filename, blob, {
      access: 'public',
    });

    // Kembalikan URL gambar yang sudah diunggah jika sukses
    return NextResponse.json(blobResult);

  } catch (error) {
    // Tangani kemungkinan error saat upload
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json({ message: "Gagal mengunggah file." }, { status: 500 });
  }
}
