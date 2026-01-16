
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraPageProps {
  onCapture: (image: string) => void;
  onGenerate: () => void;
  onBack: () => void;
  capturedImage: string | null;
  orientation: 'portrait' | 'landscape';
}

const CameraPage: React.FC<CameraPageProps> = ({ onCapture, onGenerate, onBack, capturedImage, orientation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const isPortrait = orientation === 'portrait';
  const targetWidth = isPortrait ? 768 : 1344;
  const targetHeight = isPortrait ? 1344 : 768;
  const aspectRatioClass = isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]';
  const maxWidthClass = isPortrait ? 'max-w-[420px]' : 'max-w-[900px]';

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: targetWidth }, 
            height: { ideal: targetHeight }, 
            facingMode: 'user' 
          } 
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    setupCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, [targetWidth, targetHeight]);

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const videoRatio = video.videoWidth / video.videoHeight;
        const targetRatio = targetWidth / targetHeight;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = video.videoWidth;
        let sourceHeight = video.videoHeight;

        if (videoRatio > targetRatio) {
          sourceWidth = video.videoHeight * targetRatio;
          sourceX = (video.videoWidth - sourceWidth) / 2;
        } else {
          sourceHeight = video.videoWidth / targetRatio;
          sourceY = (video.videoHeight - sourceHeight) / 2;
        }

        ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
        // Automatically proceed to generation
        onGenerate();
      }
    }
  }, [onCapture, onGenerate, targetWidth, targetHeight]);

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          capture();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-6 bg-black relative overflow-y-auto">
      <div className="flex justify-between items-center w-full mb-8 max-w-5xl z-20">
        <button onClick={onBack} className="text-white hover:text-purple-400 font-bold tracking-widest uppercase text-xs md:text-base transition-colors">BACK</button>
        <h2 className="text-xs md:text-xl font-heading text-white neon-text italic uppercase">Strike a Pose</h2>
        <div className="w-10" />
      </div>

      <div className={`relative w-full ${maxWidthClass} ${aspectRatioClass} border-2 border-white/20 overflow-hidden bg-gray-900 shadow-[0_0_50px_rgba(188,19,254,0.3)] mb-8`}>
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* HUD Overlay Elements */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5">
              {/* Corner Brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-purple-500/50" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-500/50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-500/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-purple-500/50" />
              
              {/* Guide Reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                   <div className="w-1 h-8 bg-purple-500/20" />
                   <div className="absolute h-1 w-8 bg-purple-500/20" />
                </div>
              </div>
            </div>

            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-[4px]">
                <span className="text-[120px] md:text-[200px] font-heading text-white neon-text animate-ping italic">{countdown}</span>
              </div>
            )}
            
            {/* Futuristic "CAPTURE" Shutter Button */}
            {!countdown && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 px-6 group">
                <button 
                  onClick={startCountdown}
                  className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center outline-none"
                >
                  {/* Outer Tech Ring (Rotating) */}
                  <div className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                  
                  {/* Middle Glow Layer */}
                  <div className="absolute inset-2 border-2 border-white/20 rounded-full group-hover:border-purple-400/50 transition-colors duration-500" />
                  
                  {/* Action Core */}
                  <div className="absolute inset-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:bg-purple-600/20 group-hover:border-purple-400 group-hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] md:text-xs font-heading font-black text-white tracking-[0.2em] italic group-hover:neon-text">CAPTURE</span>
                      <div className="w-4 h-[1px] bg-purple-500 mt-1 opacity-50 group-hover:w-8 transition-all" />
                    </div>
                  </div>

                  {/* Aesthetic Floating Brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/40 group-hover:border-purple-400 transition-colors" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/40 group-hover:border-purple-400 transition-colors" />
                </button>
              </div>
            )}

            <div className="scan-line opacity-30" />
          </>
        ) : (
          <img src={capturedImage} alt="Capture" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-md text-center opacity-40">
        <p className="text-[8px] md:text-[10px] text-gray-400 font-mono tracking-[0.3em] uppercase">
          COROAI.APP
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPage;
