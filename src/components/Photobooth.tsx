"use client";

import React, { useState, useRef } from 'react';
import Webcam from "react-webcam";
import { Camera, Download, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';

// === BAGIAN BARU: DEFINISI TEMPLATE KOLASE ===
const collageTemplates = [
  { id: 'grid_2x2', name: 'Grid 2x2', canvasWidth: 1280, canvasHeight: 960, 
    layout: [
      { x: 0, y: 0, width: 640, height: 480 },
      { x: 640, y: 0, width: 640, height: 480 },
      { x: 0, y: 480, width: 640, height: 480 },
      { x: 640, y: 480, width: 640, height: 480 },
    ]
  },
  { id: 'film_strip', name: 'Film Strip', canvasWidth: 640, canvasHeight: 1920,
    layout: [
      { x: 0, y: 0, width: 640, height: 480 },
      { x: 0, y: 480, width: 640, height: 480 },
      { x: 0, y: 960, width: 640, height: 480 },
      { x: 0, y: 1440, width: 640, height: 480 },
    ]
  },
   { id: 'feature', name: 'Feature', canvasWidth: 1280, canvasHeight: 960,
    layout: [
      { x: 0, y: 0, width: 960, height: 960 }, // Gambar utama besar
      { x: 960, y: 0, width: 320, height: 320 },
      { x: 960, y: 320, width: 320, height: 320 },
      { x: 960, y: 640, width: 320, height: 320 },
    ]
  }
];
// ==========================================

const Photobooth = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  
  // === STATE BARU UNTUK FITUR TAMBAHAN ===
  const [activeFilter, setActiveFilter] = useState('filter-none');
  const [activeTemplateId, setActiveTemplateId] = useState('grid_2x2');
  // ======================================

  async function uploadImage(imageSrc: string) {
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: blob,
      });
      const newBlob = await response.json();
      console.log('Gambar berhasil diunggah:', newBlob.url);
    } catch (error) {
      console.error('Gagal mengunggah gambar:', error);
    }
  }

  const startCaptureSequence = () => {
    setImages([]);
    setIsCapturing(true);
    let captureCount = 0;
    const captureNext = () => {
      if (captureCount >= 4) {
        setIsCapturing(false);
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
          if (imageSrc) {
            setImages(prevImages => [...prevImages, imageSrc]);
            uploadImage(imageSrc);
          }
          captureCount++;
          setTimeout(captureNext, 2000);
        }
      }, 1000);
    };
    captureNext();
  };

  const resetSession = () => {
    setImages([]);
    setIsCapturing(false);
    setCountdown(null);
  };
  
  // === FUNGSI DOWNLOAD DIMODIFIKASI ===
  const downloadCollage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const selectedTemplate = collageTemplates.find(t => t.id === activeTemplateId);

    if (!canvas || !ctx || images.length < 4 || !selectedTemplate) return;

    // Gunakan ukuran dari template
    canvas.width = selectedTemplate.canvasWidth;
    canvas.height = selectedTemplate.canvasHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    images.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        // Gunakan layout dari template
        const { x, y, width, height } = selectedTemplate.layout[index];
        ctx.drawImage(img, x, y, width, height);
        
        if(index === images.length - 1) {
            const link = document.createElement('a');
            link.download = `photobooth-collage-${activeTemplateId}.jpeg`;
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        }
      };
      img.src = src;
    });
  };
  // ======================================

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-3 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
        <span className="font-medium">Perhatian!</span> TAHAP PENGEMBANGAN, GABUT AJA NGETEST GEMINI AI
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
        
        {/* Menerapkan class filter ke Webcam */}
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={true}
          className={`w-full h-auto transition-all duration-300 ${activeFilter}`}
          screenshotFormat="image/jpeg"
          width={1280}
          height={720}
        />
      </div>

      {/* === UI KONTROL BARU UNTUK FILTER DAN TEMPLATE === */}
      <div className='my-5 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-lg md:max-w-2xl'>
        <div className="mb-4">
            <h3 className='font-bold text-lg mb-2 text-gray-700 dark:text-gray-200'>Pilih Filter:</h3>
            <div className='flex flex-wrap gap-2'>
                <button onClick={() => setActiveFilter('filter-none')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-none' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Normal</button>
                <button onClick={() => setActiveFilter('filter-grayscale')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-grayscale' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Grayscale</button>
                <button onClick={() => setActiveFilter('filter-sepia')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-sepia' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Sepia</button>
                <button onClick={() => setActiveFilter('filter-invert')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-invert' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Invert</button>
            </div>
        </div>
        <div>
            <h3 className='font-bold text-lg mb-2 text-gray-700 dark:text-gray-200'>Pilih Template Kolase:</h3>
            <div className='flex flex-wrap gap-2'>
                {collageTemplates.map(template => (
                    <button key={template.id} onClick={() => setActiveTemplateId(template.id)} className={`px-3 py-1 text-sm rounded-full ${activeTemplateId === template.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{template.name}</button>
                ))}
            </div>
        </div>
      </div>
      {/* ================================================= */}

      <div className="space-x-4">
        {images.length < 4 ? (
          <button onClick={startCaptureSequence} disabled={isCapturing} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <Camera className="mr-2 h-5 w-5"/>
            {isCapturing ? 'Mengambil Foto...' : 'Mulai Sesi (4x)'}
          </button>
        ) : (
          <>
            <button onClick={resetSession} className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105">
                <RotateCcw className="mr-2 h-5 w-5" /> Ulangi Sesi
            </button>
            <button onClick={downloadCollage} className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105">
                <Download className="mr-2 h-5 w-5" /> Download Collage
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
                {/* Menerapkan class filter ke Gambar hasil */}
                <Image src={src} alt={`Hasil foto ke-${index + 1}`} layout="fill" objectFit="cover" className={`rounded-lg border-2 border-gray-400 shadow-md transition-all duration-300 ${activeFilter}`} />
              </div>
            ))}
            {Array(4 - images.length).fill(0).map((_, index) => (
                <div key={index} className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center"><Camera className="h-10 w-10 text-gray-400 dark:text-gray-500" /></div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default Photobooth;
