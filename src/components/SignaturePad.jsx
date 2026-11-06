import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, PenTool, CheckCircle2 } from 'lucide-react';

export default function SignaturePad({ onSave, value, disabled = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#1c1917';

      if (value) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          setHasSignature(true);
        };
        img.src = value;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [value]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (disabled) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (onSave) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const clear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
    if (onSave) {
      onSave('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-teal-700" aria-hidden="true" />
          Paraf Peminjam (Wajib)
        </label>
        {hasSignature && (
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1 bg-[#e8ecf2] shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#c5d0de] border border-white/60 px-2.5 py-1 rounded-xl transition min-h-[32px]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Hapus Paraf
          </button>
        )}
      </div>

      <div className="relative rounded-xl bg-[#e8ecf2] shadow-[inset_2px_2px_5px_#c5d0de,inset_-2px_-2px_5px_#ffffff] border border-white/60 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-32 signature-canvas cursor-crosshair bg-transparent"
          aria-label="Area paraf digital menggunakan sentuhan jari atau mouse"
        />

        {!hasSignature && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-stone-400 text-xs font-medium gap-1.5 select-none">
            <span>Bubuhkan paraf dengan jari di sini</span>
          </div>
        )}

        {hasSignature && (
          <div className="absolute bottom-2 right-2 pointer-events-none flex items-center gap-1 bg-green-100 border border-green-300 text-green-900 text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
            Paraf Terisi
          </div>
        )}
      </div>
    </div>
  );
}
