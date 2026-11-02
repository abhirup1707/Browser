import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { playBoing, playRimshot } from '../services/soundEffects';

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const WebcamModal: React.FC<WebcamModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const message = err instanceof Error ? err.message : 'Camera access denied';
      setCameraError(`Could not access webcam: ${message}. Check permissions.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (countdown !== null) return;
    setCountdown(3);
    playBoing();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          captureFrame();
          return null;
        }
        playBoing();
        return prev - 1;
      });
    }, 800);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for natural selfie mirror
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    playRimshot();
    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Snap a Live Selfie / Photo
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-rose-400 text-sm max-w-sm">
              <p className="mb-3 font-semibold">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold hover:bg-slate-700"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-8xl font-black text-amber-400 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Target Reticle Crosshair */}
              <div className="pointer-events-none absolute inset-6 border border-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-l-2 border-orange-500 absolute top-2 left-2" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-orange-500 absolute top-2 right-2" />
                <div className="w-8 h-8 border-b-2 border-l-2 border-orange-500 absolute bottom-2 left-2" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-orange-500 absolute bottom-2 right-2" />
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-5 flex items-center justify-center gap-4 bg-slate-950">
          <button
            onClick={handleTakeSnapshot}
            disabled={!!cameraError || countdown !== null}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            <span>{countdown !== null ? `Posing... ${countdown}` : 'Snap Photo & Roast'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
