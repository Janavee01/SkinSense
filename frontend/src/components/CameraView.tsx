import { useState, useRef, useEffect } from 'react';
import { Camera, ScanLine, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SkinAnalysis {
  acneLevel: 'mild' | 'moderate' | 'severe' | 'none';
  pores: number;
  oiliness: number;
  dryness: number;
  darkSpots: number;
}

interface CameraViewProps {
  onAnalysisComplete: (analysis: SkinAnalysis) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export function CameraView({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Simulate face detection after a moment
        setTimeout(() => setFaceDetected(true), 2000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setFaceDetected(false);
  };

  const captureAndAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate skin analysis with random but realistic results
    setTimeout(() => {
      const mockAnalysis: SkinAnalysis = {
        acneLevel: ['none', 'mild', 'moderate'][Math.floor(Math.random() * 3)] as any,
        pores: Math.floor(Math.random() * 40) + 10,
        oiliness: Math.floor(Math.random() * 60) + 20,
        dryness: Math.floor(Math.random() * 50) + 10,
        darkSpots: Math.floor(Math.random() * 30) + 5,
      };
      
      onAnalysisComplete(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative bg-gradient-camera rounded-2xl p-4 shadow-glow">
        {/* Camera Preview */}
        <div className="relative bg-muted rounded-xl overflow-hidden aspect-[4/3]">
          {isCameraOn ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              
              {/* Face Detection Overlay */}
              {faceDetected && (
                <div className="absolute inset-4 border-2 border-primary rounded-lg animate-pulse-glow">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Face Detected ✨
                    </span>
                  </div>
                </div>
              )}
              
              {/* Analysis Scanning Effect */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-primary/10">
                  <div className="absolute w-full h-0.5 bg-primary animate-scan-line opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card/90 rounded-lg px-4 py-2 flex items-center gap-2">
                      <ScanLine className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">Analyzing skin...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Camera className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Camera Preview</p>
              <p className="text-sm">Turn on camera to start</p>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={() => setIsCameraOn(!isCameraOn)}
            variant={isCameraOn ? "secondary" : "default"}
            className="px-6"
          >
            <Camera className="w-4 h-4 mr-2" />
            {isCameraOn ? 'Turn Off' : 'Turn On'}
          </Button>
          
          {isCameraOn && faceDetected && (
            <Button 
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className="px-6 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Skin'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}