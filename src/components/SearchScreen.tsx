import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Filter, Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchScreenProps {
  onPropertySelect: (propertyId: string) => void;
}

export function SearchScreen({ onPropertySelect }: SearchScreenProps) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      id: '1',
      title: isRTL ? 'צימר רומנטי בגליל' : 'Romantic Cabin in Galilee',
      location: isRTL ? 'רמת הגולן' : 'Golan Heights',
      price: 450,
      rating: 4.8,
      reviewCount: 23,
      image: 'https://images.unsplash.com/photo-1667839949220-12101dcf842b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FiaW4lMjBuYXR1cmUlMjBpc3JhZWwlMjBjb3VudHJ5c2lkZXxlbnwxfHx8fDE3NTc2Mjc5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      amenities: isRTL ? ['ג\'קוזי', 'ברביקיו', 'מט"מ'] : ['Jacuzzi', 'BBQ', 'Safe Room'],
      isNew: true
    },
    {
      id: '2',
      title: isRTL ? 'בקתה מודרנית עם נוף' : 'Modern Cabin with View',
      location: isRTL ? 'הר מירון' : 'Mount Meron',
      price: 520,
      rating: 4.9,
      reviewCount: 41,
      image: 'https://images.unsplash.com/photo-1583073180990-5c3cec896031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWJpbiUyMGphY3V6emklMjBtb3VudGFpbiUyMHZpZXd8ZW58MXx8fHwxNzU3NjI3OTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      amenities: isRTL ? ['בריכה', 'ג\'קוזי', 'כושר'] : ['Pool', 'Jacuzzi', 'Gym'],
      isNew: false
    },
    {
      id: '3',
      title: isRTL ? 'וילה יוקרתית ביער' : 'Luxury Villa in Forest',
      location: isRTL ? 'יער ירושלים' : 'Jerusalem Forest',
      price: 680,
      rating: 4.7,
      reviewCount: 15,
      image: 'https://images.unsplash.com/photo-1585614733378-4c58f92de4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYWJpbiUyMHBvb2wlMjBmb3Jlc3R8ZW58MXx8fHwxNzU3NjI3OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      amenities: isRTL ? ['בריכה', 'ברביקיו', 'ידידותי לחיות'] : ['Pool', 'BBQ', 'Pet Friendly'],
      isNew: false
    }
  ];

  const categories = [
    { name: t('category.romantic'), icon: '💕' },
    { name: t('category.family'), icon: '👨‍👩‍👧‍👦' },
    { name: t('category.dogs'), icon: '🐕' },
    { name: t('category.luxury'), icon: '✨' },
    { name: t('category.view'), icon: '🏔️' },
    { name: t('category.jacuzzi'), icon: '🛁' }
  ];

  return (
    <div className="pb-20 sm:pb-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search Header */}
      <div className="bg-white px-4 py-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5`} />
            <Input
              placeholder={t('search.where_to_go')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Quick Search Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <MapPin className="w-4 h-4" />
              <span>{t('search.where')}</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Calendar className="w-4 h-4" />
              <span>{t('search.when')}</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Users className="w-4 h-4" />
              <span>{t('search.how_many')}</span>
            </Button>
          </div>

          {/* Filter Button */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('search.filters')}
            </Button>
            <span className="text-sm text-muted-foreground">
              {properties.length} {t('search.properties_count')}
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="flex-shrink-0 gap-2 h-10"
              >
                <span>{category.icon}</span>
                <span className="whitespace-nowrap">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onPropertySelect(property.id)}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-white/80 hover:bg-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>

                  {/* New Badge */}
                  {property.isNew && (
                    <Badge className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-green-500`}>
                      {t('search.new')}
                    </Badge>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-foreground line-clamp-1" dir={isRTL ? 'rtl' : 'ltr'}>
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{property.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                    {property.location}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {property.reviewCount} {t('search.reviews')}
                    </span>
                    <div className={`${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="font-semibold">₪{property.price}</span>
                      <span className="text-sm text-muted-foreground"> {t('search.per_night')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}