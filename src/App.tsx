import { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { SearchScreen } from './components/SearchScreen';
import { PropertyDetail } from './components/PropertyDetail';
import { BookingFlow } from './components/BookingFlow';
import { HostDashboard } from './components/HostDashboard';
import { AddProperty } from './components/AddProperty';

type AppView = 
  | 'search'
  | 'property-detail'
  | 'booking'
  | 'host'
  | 'add-property'
  | 'favorites'
  | 'profile';

function FavoritesView() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('favorites.title')}</h2>
      <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
        {t('favorites.empty')}
      </p>
    </div>
  );
}

function ProfileView() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4" dir={isRTL ? 'rtl' : 'ltr'}>{t('profile.title')}</h2>
      <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
        {t('profile.description')}
      </p>
    </div>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('search');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setCurrentView('property-detail');
  };

  const handleBooking = () => {
    setCurrentView('booking');
  };

  const handleBookingComplete = () => {
    setCurrentView('search');
  };

  const handleAddProperty = () => {
    setCurrentView('add-property');
  };

  const handleAddPropertyComplete = () => {
    setCurrentView('host');
  };

  const handleBack = () => {
    switch (currentView) {
      case 'property-detail':
        setCurrentView('search');
        break;
      case 'booking':
        setCurrentView('property-detail');
        break;
      case 'add-property':
        setCurrentView('host');
        break;
      default:
        setCurrentView('search');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <SearchScreen onPropertySelect={handlePropertySelect} />;
      
      case 'property-detail':
        return (
          <PropertyDetail
            propertyId={selectedPropertyId}
            onBack={handleBack}
            onBooking={handleBooking}
          />
        );
      
      case 'booking':
        return (
          <BookingFlow
            propertyId={selectedPropertyId}
            onBack={handleBack}
            onComplete={handleBookingComplete}
          />
        );
      
      case 'host':
        return <HostDashboard onAddProperty={handleAddProperty} />;
      
      case 'add-property':
        return (
          <AddProperty
            onBack={handleBack}
            onComplete={handleAddPropertyComplete}
          />
        );
      
      case 'favorites':
        return <FavoritesView />;
      
      case 'profile':
        return <ProfileView />;
      
      default:
        return <SearchScreen onPropertySelect={handlePropertySelect} />;
    }
  };

  // Don't show layout for certain full-screen views
  const isFullScreenView = ['property-detail', 'booking', 'add-property'].includes(currentView);

  if (isFullScreenView) {
    return renderCurrentView();
  }

  return (
    <Layout currentPage={currentView} onNavigate={handleNavigate}>
      {renderCurrentView()}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}