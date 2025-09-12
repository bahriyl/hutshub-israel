import { useState } from 'react';
import { ArrowRight, Star, Heart, Share, MapPin, Users, Wifi, Car, Utensils, Waves, Shield, Phone } from 'lucide-react';
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

export function PropertyDetail({ propertyId, onBack, onBooking }: PropertyDetailProps) {
  const { t, isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock property data
  const property = {
    id: propertyId,
    title: isRTL ? 'צימר רומנטי בגליל' : 'Romantic Cabin in Galilee',
    location: isRTL ? 'רמת הגולן, צפון' : 'Golan Heights, North',
    price: 450,
    rating: 4.8,
    reviewCount: 23,
    images: [
      'https://images.unsplash.com/photo-1667839949220-12101dcf842b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FiaW4lMjBuYXR1cmUlMjBpc3JhZWwlMjBjb3VudHJ5c2lkZXxlbnwxfHx8fDE3NTc2Mjc5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1583073180990-5c3cec896031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWJpbiUyMGphY3V6emklMjBtb3VudGFpbiUyMHZpZXd8ZW58MXx8fHwxNzU3NjI3OTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1585614733378-4c58f92de4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYWJpbiUyMHBvb2wlMjBmb3Jlc3R8ZW58MXx8fHwxNzU3NjI3OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: isRTL 
      ? 'צימר יוקרתי ורומנטי הממוקם ברמת הגולן, מציע נוף עוצר נשימה של הרים וירק. הצימר כולל ג\'קוזי פרטי, מיטה זוגית נוחה, מטבחון מאובזר וטרסה פרטית. המקום מושלם לזוגות המחפשים בריחה רומנטית ושקטה.'
      : 'A luxurious romantic cabin located in the Golan Heights, offering breathtaking views of mountains and greenery. The cabin includes a private jacuzzi, comfortable double bed, equipped kitchenette, and private terrace. Perfect for couples seeking a romantic and peaceful getaway.',
    amenities: [
      { icon: Waves, name: t('amenity.private_jacuzzi') },
      { icon: Wifi, name: t('amenity.wifi') },
      { icon: Car, name: t('amenity.parking') },
      { icon: Utensils, name: t('amenity.kosher_kitchen') },
      { icon: Shield, name: t('amenity.mamad') },
      { icon: Phone, name: t('amenity.service_24_7') }
    ],
    maxGuests: 2,
    minNights: 2,
    host: {
      name: isRTL ? 'יוסי כהן' : 'Yossi Cohen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.9,
      responseTime: t('property.within_hour'),
      isVerified: true
    },
    reviews: [
      {
        id: 1,
        user: isRTL ? 'שרה ל.' : 'Sarah L.',
        rating: 5,
        date: '2024-01-15',
        comment: isRTL 
          ? 'מקום מדהים! הג\'קוזי היה פשוט חלום והנוף בלתי נשכח. היינו 3 ימים של רומנטיקה צרופה.'
          : 'Amazing place! The jacuzzi was simply a dream and the view unforgettable. We had 3 days of pure romance.'
      },
      {
        id: 2,
        user: isRTL ? 'דני מ.' : 'Danny M.',
        rating: 5,
        date: '2024-01-08',
        comment: isRTL 
          ? 'יוסי מארח מושלם, הצימר נקי ומאובזר בכל מה שצריך. בהחלט נחזור!'
          : 'Yossi is a perfect host, the cabin is clean and equipped with everything needed. We\'ll definitely return!'
      }
    ]
  };

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
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-black/50 text-white px-2 py-1 rounded text-sm`}>
          {currentImageIndex + 1} / {property.images.length}
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-semibold text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
              {property.title}
            </h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-sm text-muted-foreground">({property.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span dir={isRTL ? 'rtl' : 'ltr'}>{property.location}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{t('property.up_to_guests', { count: property.maxGuests })}</span>
            </div>
            <span>{t('property.min_nights', { count: property.minNights })}</span>
          </div>
        </div>

        {/* Description */}
        <Card className="p-4 mb-6">
          <p className="text-foreground leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
            {property.description}
          </p>
        </Card>

        {/* Amenities */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('property.what_offers')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3">
                <amenity.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm" dir={isRTL ? 'rtl' : 'ltr'}>{amenity.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Host Info */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={property.host.avatar} />
                <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t('property.host', { name: property.host.name })}
                  </h4>
                  {property.host.isVerified && (
                    <Badge variant="secondary" className="text-xs">{t('property.verified')}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{property.host.rating}</span>
                  <span>•</span>
                  <span>{t('property.responds_within', { time: property.host.responseTime })}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {t('property.contact')}
            </Button>
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>
              {t('property.reviews_title', { count: property.reviewCount })}
            </h3>
            <Button variant="ghost" size="sm">
              {t('property.show_all')}
            </Button>
          </div>
          
          <div className="space-y-4">
            {property.reviews.slice(0, 2).map((review) => (
              <div key={review.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.user}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>{review.comment}</p>
                {review.id !== property.reviews[property.reviews.length - 1].id && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 sm:relative sm:border-0 sm:bg-transparent sm:p-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">₪{property.price}</span>
                <span className="text-muted-foreground">{t('search.per_night')}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{property.rating}</span>
                <span className="text-muted-foreground">
                  ({property.reviewCount} {t('search.reviews')})
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