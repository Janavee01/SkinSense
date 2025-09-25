import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Sparkles, DollarSign } from 'lucide-react';

interface SkinAnalysis {
  acneLevel: 'mild' | 'moderate' | 'severe' | 'none';
  pores: number;
  oiliness: number;
  dryness: number;
  darkSpots: number;
}

interface ProductRecommendationsProps {
  analysis: SkinAnalysis | null;
  skinProfile: any;
}

const PRODUCTS = {
  cleansers: [
    { name: 'CeraVe Foaming Facial Cleanser', price: 12.97, rating: 4.5, walmart: true },
    { name: 'Neutrogena Ultra Gentle Daily Cleanser', price: 8.97, rating: 4.3, walmart: true },
    { name: 'Cetaphil Gentle Skin Cleanser', price: 10.97, rating: 4.6, walmart: true }
  ],
  treatments: [
    { name: 'The Ordinary Niacinamide 10%', price: 7.20, rating: 4.2, walmart: false },
    { name: 'Olay Regenerist Face Serum', price: 24.97, rating: 4.4, walmart: true },
    { name: 'Neutrogena Rapid Clear Acne Treatment', price: 8.47, rating: 4.1, walmart: true }
  ],
  moisturizers: [
    { name: 'CeraVe Daily Moisturizing Lotion', price: 15.97, rating: 4.7, walmart: true },
    { name: 'Olay Regenerist Micro-Sculpting Cream', price: 28.97, rating: 4.3, walmart: true },
    { name: 'Cetaphil Daily Facial Moisturizer', price: 12.97, rating: 4.4, walmart: true }
  ]
};

export function ProductRecommendations({ analysis, skinProfile }: ProductRecommendationsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (productName: string) => {
    setFavorites(prev => 
      prev.includes(productName) 
        ? prev.filter(name => name !== productName)
        : [...prev, productName]
    );
  };

  const getRecommendations = () => {
    if (!analysis) return [];
    
    let recommendations = [];
    
    // Cleanser recommendations based on oiliness
    if (analysis.oiliness > 60) {
      recommendations.push(...PRODUCTS.cleansers.slice(0, 2));
    } else {
      recommendations.push(PRODUCTS.cleansers[2]);
    }
    
    // Treatment recommendations based on acne level
    if (analysis.acneLevel !== 'none') {
      recommendations.push(PRODUCTS.treatments[2]); // Acne treatment
      if (analysis.acneLevel === 'severe') {
        recommendations.push(PRODUCTS.treatments[0]); // Niacinamide
      }
    } else {
      recommendations.push(PRODUCTS.treatments[1]); // Anti-aging serum
    }
    
    // Moisturizer based on dryness
    if (analysis.dryness > 50) {
      recommendations.push(PRODUCTS.moisturizers[0]); // CeraVe
    } else {
      recommendations.push(PRODUCTS.moisturizers[2]); // Cetaphil
    }
    
    return recommendations;
  };

  const getSkinAdvice = () => {
    if (!analysis) return [];
    
    const advice = [];
    
    if (analysis.acneLevel !== 'none') {
      advice.push("🧴 Use a gentle cleanser twice daily to prevent clogged pores");
      advice.push("💧 Don't over-wash - it can make acne worse!");
    }
    
    if (analysis.oiliness > 60) {
      advice.push("🌟 Look for oil-free and non-comedogenic products");
      advice.push("🧽 Use a clay mask 1-2 times per week");
    }
    
    if (analysis.dryness > 50) {
      advice.push("💦 Apply moisturizer while skin is still damp");
      advice.push("🌙 Use a heavier night cream for extra hydration");
    }
    
    if (analysis.darkSpots > 20) {
      advice.push("☀️ Always wear sunscreen to prevent more dark spots");
      advice.push("✨ Consider products with vitamin C or niacinamide");
    }
    
    return advice;
  };

  const recommendations = getRecommendations();
  const skinAdvice = getSkinAdvice();

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Ready for Your Skin Analysis!</h3>
        <p className="text-muted-foreground">
          Capture your face to get personalized product recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <Card className="p-6 bg-gradient-beauty border-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Your Skin Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analysis.oiliness}%</div>
            <div className="text-xs text-muted-foreground">Oiliness</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analysis.dryness}%</div>
            <div className="text-xs text-muted-foreground">Dryness</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analysis.pores}</div>
            <div className="text-xs text-muted-foreground">Pore Visibility</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analysis.darkSpots}</div>
            <div className="text-xs text-muted-foreground">Dark Spots</div>
          </div>
        </div>
      </Card>

      {/* Skin Advice */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">💡 Personalized Tips</h3>
        <div className="space-y-2">
          {skinAdvice.map((tip, index) => (
            <div key={index} className="text-sm bg-muted/50 rounded-lg p-3">
              {tip}
            </div>
          ))}
        </div>
      </Card>

      {/* Product Recommendations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Recommended for You
        </h3>
        <div className="grid gap-4">
          {recommendations.map((product, index) => (
            <Card key={index} className="p-4 hover:shadow-glow transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}`} 
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {product.rating}
                          </span>
                        </div>
                        {product.walmart && (
                          <Badge variant="secondary" className="text-xs">
                            Walmart
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-primary font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {product.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(product.name)}
                    className={favorites.includes(product.name) ? 'text-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(product.name) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}