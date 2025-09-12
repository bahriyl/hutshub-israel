import { useState } from 'react';
import { ArrowRight, Calendar, Users, CreditCard, Check, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingFlowProps {
  propertyId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function BookingFlow({ propertyId, onBack, onComplete }: BookingFlowProps) {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkIn: '2024-02-15',
    checkOut: '2024-02-17',
    guests: 2,
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    paymentMethod: ''
  });

  // Mock property data
  const property = {
    title: isRTL ? 'צימר רומנטי בגליל' : 'Romantic Cabin in Galilee',
    price: 450,
    location: isRTL ? 'רמת הגולן' : 'Golan Heights'
  };

  const nights = 2;
  const subtotal = property.price * nights;
  const cleaningFee = 80;
  const serviceFee = 45;
  const total = subtotal + cleaningFee + serviceFee;

  const steps = [
    { number: 1, title: t('booking.dates_guests') },
    { number: 2, title: t('booking.contact_details') },
    { number: 3, title: t('booking.payment') },
    { number: 4, title: t('booking.confirmation') }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.select_dates')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('booking.checkin')}</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>15/02/2024</span>
                  </div>
                </div>
                <div>
                  <Label>{t('booking.checkout')}</Label>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>17/02/2024</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.guests')}</h3>
              <div className="flex items-center justify-between">
                <span>{t('booking.guests')}</span>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon">-</Button>
                  <span className="w-8 text-center">2</span>
                  <Button variant="outline" size="icon">+</Button>
                </div>
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.contact_details')}</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('booking.full_name')} {t('common.required')}</Label>
                  <Input
                    id="name"
                    value={bookingData.guestName}
                    onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                    className={isRTL ? 'text-right' : 'text-left'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('booking.phone')} {t('common.required')}</Label>
                  <div className="relative">
                    <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="phone"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData({...bookingData, guestPhone: e.target.value})}
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      placeholder="050-1234567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t('booking.email')} {t('common.required')}</Label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData({...bookingData, guestEmail: e.target.value})}
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.important_info')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
                <li>• {t('booking.cancellation_policy')}</li>
                <li>• {t('booking.checkin_time')}</li>
                <li>• {t('booking.checkout_time')}</li>
                <li>• {t('booking.smoking_policy')}</li>
              </ul>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.select_payment')}</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input type="radio" name="payment" value="bit" className="accent-green-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-medium">Bit</div>
                    <span>Bit</span>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input type="radio" name="payment" value="paybox" className="accent-green-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-medium">PB</div>
                    <span>PayBox</span>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input type="radio" name="payment" value="credit" className="accent-green-600" />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                    <span>{t('booking.credit_card')}</span>
                  </div>
                </label>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.cancellation_terms')}</h4>
              <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('booking.cancellation_description')}
              </p>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.confirmed')}</h3>
              <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('booking.confirmation_sent')}
              </p>
            </div>

            <Card className="p-4 text-right" dir={isRTL ? 'rtl' : 'ltr'}>
              <h4 className="font-medium mb-3">{t('booking.booking_details')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('booking.booking_number')}</span>
                  <span className="font-medium">#HH24-0215</span>
                </div>
                <div className="flex justify-between">
                  <span>{isRTL ? 'צימר:' : 'Property:'}:</span>
                  <span>{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.dates')}</span>
                  <span>15-17/02/2024</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.guests')}:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>{t('booking.total')}</span>
                  <span>₪{total}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button className="w-full">{t('booking.whatsapp')}</Button>
              <Button variant="outline" className="w-full">{t('booking.download_pdf')}</Button>
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

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.number <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
              </div>
            ))}
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Property Summary */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg" />
            <div className="flex-1">
              <h3 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{property.title}</h3>
              <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>{property.location}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{isRTL ? 'ג\'קוזי' : 'Jacuzzi'}</Badge>
                <Badge variant="secondary">{isRTL ? 'מט"מ' : 'Safe Room'}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Step Content */}
        {renderStepContent()}

        {/* Price Summary - shown on steps 1-3 */}
        {currentStep < 4 && (
          <Card className="p-4 mt-6">
            <h4 className="font-medium mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.price_summary')}</h4>
            <div className="space-y-2 text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex justify-between">
                <span>₪{property.price} × {nights} {t('booking.nights')}</span>
                <span>₪{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('booking.cleaning_fee')}</span>
                <span>₪{cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('booking.service_fee')}</span>
                <span>₪{serviceFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-base">
                <span>{t('booking.total')}</span>
                <span>₪{total}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 sm:relative sm:border-0 sm:bg-transparent sm:p-0">
        <div className="max-w-2xl mx-auto">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleNext}
            disabled={currentStep === 2 && (!bookingData.guestName || !bookingData.guestPhone || !bookingData.guestEmail)}
          >
            {currentStep === 4 ? t('booking.finish') : currentStep === 3 ? `${t('booking.pay')} ₪${total}` : t('booking.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
}