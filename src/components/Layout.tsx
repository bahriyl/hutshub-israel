import { Search, Menu, User, Heart, Home, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { t, language, setLanguage, isRTL } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };
  
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">Hutshub</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('host')}
              className="hidden sm:flex"
            >
              {t('layout.become_host')}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2">
        <div className="flex justify-around items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-col gap-1 h-auto py-2 ${currentPage === 'search' ? 'text-green-600' : 'text-muted-foreground'}`}
            onClick={() => onNavigate('search')}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">{t('layout.search')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-col gap-1 h-auto py-2 ${currentPage === 'favorites' ? 'text-green-600' : 'text-muted-foreground'}`}
            onClick={() => onNavigate('favorites')}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">{t('layout.favorites')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-col gap-1 h-auto py-2 ${currentPage === 'host' ? 'text-green-600' : 'text-muted-foreground'}`}
            onClick={() => onNavigate('host')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">{t('layout.host')}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-col gap-1 h-auto py-2 ${currentPage === 'profile' ? 'text-green-600' : 'text-muted-foreground'}`}
            onClick={() => onNavigate('profile')}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">{t('layout.profile')}</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}