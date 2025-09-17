import { useEffect, useMemo, useState, useRef } from 'react';
import { ArrowRight, Star, Heart, Share, MapPin, Users, Wifi, Car, Utensils, Waves, Shield, Phone, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyDetailProps {
  propertyId: string;
  onBack: () => void;
  onBooking: () => void;
}

type AmenityIcon = (props: { className?: string }) => JSX.Element;

// Відповідь від бекенда для деталки
interface ApiProperty {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image?: string;          // одиночне зображення з API
  images?: string[];       // опційно, якщо додасте в API пізніше
  amenities?: string[];    // локалізовані назви (en/he) з API
  isNew?: boolean;
  // опційні розширення на майбутнє:
  description?: string;
  maxGuests?: number;
  minNights?: number;
  host?: {
    name: string;
    avatar?: string;
    rating?: number;
    responseTime?: string;
    isVerified?: boolean;
  };
  reviews?: Array<{
    id: string | number;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}

const SWIPE_THRESHOLD = 40;

const API_URL = import.meta.env.VITE_API_URL;

export function PropertyDetail({ propertyId, onBack, onBooking }: PropertyDetailProps) {
  const { t, isRTL } = useLanguage();

  const [data, setData] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  // Мапа іконок зручностей (матчимо по локалізованих рядках)
  const amenityMap = useMemo<
    Array<{ keys: string[]; icon: AmenityIcon; i18nKey: string }>
  >(
    () => [
      { keys: ['private jacuzzi', 'jacuzzi', 'ג\'קוזי'], icon: Waves, i18nKey: 'amenity.private_jacuzzi' },
      { keys: ['wifi', 'wi-fi', 'וויי פיי', 'וויפי'], icon: Wifi, i18nKey: 'amenity.wifi' },
      { keys: ['parking', 'חניה'], icon: Car, i18nKey: 'amenity.parking' },
      { keys: ['kosher kitchen', 'kosher', 'מטבח כשר'], icon: Utensils, i18nKey: 'amenity.kosher_kitchen' },
      { keys: ['safe room', 'mamad', 'ממ״ד', 'ממד', 'מט"מ'], icon: Shield, i18nKey: 'amenity.mamad' },
      { keys: ['service 24/7', 'service', 'שירות 24/7'], icon: Phone, i18nKey: 'amenity.service_24_7' },
    ],
    []
  );

  function gotoNext() {
    setCurrentImageIndex((i) => (images.length ? (i + 1) % images.length : i));
  }
  function gotoPrev() {
    setCurrentImageIndex((i) => (images.length ? (i - 1 + images.length) % images.length : i));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }
  function onTouchEnd() {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current < 0) gotoNext();
      else gotoPrev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  // (optional) keyboard support
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') gotoPrev();
    if (e.key === 'ArrowRight') gotoNext();
  }

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const lang = isRTL ? 'he' : 'en';
        const res = await fetch(`${API_URL}/properties/${propertyId}?lang=${lang}`, {
          headers: { 'Accept-Language': lang },
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiProperty;
        setData(json);
        setCurrentImageIndex(0);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => abort.abort();
  }, [propertyId, isRTL]);

  const images: string[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.images) && data.images.length) return data.images;
    if (data.image) return [data.image];
    return [];
  }, [data]);

  const amenitiesForRender = useMemo(() => {
    const list = (data?.amenities ?? []).slice(0, 12);
    return list.map((a) => {
      const key = (a || '').toString().toLowerCase();
      const found = amenityMap.find((row) => row.keys.some((k) => key.includes(k.toLowerCase())));
      if (found) {
        return { icon: found.icon, label: t(found.i18nKey) };
      }
      // fallback — невідомі зручності
      return { icon: HelpCircle, label: a };
    });
  }, [data?.amenities, amenityMap, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="p-4 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded" />
            <div className="h-6 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Button variant="ghost" size="icon" onClick={onBack} className="mb-3">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="text-sm text-red-600">{t('common.failed_to_load')}</div>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        tabIndex={0}                 // enables keyboard focus
        role="region"
        aria-label="Property images"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={images[currentImageIndex] || 'https://via.placeholder.com/1200x900?text=No+Image'}
            alt={data.title}
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
        </div>

        {/* Prev/Next overlay buttons (desktop/tap-friendly) */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={gotoPrev}
              className="absolute inset-y-0 left-0 w-1/4 focus:outline-none"
            />
            <button
              aria-label="Next image"
              onClick={gotoNext}
              className="absolute inset-y-0 right-0 w-1/4 focus:outline-none"
            />
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-black/50 text-white px-2 py-1 rounded text-sm`}>
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-semibold text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
              {data.title}
            </h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{Number(data.rating || 0).toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({data.reviewCount || 0})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span dir={isRTL ? 'rtl' : 'ltr'}>{data.location}</span>
          </div>

          {(data.maxGuests || data.minNights) && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {data.maxGuests && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{t('property.up_to_guests', { count: data.maxGuests })}</span>
                </div>
              )}
              {data.minNights && <span>{t('property.min_nights', { count: data.minNights })}</span>}
            </div>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <Card className="p-4 mb-6">
            <p className="text-foreground leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
              {data.description}
            </p>
          </Card>
        )}

        {/* Amenities */}
        {!!amenitiesForRender.length && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('property.what_offers')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {amenitiesForRender.map((amenity, index) => (
                <div key={`${amenity.label}-${index}`} className="flex items-center gap-3">
                  <amenity.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm" dir={isRTL ? 'rtl' : 'ltr'}>{amenity.label}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Host Info (опційно) */}
        {data.host && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={data.host.avatar} />
                  <AvatarFallback>{data.host.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t('property.host', { name: data.host.name })}
                    </h4>
                    {data.host.isVerified && (
                      <Badge variant="secondary" className="text-xs">{t('property.verified')}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {typeof data.host.rating === 'number' && (
                      <>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{data.host.rating}</span>
                        <span>•</span>
                      </>
                    )}
                    {data.host.responseTime && (
                      <span>{t('property.responds_within', { time: data.host.responseTime })}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t('property.contact')}
              </Button>
            </div>
          </Card>
        )}

        {/* Reviews (опційно) */}
        {Array.isArray(data.reviews) && data.reviews.length > 0 && (
          <Card className="p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('property.reviews_title', { count: data.reviewCount || data.reviews.length })}
              </h3>
              <Button variant="ghost" size="sm">
                {t('property.show_all')}
              </Button>
            </div>

            <div className="space-y-4">
              {data.reviews.slice(0, 2).map((review, idx) => (
                <div key={review.id ?? idx}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.user}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating || 0 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>{review.comment}</p>
                  {idx !== Math.min(1, data.reviews.length - 1) && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 sm:relative sm:border-0 sm:bg-transparent sm:p-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">₪{data.price}</span>
                <span className="text-muted-foreground">{t('search.per_night')}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{Number(data.rating || 0).toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({data.reviewCount || 0} {t('search.reviews')})
                </span>
              </div>
            </div>
            <Button size="lg" onClick={onBooking} className="px-8">
              {t('property.book_now')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
