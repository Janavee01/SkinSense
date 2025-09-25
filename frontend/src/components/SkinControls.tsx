import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Droplets, Sun, ShoppingBag, User } from 'lucide-react';

interface SkinProfile {
  sensitivity: number;
  hasTan: boolean;
  previousProducts: string[];
  skinType: string;
}

interface SkinControlsProps {
  profile: SkinProfile;
  onProfileChange: (profile: SkinProfile) => void;
}

const PREVIOUS_PRODUCTS = [
  'CeraVe Hydrating Cleanser',
  'Neutrogena Ultra Gentle Cleanser',
  'The Ordinary Niacinamide',
  'Cetaphil Daily Moisturizer',
  'Olay Regenerist Serum',
  'L\'Oreal Revitalift Cream'
];

const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];

export function SkinControls({ profile, onProfileChange }: SkinControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateProfile = (updates: Partial<SkinProfile>) => {
    onProfileChange({ ...profile, ...updates });
  };

  const toggleProduct = (product: string) => {
    const newProducts = profile.previousProducts.includes(product)
      ? profile.previousProducts.filter(p => p !== product)
      : [...profile.previousProducts, product];
    updateProfile({ previousProducts: newProducts });
  };

  return (
    <div className="space-y-4">
      {/* Skin Sensitivity */}
      <Card className="p-4 bg-gradient-beauty border-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            <Label className="text-sm font-medium">Skin Sensitivity</Label>
          </div>
          <div className="space-y-2">
            <Slider
              value={[profile.sensitivity]}
              onValueChange={([value]) => updateProfile({ sensitivity: value })}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Sensitive</span>
              <span>{profile.sensitivity}%</span>
              <span>Not Sensitive</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tan & Skin Type */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tan"
              checked={profile.hasTan}
              onCheckedChange={(checked) => updateProfile({ hasTan: !!checked })}
            />
            <Label htmlFor="tan" className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-accent" />
              I have a tan
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Skin Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {SKIN_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={profile.skinType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProfile({ skinType: type })}
                  className="h-8 text-xs"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Previous Products */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Previous Products
            </Label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {PREVIOUS_PRODUCTS.slice(0, isExpanded ? undefined : 3).map((product) => (
              <div key={product} className="flex items-center space-x-2">
                <Checkbox
                  id={product}
                  checked={profile.previousProducts.includes(product)}
                  onCheckedChange={() => toggleProduct(product)}
                />
                <Label 
                  htmlFor={product} 
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  {product}
                </Label>
              </div>
            ))}
          </div>
          
          {profile.previousProducts.length > 0 && (
            <div className="text-xs text-primary font-medium">
              {profile.previousProducts.length} product{profile.previousProducts.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}