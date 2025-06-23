import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  // Buat nama file unik, misalnya dengan timestamp
  const filename = `photobooth-${Date.now()}.jpeg`;

  // Dapatkan data gambar dari body request
  const blob = await request.blob();
  
  // Unggah file ke Vercel Blob
  const blobResult = await put(filename, blob, {
    access: 'public',
  });

  // Kembalikan URL gambar yang sudah diunggah
  return NextResponse.json(blobResult);
}