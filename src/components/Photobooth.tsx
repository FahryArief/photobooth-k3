"use client";

import React, { useState, useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { Camera, Download, RotateCcw } from 'lucide-react';
import Image from 'next/image';

// --- FUNGSI HELPER BARU UNTUK MENGGAMBAR DENGAN ASPEK RASIO BENAR ---
/**
 * Menggambar gambar ke canvas dengan logika 'object-fit: cover'.
 * Ini akan memotong (crop) gambar alih-alih membuatnya gepeng.
 * @param ctx Canvas rendering context
 * @param img Gambar yang akan digambar
 * @param x Posisi x tujuan di canvas
 * @param y Posisi y tujuan di canvas
 * @param w Lebar tujuan di canvas
 * @param h Tinggi tujuan di canvas
 */
function drawImageWithCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;

    let sx, sy, sWidth, sHeight;

    if (imgRatio > canvasRatio) { // Gambar lebih lebar dari slot
        sHeight = img.height;
        sWidth = sHeight * canvasRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
    } else { // Gambar lebih tinggi dari slot
        sWidth = img.width;
        sHeight = sWidth / canvasRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
    }
    
    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}
// -------------------------------------------------------------------


// Data Frame
const frameOptions = [
  { id: 'comic_strip', name: 'Komik Strip', src: '/frames/frame1.png' },
  { id: 'wood', name: 'Komik Strip 2', src: '/frames/frame2.png' },
  { id: 'party', name: 'Komik Strip 3', src: '/frames/frame3.png' },
  { id: 'none', name: 'Tanpa Bingkai', src: '' }
];

// Data Template Kolase dengan KOORDINAT RELATIF (%)
const collageTemplates = [
  { id: 'comic_strip_layout', name: 'Layout Komik', photoCount: 3,
    layout: [
      { x: '7.5%', y: '5.5%', width: '85%', height: '26%' },
      { x: '7.5%', y: '37%', width: '85%', height: '26%' },
      { x: '7.5%', y: '68.2%', width: '85%', height: '26%' },
    ]
  },
  { id: 'grid_2x2', name: 'Grid 2x2', photoCount: 4, cols: 2, rows: 2,
    layout: [
      { x: '5%', y: '5%', width: '44%', height: '44%' }, { x: '51%', y: '5%', width: '44%', height: '44%' },
      { x: '5%', y: '51%', width: '44%', height: '44%' }, { x: '51%', y: '51%', width: '44%', height: '44%' },
    ]
  },
  { id: 'film_strip_4', name: 'Film Strip (4)', photoCount: 4, cols: 1, rows: 4,
    layout: [
        { x: '10%', y: '5%', width: '80%', height: '21%' }, { x: '10%', y: '28%', width: '80%', height: '21%' },
        { x: '10%', y: '51%', width: '80%', height: '21%' }, { x: '10%', y: '74%', width: '80%', height: '21%' },
    ]
  }
];

const Photobooth = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<{ src: string; filter: string }[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('filter-none');
  const [activeFrameId, setActiveFrameId] = useState(frameOptions[0].id);
  const [activeTemplateId, setActiveTemplateId] = useState(collageTemplates[0].id);
  
  const activeFilterRef = useRef(activeFilter);
  useEffect(() => {
    activeFilterRef.current = activeFilter;
  }, [activeFilter]);

  const activeFrame = frameOptions.find(f => f.id === activeFrameId) || frameOptions[0];
  const activeTemplate = collageTemplates.find(t => t.id === activeTemplateId) || collageTemplates[0];
  const photoCount = activeTemplate.photoCount;

  async function uploadImage(imageSrc: string) {
    // ... (logika upload tetap sama)
  }

  const startCaptureSequence = () => {
    // ... (logika capture tetap sama)
    setImages([]); setIsCapturing(true); let captureCount = 0;
    const captureNext = () => {
      if (captureCount >= photoCount) { setIsCapturing(false); return; }
      let count = 3; setCountdown(count);
      const timer = setInterval(() => {
        count -= 1; setCountdown(count > 0 ? count : null);
        if (count === 0) {
          clearInterval(timer);
          setIsFlashing(true); setTimeout(() => setIsFlashing(false), 100);
          const imageSrc = webcamRef.current?.getScreenshot();
          if (imageSrc) {
            setImages(prevImages => [...prevImages, { src: imageSrc, filter: activeFilterRef.current }]);
            uploadImage(imageSrc);
          }
          captureCount++;
          setTimeout(captureNext, 2000);
        }
      }, 1000);
    };
    captureNext();
  };

  const resetSession = () => { setImages([]); setIsCapturing(false); setCountdown(null); };
  
  const getCssFilterValue = (className: string) => {
    // ... (logika filter tetap sama)
    switch (className) {
      case 'filter-grayscale': return 'grayscale(100%)';
      case 'filter-sepia': return 'sepia(100%)';
      case 'filter-invert': return 'invert(100%)';
      default: return 'none';
    }
  };

  const downloadCollage = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || images.length < photoCount || !activeTemplate) return;

    const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    try {
        const loadedPhotosData = await Promise.all(images.map(async (imgData) => ({
            photo: await loadImage(imgData.src),
            filter: imgData.filter
        })));

        const triggerDownload = () => {
            const link = document.createElement('a');
            link.download = `photobooth-${activeFrameId}-${activeTemplateId}.jpeg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        }

        if (activeFrame.src) {
            const frameImage = await loadImage(activeFrame.src);
            canvas.width = frameImage.width;
            canvas.height = frameImage.height;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. Gambar FOTO terlebih dahulu
            loadedPhotosData.forEach(({ photo, filter }, index) => {
                const layout = activeTemplate.layout[index];
                const x = (parseFloat(layout.x) / 100) * frameImage.width;
                const y = (parseFloat(layout.y) / 100) * frameImage.height;
                const width = (parseFloat(layout.width) / 100) * frameImage.width;
                const height = (parseFloat(layout.height) / 100) * frameImage.height;

                ctx.save();
                ctx.filter = getCssFilterValue(filter);
                
                // === PERBAIKAN: Gunakan fungsi baru di sini ===
                drawImageWithCover(ctx, photo, x, y, width, height);
                // ===========================================

                ctx.restore();
            });

            // 2. Gambar BINGKAI di atas foto
            ctx.drawImage(frameImage, 0, 0);
        } else {
           // ... (Logika untuk 'Tanpa Bingkai' tetap sama)
           const photoWidth = 640;
           const photoHeight = 480;
           const padding = 20;
           
           canvas.width = (photoWidth * activeTemplate.cols!) + (padding * (activeTemplate.cols! + 1));
           canvas.height = (photoHeight * activeTemplate.rows!) + (padding * (activeTemplate.rows! + 1));

           ctx.fillStyle = '#FFFFFF';
           ctx.fillRect(0, 0, canvas.width, canvas.height);

           loadedPhotosData.forEach(({ photo, filter }, index) => {
                const col = index % activeTemplate.cols!;
                const row = Math.floor(index / activeTemplate.cols!);
                const xPos = (col * photoWidth) + ((col + 1) * padding);
                const yPos = (row * photoHeight) + ((row + 1) * padding);
                ctx.filter = getCssFilterValue(filter);
                drawImageWithCover(ctx, photo, xPos, yPos, photoWidth, photoHeight);
                ctx.filter = 'none';
           });
        }
        
        setTimeout(triggerDownload, 100); 
    } catch (error) {
        console.error("Gagal membuat kolase:", error);
        alert("Gagal membuat kolase. Pastikan semua gambar dan frame tersedia.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
       {/* UI tidak berubah */}
       <div className="p-3 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert"><span className="font-medium">Perhatian!</span> Dengan mengambil foto, Anda setuju bahwa gambar Anda akan disimpan. Mohon baca <a href="/privacy" className="font-bold underline">Kebijakan Privasi</a> kami.</div>
       <h1 className="text-3xl md:text-4xl font-bold my-2 text-center text-gray-800 dark:text-gray-200">Photobooth Kelompok 3</h1>
       <div className="relative w-full max-w-lg md:max-w-2xl border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900">{isFlashing && <div className="absolute inset-0 bg-white z-20"></div>}{countdown !== null && countdown > 0 && <div className="absolute inset-0 flex items-center justify-center z-10"><h2 className="text-9xl font-bold text-white animate-ping drop-shadow-lg">{countdown}</h2></div>}<Webcam audio={false} ref={webcamRef} mirrored={true} className={`w-full h-auto transition-all duration-300 ${activeFilter}`} screenshotFormat="image/jpeg" width={1280} height={720} /></div>
       <div className='my-5 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-lg md:max-w-2xl'><div className="mb-4"><h3 className='font-bold text-lg mb-2 text-gray-700 dark:text-gray-200'>Pilih Filter:</h3><div className='flex flex-wrap gap-2'><button onClick={() => setActiveFilter('filter-none')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-none' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Normal</button><button onClick={() => setActiveFilter('filter-grayscale')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-grayscale' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Grayscale</button><button onClick={() => setActiveFilter('filter-sepia')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-sepia' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Sepia</button><button onClick={() => setActiveFilter('filter-invert')} className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'filter-invert' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Invert</button></div></div><div className="mb-4"><h3 className='font-bold text-lg mb-2 text-gray-700 dark:text-gray-200'>Pilih Layout Kolase:</h3><div className='flex flex-wrap gap-2'>{collageTemplates.map(template => (<button key={template.id} onClick={() => setActiveTemplateId(template.id)} className={`px-3 py-1 text-sm rounded-full ${activeTemplateId === template.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{template.name}</button>))}</div></div><div><h3 className='font-bold text-lg mb-2 text-gray-700 dark:text-gray-200'>Pilih Bingkai:</h3><div className='flex flex-wrap gap-2'>{frameOptions.map(frame => (<button key={frame.id} onClick={() => setActiveFrameId(frame.id)} className={`rounded-md overflow-hidden border-2 transition-all ${activeFrameId === frame.id ? 'border-blue-600 scale-105' : 'border-transparent'}`}>{frame.src ? <Image src={frame.src} alt={frame.name} width={80} height={60} className="object-cover" /> : <div className="w-20 h-[60px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">Tanpa Bingkai</div>}</button>))}</div></div></div>
       <div className="space-x-4">{images.length < photoCount ? <button onClick={startCaptureSequence} disabled={isCapturing} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"><Camera className="mr-2 h-5 w-5"/>{isCapturing ? `Mengambil Foto ${images.length + 1}/${photoCount}...` : `Mulai Sesi (${photoCount}x)`}</button> : <> <button onClick={resetSession} className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105"><RotateCcw className="mr-2 h-5 w-5" /> Ulangi Sesi</button><button onClick={downloadCollage} className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105"><Download className="mr-2 h-5 w-5" /> Download Collage</button></>}</div>
      {images.length > 0 && <div className="mt-8 w-full max-w-4xl"><h3 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">Hasil Galeri ({images.length}/{photoCount})</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">{images.map((image, index) => (<div key={index} className="relative w-full aspect-video"><Image src={image.src} alt={`Hasil foto ke-${index + 1}`} layout="fill" objectFit="cover" className={`rounded-lg border-2 border-gray-400 shadow-md transition-all duration-300 ${image.filter}`}/></div>))}{Array(photoCount - images.length).fill(0).map((_, index) => (<div key={index} className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center"><Camera className="h-10 w-10 text-gray-400 dark:text-gray-500" /></div>))}</div></div>}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default Photobooth;
