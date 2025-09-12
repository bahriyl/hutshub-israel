import { useState } from 'react';
import { Plus, Calendar, TrendingUp, Users, Star, Phone, MessageCircle, Edit, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

interface HostDashboardProps {
  onAddProperty: () => void;
}

export function HostDashboard({ onAddProperty }: HostDashboardProps) {
  const { t, isRTL } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const hostData = {
    name: isRTL ? 'יוסי כהן' : 'Yossi Cohen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4.9,
    reviewCount: 47,
    responseTime: t('property.within_hour'),
    subscriptionStatus: 'trial', // trial, active, expired
    trialDaysLeft: 45
  };

  const stats = {
    totalBookings: 12,
    thisMonthRevenue: 8400,
    occupancyRate: 78,
    avgRating: 4.8
  };

  const properties = [
    {
      id: '1',
      title: isRTL ? 'צימר רומנטי בגליל' : 'Romantic Cabin in Galilee',
      location: isRTL ? 'רמת הגולן' : 'Golan Heights',
      price: 450,
      status: 'active',
      bookings: 8,
      revenue: 5400,
      rating: 4.8,
      reviews: 23,
      image: 'https://images.unsplash.com/photo-1667839949220-12101dcf842b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FiaW4lMjBuYXR1cmUlMjBpc3JhZWwlMjBjb3VudHJ5c2lkZXxlbnwxfHx8fDE3NTc2Mjc5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      title: isRTL ? 'בקתה מודרנית עם נוף' : 'Modern Cabin with View',
      location: isRTL ? 'הר מירון' : 'Mount Meron',
      price: 520,
      status: 'pending',
      bookings: 4,
      revenue: 3000,
      rating: 4.9,
      reviews: 15,
      image: 'https://images.unsplash.com/photo-1583073180990-5c3cec896031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWJpbiUyMGphY3V6emklMjBtb3VudGFpbiUyMHZpZXd8ZW58MXx8fHwxNzU3NjI3OTgwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const bookings = [
    {
      id: '1',
      guest: isRTL ? 'שרה לוי' : 'Sarah Levy',
      property: isRTL ? 'צימר רומנטי בגליל' : 'Romantic Cabin in Galilee',
      dates: '15-17/02/2024',
      guests: 2,
      total: 980,
      status: 'confirmed'
    },
    {
      id: '2',
      guest: isRTL ? 'דני מזרחי' : 'Danny Mizrahi',
      property: isRTL ? 'בקתה מודרנית עם נוף' : 'Modern Cabin with View',
      dates: '20-22/02/2024',
      guests: 4,
      total: 1120,
      status: 'pending'
    },
    {
      id: '3',
      guest: isRTL ? 'רונית כהן' : 'Ronit Cohen',
      property: isRTL ? 'צימר רומנטי בגליל' : 'Romantic Cabin in Galilee',
      dates: '25-27/02/2024',
      guests: 2,
      total: 980,
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return t('host.confirmed');
      case 'pending': return t('host.pending');
      case 'cancelled': return t('host.cancelled');
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={hostData.avatar} />
                <AvatarFallback>{hostData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t('host.hello', { name: hostData.name })}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{hostData.rating}</span>
                  <span>•</span>
                  <span>{hostData.reviewCount} {t('search.reviews')}</span>
                </div>
              </div>
            </div>
            <Button onClick={onAddProperty}>
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('host.add_property')}
            </Button>
          </div>

          {/* Subscription Status */}
          {hostData.subscriptionStatus === 'trial' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-900" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t('host.trial_period')}
                  </h3>
                  <p className="text-sm text-blue-700" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t('host.trial_days_left', { days: hostData.trialDaysLeft })}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('host.upgrade_now')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('host.overview')}</TabsTrigger>
            <TabsTrigger value="properties">{t('host.my_properties')}</TabsTrigger>
            <TabsTrigger value="bookings">{t('host.bookings')}</TabsTrigger>
            <TabsTrigger value="calendar">{t('host.calendar')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{stats.totalBookings}</p>
                    <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t('host.monthly_bookings')}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">₪{stats.thisMonthRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t('host.monthly_revenue')}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{stats.occupancyRate}%</p>
                    <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t('host.occupancy')}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{stats.avgRating}</p>
                    <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t('host.avg_rating')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>{t('host.recent_bookings')}</h3>
                <Button variant="ghost" size="sm">{t('property.show_all')}</Button>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{booking.guest.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{booking.guest}</p>
                        <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                          {booking.dates}
                        </p>
                      </div>
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                      <p className="text-sm font-medium mt-1">₪{booking.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id} className="p-4">
                <div className="flex gap-4">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{property.title}</h3>
                        <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                          {property.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('host.price_per_night')}</p>
                        <p className="font-medium">₪{property.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('host.bookings')}</p>
                        <p className="font-medium">{property.bookings}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('host.revenue')}</p>
                        <p className="font-medium">₪{property.revenue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('host.rating')}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{property.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <Badge 
                        variant={property.status === 'active' ? 'default' : 'secondary'}
                      >
                        {property.status === 'active' ? t('host.active') : t('host.pending_approval')}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {t('host.manage_calendar')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {properties.length === 0 && (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('host.no_properties')}</h3>
                <p className="text-muted-foreground mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t('host.no_properties_desc')}
                </p>
                <Button onClick={onAddProperty}>{t('host.add_first_property')}</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium" dir={isRTL ? 'rtl' : 'ltr'}>{booking.guest}</h3>
                    <p className="text-sm text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                      {booking.property}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">{t('booking.dates')}</p>
                    <p className="font-medium">{booking.dates}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('booking.guests')}</p>
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('booking.total')}</p>
                    <p className="font-medium">₪{booking.total}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">{t('host.reject_booking')}</Button>
                    <Button size="sm">{t('host.approve_booking')}</Button>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="p-8 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2" dir={isRTL ? 'rtl' : 'ltr'}>{t('host.calendar_coming_soon')}</h3>
              <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
                {t('host.calendar_description')}
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}