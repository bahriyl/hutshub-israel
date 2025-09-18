import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Users, CreditCard, Check, Phone, Mail, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image?: string;
  images?: string[];
  amenities?: string[];
  maxGuests?: number;
  minNights?: number;
  cancellationPolicy?: string;
  smokingPolicy?: string;
  checkinTime?: string;   // e.g. "15:00"
  checkoutTime?: string;  // e.g. "11:00"
  cleaningFee?: number;
  serviceFee?: number;
}

interface BookingFlowProps {
  propertyId: string;
  property?: Property; // Accept property data from parent
  onBack: () => void;
  onComplete: () => void;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  paymentMethod: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export function BookingFlow({ propertyId, property: initialProperty, onBack, onComplete }: BookingFlowProps) {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [property, setProperty] = useState<Property | null>(initialProperty || null);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState<string | null>(null);

  // Initialize with proper default dates (today + 1 and today + 2)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfter.toISOString().split('T')[0],
    guests: 2,
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    paymentMethod: ''
  });

  // Fetch property data if not provided
  useEffect(() => {
    if (initialProperty) {
      setProperty(initialProperty);
      setLoading(false);
      return;
    }

    const abort = new AbortController();
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const lang = isRTL ? 'he' : 'en';
        const res = await fetch(`${API_URL}/properties/${propertyId}?lang=${lang}`, {
          headers: { 'Accept-Language': lang },
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Property;
        setProperty(json);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Failed to load property');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    return () => abort.abort();
  }, [propertyId, isRTL, initialProperty]);

  // Calculate booking details
  const checkInDate = new Date(bookingData.checkIn);
  const checkOutDate = new Date(bookingData.checkOut);
  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = property ? property.price * nights : 0;
  const cleaningFee = property?.cleaningFee ?? 0;
  const serviceFee = property?.serviceFee ?? 0;
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

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const handleGuestChange = (increment: boolean) => {
    const maxGuests = property?.maxGuests || 10;
    updateBookingData({
      guests: increment
        ? Math.min(bookingData.guests + 1, maxGuests)
        : Math.max(1, bookingData.guests - 1)
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'he-IL' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isFormValid = () => {
    if (currentStep === 2) {
      return bookingData.guestName.trim() &&
        bookingData.guestPhone.trim() &&
        bookingData.guestEmail.trim();
    }
    if (currentStep === 3) {
      return bookingData.paymentMethod !== '';
    }
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Button variant="ghost" size="icon" onClick={onBack} className="mb-4">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || t('common.failed_to_load')}</p>
          <Button onClick={onBack}>{t('common.go_back')}</Button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-medium mb-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.select_dates')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex-[0_0_auto] w-[11.5rem]">
                  <Label htmlFor="checkin">{t('booking.checkin')}</Label>
                  <div className="relative">
                    <Calendar className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="checkin"
                      type="date"
                      value={bookingData.checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => updateBookingData({ checkIn: e.target.value })}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} w-full appearance-none`}
                    />
                  </div>
                </div>

                <div className="flex-[0_0_auto] w-[11.5rem]">
                  <Label htmlFor="checkout">{t('booking.checkout')}</Label>
                  <div className="relative">
                    <Calendar className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="checkout"
                      type="date"
                      value={bookingData.checkOut}
                      min={bookingData.checkIn}
                      onChange={(e) => updateBookingData({ checkOut: e.target.value })}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} w-full appearance-none`}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                  {nights} {t('booking.nights')} • {formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{t('booking.guests')}</span>
                  <p className="text-sm text-muted-foreground">
                    {t('property.up_to_guests', { count: property.maxGuests || 10 })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(false)}
                    disabled={bookingData.guests <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{bookingData.guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(true)}
                    disabled={bookingData.guests >= (property.maxGuests || 10)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
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
                  <Label htmlFor="name">{t('booking.full_name')} <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={bookingData.guestName}
                    onChange={(e) => updateBookingData({ guestName: e.target.value })}
                    className={isRTL ? 'text-right' : 'text-left'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={t('booking.full_name')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('booking.phone')} <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.guestPhone}
                      onChange={(e) => updateBookingData({ guestPhone: e.target.value })}
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      placeholder="050-1234567"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t('booking.email')} <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.guestEmail}
                      onChange={(e) => updateBookingData({ guestEmail: e.target.value })}
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('booking.important_info')}
              </h4>

              {(() => {
                const cancel = property.cancellationPolicy || 'Cancellation policy not specified';
                const checkin = property.checkinTime
                  ? `${t('booking.checkin_time')}: ${property.checkinTime}`
                  : t('booking.checkin_time');
                const checkout = property.checkoutTime
                  ? `${t('booking.checkout_time')}: ${property.checkoutTime}`
                  : t('booking.checkout_time');
                const smoking = property.smokingPolicy || t('booking.smoking_policy');

                return (
                  <ul className="text-sm text-muted-foreground space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
                    <li>• {cancel}</li>
                    <li>• {checkin}</li>
                    <li>• {checkout}</li>
                    <li>• {smoking}</li>
                  </ul>
                );
              })()}
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
                  <input
                    type="radio"
                    name="payment"
                    value="bit"
                    checked={bookingData.paymentMethod === 'bit'}
                    onChange={(e) => updateBookingData({ paymentMethod: e.target.value })}
                    className="accent-green-600"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-medium">Bit</div>
                    <span>Bit</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="payment"
                    value="paybox"
                    checked={bookingData.paymentMethod === 'paybox'}
                    onChange={(e) => updateBookingData({ paymentMethod: e.target.value })}
                    className="accent-green-600"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-medium">PB</div>
                    <span>PayBox</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={bookingData.paymentMethod === 'credit'}
                    onChange={(e) => updateBookingData({ paymentMethod: e.target.value })}
                    className="accent-green-600"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                    <span>{t('booking.credit_card')}</span>
                  </div>
                </label>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-1" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.cancellation_terms')}</h4>
              <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                {property.cancellationPolicy || 'Cancellation policy not specified'}
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

            <Card className="p-4 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
              <h4 className="font-medium mb-3">{t('booking.booking_details')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('booking.booking_number')}</span>
                  <span className="font-medium">#HH{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}{String(new Date().getDate()).padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('property.property')}:</span>
                  <span>{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.dates')}</span>
                  <span>{formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.guests')}:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.nights')}:</span>
                  <span>{nights}</span>
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
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step.number <= currentStep
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
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
              {property.image || (property.images && property.images[0]) ? (
                <img
                  src={property.image || property.images![0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{property.title}</h3>
              <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>{property.location}</p>
              <div className="flex items-center gap-2 mt-1">
                {property.amenities?.slice(0, 2).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Step Content */}
        {renderStepContent()}

        {/* Price Summary - shown on steps 1-3 */}
        {currentStep < 4 && (
          <Card className="p-4 mt-6">
            <h4 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{t('booking.price_summary')}</h4>
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
            disabled={!isFormValid()}
          >
            {currentStep === 4
              ? t('booking.finish')
              : currentStep === 3
                ? `${t('booking.pay')} ₪${total}`
                : t('booking.continue')
            }
          </Button>
        </div>
      </div>
    </div>
  );
}