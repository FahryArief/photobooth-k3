"use client";

import React, { useState, useRef } from 'react';
import Webcam from "react-webcam";
import { Camera, Download, RotateCcw } from 'lucide-react';
import Image from 'next/image';

const Photobooth = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Fungsi untuk mengunggah gambar ke API Route
  async function uploadImage(imageSrc: string) {
    try {
      // Ubah data base64 menjadi blob
      const res = await fetch(imageSrc);
      const blob = await res.blob();

      // Kirim blob ke API Route kita
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: blob,
      });
      
      const newBlob = await response.json();
      console.log('Gambar berhasil diunggah:', newBlob.url);
      // Anda bisa menambahkan notifikasi sukses di sini jika perlu
      
    } catch (error) {
      console.error('Gagal mengunggah gambar:', error);
      // Anda bisa menambahkan notifikasi error di sini jika perlu
    }
  }

  // Fungsi untuk memulai urutan pengambilan 4 foto
  const startCaptureSequence = () => {
    setImages([]); // Reset galeri
    setIsCapturing(true); // Mulai sesi pengambilan
    let captureCount = 0;

    const captureNext = () => {
      if (captureCount >= 4) {
        setIsCapturing(false); // Sesi selesai
        return;
      }

      let count = 3;
      setCountdown(count);
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count > 0 ? count : null);
        if (count === 0) {
          clearInterval(timer);
          
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 100);

          const imageSrc = webcamRef.current?.getScreenshot();
          
          // === PERUBAHAN DI SINI ===
          if (imageSrc) {
            // 1. Tambahkan gambar ke state lokal untuk ditampilkan di UI
            setImages(prevImages => [...prevImages, imageSrc]);
            // 2. Panggil fungsi upload untuk mengirim gambar ke server
            uploadImage(imageSrc);
          }
          // ==========================

          captureCount++;
          setTimeout(captureNext, 2000);
        }
      }, 1000);
    };

    captureNext(); // Memulai loop pengambilan gambar
  };

  // Fungsi untuk mereset sesi
  const resetSession = () => {
    setImages([]);
    setIsCapturing(false);
    setCountdown(null);
  };
  
  // Fungsi untuk men-download hasil collage
  const downloadCollage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || images.length < 4) return;

    const photoWidth = 640;
    const photoHeight = 480;
    canvas.width = photoWidth * 2;
    canvas.height = photoHeight * 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = [
      { x: 0, y: 0 },
      { x: photoWidth, y: 0 },
      { x: 0, y: photoHeight },
      { x: photoWidth, y: photoHeight },
    ];
    
    images.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, positions[index].x, positions[index].y, photoWidth, photoHeight);
        
        if(index === images.length - 1) {
            const link = document.createElement('a');
            link.download = 'photobooth-collage.jpeg';
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        }
      };
      img.src = src;
    });
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Tambahkan peringatan privasi yang jelas */}
      <div className="p-3 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
        <span className="font-medium">Perhatian!</span> Dengan mengambil foto, Anda setuju bahwa gambar Anda akan disimpan. Mohon baca <a href="/privacy" className="font-bold underline">Kebijakan Privasi</a> kami.
      </div>

      <h1 className="text-3xl md:text-4xl font-bold my-2 text-center text-gray-800 dark:text-gray-200">
        Photobooth Kelompok 3
      </h1>

      <div className="relative w-full max-w-lg md:max-w-2xl border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900">
        {isFlashing && <div className="absolute inset-0 bg-white z-20"></div>}
        
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h2 className="text-9xl font-bold text-white animate-ping drop-shadow-lg">{countdown}</h2>
          </div>
        )}
        
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={true}
          className="w-full h-auto"
          screenshotFormat="image/jpeg"
          width={1280}
          height={720}
        />
      </div>

      <div className="mt-5 space-x-4">
        {images.length < 4 ? (
          <button 
            onClick={startCaptureSequence} 
            disabled={isCapturing}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Camera className="mr-2 h-5 w-5"/>
            {isCapturing ? 'Mengambil Foto...' : 'Mulai Sesi (4x)'}
          </button>
        ) : (
          <>
            <button onClick={resetSession} className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105">
                <RotateCcw className="mr-2 h-5 w-5" />
                Ulangi Sesi
            </button>
            <button onClick={downloadCollage} className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105">
                <Download className="mr-2 h-5 w-5" />
                Download Collage
            </button>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">Hasil Galeri</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
            {images.map((src, index) => (
              <div key={index} className="relative w-full aspect-video">
                <Image 
                  src={src} 
                  alt={`Hasil foto ke-${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg border-2 border-gray-400 shadow-md" 
                />
              </div>
            ))}
            {Array(4 - images.length).fill(0).map((_, index) => (
                <div key={index} className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Camera className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default Photobooth;
