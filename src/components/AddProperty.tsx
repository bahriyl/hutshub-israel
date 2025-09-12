import { useState } from 'react';
import { ArrowRight, Upload, MapPin, Home, Star, DollarSign, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../contexts/LanguageContext';

interface AddPropertyProps {
  onBack: () => void;
  onComplete: () => void;
}

export function AddProperty({ onBack, onComplete }: AddPropertyProps) {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    maxGuests: '',
    minNights: '',
    amenities: [] as string[],
    images: [] as File[]
  });

  const steps = [
    { number: 1, title: t('add_property.basic_details'), icon: Home },
    { number: 2, title: t('add_property.photos'), icon: Upload },
    { number: 3, title: t('add_property.amenities'), icon: Star },
    { number: 4, title: t('add_property.price'), icon: DollarSign },
    { number: 5, title: t('add_property.finish'), icon: Check }
  ];

  const amenities = [
    t('amenity.private_jacuzzi'),
    t('amenity.pool'),
    t('amenity.bbq'),
    t('amenity.mamad'),
    t('amenity.kosher_kitchen'),
    t('amenity.wifi'),
    t('amenity.parking'),
    t('amenity.ac'),
    t('amenity.heating'),
    t('amenity.terrace'),
    t('amenity.pet_friendly'),
    t('amenity.no_stairs'),
    t('amenity.view'),
    t('amenity.quiet')
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setPropertyData({
        ...propertyData,
        amenities: [...propertyData.amenities, amenity]
      });
    } else {
      setPropertyData({
        ...propertyData,
        amenities: propertyData.amenities.filter(a => a !== amenity)
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.property_details')}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('add_property.title')} {t('common.required')}</Label>
                  <Input
                    id="title"
                    value={propertyData.title}
                    onChange={(e) => setPropertyData({...propertyData, title: e.target.value})}
                    placeholder={t('add_property.title_placeholder')}
                    className={isRTL ? 'text-right' : 'text-left'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <Label htmlFor="location">{t('add_property.location')} {t('common.required')}</Label>
                  <div className="relative">
                    <MapPin className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="location"
                      value={propertyData.location}
                      onChange={(e) => setPropertyData({...propertyData, location: e.target.value})}
                      placeholder={t('add_property.location_placeholder')}
                      className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t('add_property.description')} {t('common.required')}</Label>
                  <Textarea
                    id="description"
                    value={propertyData.description}
                    onChange={(e) => setPropertyData({...propertyData, description: e.target.value})}
                    placeholder={t('add_property.description_placeholder')}
                    className={`${isRTL ? 'text-right' : 'text-left'} min-h-[100px]`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxGuests">{t('add_property.max_guests')} {t('common.required')}</Label>
                    <Select value={propertyData.maxGuests} onValueChange={(value) => setPropertyData({...propertyData, maxGuests: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('add_property.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 {t('common.guests')}</SelectItem>
                        <SelectItem value="4">4 {t('common.guests')}</SelectItem>
                        <SelectItem value="6">6 {t('common.guests')}</SelectItem>
                        <SelectItem value="8">8 {t('common.guests')}</SelectItem>
                        <SelectItem value="10">10+ {t('common.guests')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="minNights">{t('add_property.min_nights')} {t('common.required')}</Label>
                    <Select value={propertyData.minNights} onValueChange={(value) => setPropertyData({...propertyData, minNights: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('add_property.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{isRTL ? 'לילה אחד' : '1 night'}</SelectItem>
                        <SelectItem value="2">2 {t('common.nights')}</SelectItem>
                        <SelectItem value="3">3 {t('common.nights')}</SelectItem>
                        <SelectItem value="7">{isRTL ? 'שבוע' : '1 week'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.add_photos')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.photos_description')}
              </p>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t('add_property.drag_photos')}
                </p>
                <Button variant="outline">
                  {t('add_property.select_photos')}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {/* Placeholder for uploaded images */}
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'תמונה 1' : 'Image 1'}
                  </span>
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'תמונה 2' : 'Image 2'}
                  </span>
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'תמונה 3' : 'Image 3'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-medium mb-2 text-blue-900" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.photo_tips')}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
                <li>{t('add_property.photo_tip_1')}</li>
                <li>{t('add_property.photo_tip_2')}</li>
                <li>{t('add_property.photo_tip_3')}</li>
                <li>{t('add_property.photo_tip_4')}</li>
              </ul>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.what_amenities')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.amenities_description')}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={amenity}
                      checked={propertyData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity} className="text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-medium mb-2 text-green-900" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.popular_amenities')}
              </h4>
              <p className="text-sm text-green-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.popular_amenities_desc')}
              </p>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('add_property.set_price')}</h3>
              <p className="text-sm text-muted-foreground mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.price_description')}
              </p>
              
              <div>
                <Label htmlFor="price">{t('add_property.price_per_night')} {t('common.required')}</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    value={propertyData.price}
                    onChange={(e) => setPropertyData({...propertyData, price: e.target.value})}
                    placeholder="450"
                    className={isRTL ? 'pr-8' : 'pl-8'}
                  />
                  <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground`}>
                    ₪
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.area_prices')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span dir={isRTL ? 'rtl' : 'ltr'}>{t('add_property.similar_properties')}</span>
                  <span>₪380 - ₪520</span>
                </div>
                <div className="flex justify-between">
                  <span dir={isRTL ? 'rtl' : 'ltr'}>{t('add_property.average_price')}</span>
                  <span>₪450</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
              <h4 className="font-medium mb-2 text-amber-900" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.no_commission')}
              </h4>
              <p className="text-sm text-amber-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.no_commission_desc')}
              </p>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.success')}
              </h3>
              <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('add_property.review_process')}
              </p>
            </div>

            <Card className="p-4 text-right" dir={isRTL ? 'rtl' : 'ltr'}>
              <h4 className="font-medium mb-3">{t('add_property.what_happens_now')}</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium">{t('add_property.quality_check')}</p>
                    <p className="text-muted-foreground">{t('add_property.quality_check_desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-xs font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium">{t('add_property.publish')}</p>
                    <p className="text-muted-foreground">{t('add_property.publish_desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-purple-600 text-xs font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium">{t('add_property.start_earning')}</p>
                    <p className="text-muted-foreground">{t('add_property.start_earning_desc')}</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" onClick={onComplete}>
                {t('add_property.back_to_dashboard')}
              </Button>
              <Button variant="outline" className="w-full">
                {t('add_property.add_another')}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>{steps[currentStep - 1].title}</h1>
          <div />
        </div>

        {/* Progress */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step.number <= currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {renderStepContent()}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 sm:relative sm:border-0 sm:bg-transparent sm:p-0">
        <div className="max-w-2xl mx-auto">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!propertyData.title || !propertyData.location || !propertyData.description)) ||
              (currentStep === 4 && !propertyData.price)
            }
          >
            {currentStep === 5 ? t('booking.finish') : t('booking.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
}