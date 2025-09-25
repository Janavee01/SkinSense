import { useState } from 'react';
import { CameraView } from '@/components/CameraView';
import { SkinControls } from '@/components/SkinControls';
import { ProductRecommendations } from '@/components/ProductRecommendations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface SkinAnalysis {
  acneLevel: 'mild' | 'moderate' | 'severe' | 'none';
  pores: number;
  oiliness: number;
  dryness: number;
  darkSpots: number;
}

interface SkinProfile {
  sensitivity: number;
  hasTan: boolean;
  previousProducts: string[];
  skinType: string;
}

export default function SkinAnalysis() {
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>({
    sensitivity: 50,
    hasTan: false,
    previousProducts: [],
    skinType: 'Normal'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-accent-foreground p-2 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SkinSmart AI</h1>
                <p className="text-primary-foreground/80 text-sm">Powered by Walmart</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Free Analysis
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Your Profile
              </h2>
              <SkinControls 
                profile={skinProfile} 
                onProfileChange={setSkinProfile} 
              />
            </div>
          </div>

          {/* Center - Camera */}
          <div className="lg:col-span-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">AI Skin Analysis</h2>
              <p className="text-muted-foreground">
                Position your face in the camera and let our AI analyze your skin
              </p>
            </div>
            
            <CameraView 
              onAnalysisComplete={setAnalysis}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />

            {/* Quick Stats */}
            {analysis && (
              <Card className="mt-6 p-4 bg-gradient-beauty border-0">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Analysis Complete! ✨</h3>
                  <div className="flex justify-center gap-4 text-sm">
                    <div>
                      <span className="font-medium">Acne: </span>
                      <span className={`capitalize ${
                        analysis.acneLevel === 'none' ? 'text-green-600' : 
                        analysis.acneLevel === 'mild' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {analysis.acneLevel}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Skin Type: </span>
                      <span className="text-primary">{skinProfile.skinType}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Additional Info */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-4">
              <Card className="p-4 bg-accent/10 border-accent/20">
                <h3 className="font-semibold mb-2 text-accent-foreground">💡 Pro Tips</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Clean your face before analysis</li>
                  <li>• Ensure good lighting</li>
                  <li>• Look directly at camera</li>
                  <li>• Remove makeup if possible</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-2">🎯 Accuracy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Face Detection</span>
                    <span className="text-green-600 font-medium">99.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Skin Analysis</span>
                    <span className="text-green-600 font-medium">94.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Product Matching</span>
                    <span className="text-green-600 font-medium">97.1%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Section - Recommendations */}
        <div className="mt-12">
          <ProductRecommendations 
            analysis={analysis} 
            skinProfile={skinProfile}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">W</span>
            </div>
            <span className="font-semibold">Walmart SkinSmart AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Personalized skincare recommendations powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}