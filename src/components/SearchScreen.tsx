import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Calendar, Users, Filter, Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { formatISO } from 'date-fns';

interface SearchScreenProps {
  onPropertySelect: (propertyId: string) => void;
}

type Amenity = string;

export interface Property {
  _id: string;                      // повертаємо з бекенда як рядок
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: Amenity[];
  isNew?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export function SearchScreen({ onPropertySelect }: SearchScreenProps) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // нові стани
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [where, setWhere] = useState(''); // alias for searchQuery (keeps UI clarity)

  const [startDate, setStartDate] = useState<string | null>(null); // 'YYYY-MM-DD'
  const [endDate, setEndDate] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);

  const [whereOpen, setWhereOpen] = useState(false);
  const [whenOpen, setWhenOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  // (опціонально) базові категорії залишаємо як є або теж переведемо на API пізніше
  const categories = [
    { id: 'romantic', name: t('category.romantic'), icon: '💕' },
    { id: 'family', name: t('category.family'), icon: '👨‍👩‍👧‍👦' },
    { id: 'dogs', name: t('category.dogs'), icon: '🐕' },
    { id: 'luxury', name: t('category.luxury'), icon: '✨' },
    { id: 'view', name: t('category.view'), icon: '🏔️' },
    { id: 'jacuzzi', name: t('category.jacuzzi'), icon: '🛁' },
  ];

  // дебаунс пошуку (щоб не дергати бекенд на кожен символ)
  const debouncedQuery = useDebouncedValue(searchQuery, 400);

  useEffect(() => {
    const ctrl = new AbortController();
    const fetchProps = async () => {
      try {
        setLoading(true);
        setError(null);
        const qs = new URLSearchParams({
          q: debouncedQuery,
          limit: '30',        // підлаштуйте
          offset: '0',
          lang: isRTL ? 'he' : 'en',
        });
        const res = await fetch(`${API_URL}/properties?${qs.toString()}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as { items: Property[]; total: number };
        setProperties(data.items);
        setTotal(data.total ?? data.items.length);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
    return () => ctrl.abort();
  }, [debouncedQuery, isRTL]);

  function prettyDateRange(s: string | null, e: string | null) {
    if (!s && !e) return '';
    if (s && !e) return s;          // still short
    if (s && e) {
      const start = new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = new Date(e).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${start} → ${end}`;
    }
    return '';
  }

  // Triggered when user presses Enter in search input
  async function triggerImmediateFetch() {
    // we reuse the same fetch logic as useEffect, but avoid waiting for debounce
    await fetchProperties({ q: searchQuery, start: startDate, end: endDate, guests });
  }

  // centralised fetch wrapper so both useEffect and manual trigger use same code
  async function fetchProperties(params: { q?: string; start?: string | null; end?: string | null; guests?: number; offset?: number; limit?: number } = {}) {
    const ctrl = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const qs = new URLSearchParams();
      const q = params.q ?? debouncedQuery;
      if (q) qs.set('q', q);
      if (params.start ?? startDate) qs.set('start', (params.start ?? startDate) as string);
      if (params.end ?? endDate) qs.set('end', (params.end ?? endDate) as string);
      if (typeof (params.guests ?? guests) === 'number') qs.set('guests', String(params.guests ?? guests));
      if (category) qs.set('category', category);
      qs.set('limit', String(params.limit ?? 30));
      qs.set('offset', String(params.offset ?? 0));
      qs.set('lang', isRTL ? 'he' : 'en');

      const res = await fetch(`${API_URL}/properties?${qs.toString()}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { items: Property[]; total: number };
      setProperties(data.items);
      setTotal(data.total ?? data.items.length);
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
    return () => ctrl.abort();
  }

  function Modal({
    open, title, onClose, children, dir,
  }: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    dir: 'rtl' | 'ltr';
  }) {
    if (!open) return null;

    const node = (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        dir={dir}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* centered sheet */}
        <div className="relative z-[10000] w-full max-w-lg bg-white shadow-2xl rounded-2xl p-4 sm:p-6
                        max-h-[85vh] overflow-auto pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );

    return createPortal(node, document.body);
  }

  // useEffect: auto-fetch when debouncedQuery, startDate, endDate, guests, isRTL change
  useEffect(() => {
    // call fetchProperties with current states (debounced q)
    const abortFn = fetchProperties();
    // we don't have AbortController returned here; safe to ignore for simplicity
    return () => {
      // no-op; fetchProperties uses its own controller
    };
  }, [debouncedQuery, startDate, endDate, guests, isRTL, category]);

  useEffect(() => {
    const anyOpen = whereOpen || whenOpen || guestsOpen;
    if (anyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [whereOpen, whenOpen, guestsOpen]);

  return (
    <div className="pb-20 sm:pb-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
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

          {/* Quick Search Buttons (controlled) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* WHEN */}
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 w-full min-w-0 overflow-hidden"
              onClick={() => { setWhenOpen(true); setWhereOpen(false); setGuestsOpen(false); }}
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 min-w-0 basis-0">
                <span className="block truncate">
                  {prettyDateRange(startDate, endDate) || t('search.when')}
                </span>
              </span>
            </Button>

            {/* HOW MANY button */}
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 w-full min-w-0"
              onClick={() => { setGuestsOpen(true); setWhenOpen(false); setWhereOpen(false); }}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block truncate">
                  {guests ? `${guests} ${t('search.guests')}` : t('search.how_many')}
                </span>
              </span>
            </Button>
          </div>

          {/* WHERE modal */}
          <Modal open={whereOpen} title={t('search.where')} onClose={() => setWhereOpen(false)} dir={isRTL ? 'rtl' : 'ltr'}>
            <Input
              placeholder={t('search.where_to_go')}
              value={searchQuery}
              autoFocus
              onChange={(e) => { setSearchQuery(e.target.value); setWhere(e.target.value); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setWhereOpen(false);
                  triggerImmediateFetch?.();
                }
              }}
              className={isRTL ? 'text-right' : 'text-left'}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setWhereOpen(false)}>{t('common.done')}</Button>
            </div>
          </Modal>

          {/* WHEN modal */}
          <Modal open={whenOpen} title={t('search.when')} onClose={() => setWhenOpen(false)} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate ?? ''}
                onChange={(e) => setStartDate(e.target.value || null)}
                className="border p-2 rounded flex-1"
                aria-label="Start date"
              />
              <input
                type="date"
                value={endDate ?? ''}
                onChange={(e) => setEndDate(e.target.value || null)}
                className="border p-2 rounded flex-1"
                aria-label="End date"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => { setStartDate(null); setEndDate(null); }}>
                {t('search.clear')}
              </Button>
              <Button variant="ghost" onClick={() => setWhenOpen(false)}>{t('common.done')}</Button>
            </div>
          </Modal>

          {/* HOW MANY modal */}
          <Modal open={guestsOpen} title={t('search.how_many')} onClose={() => setGuestsOpen(false)} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between">
              <div className="text-sm">{t('search.guests')}</div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setGuests((g) => Math.max(1, g - 1))} variant="outline">−</Button>
                <div className="w-8 text-center">{guests}</div>
                <Button onClick={() => setGuests((g) => Math.min(16, g + 1))} variant="outline">+</Button>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setGuests(0)}>{t('search.clear')}</Button>
              <Button variant="ghost" onClick={() => setGuestsOpen(false)}>{t('common.done')}</Button>
            </div>
          </Modal>

          {/* Filter Button + count */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('search.filters')}
            </Button>

            <span className="text-sm text-muted-foreground">
              {loading ? t('common.loading') : error ? t('common.error') : `${total} ${t('search.properties_count')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((c) => {
              const selected = category === c.id;
              return (
                <Button
                  key={c.id}
                  variant={selected ? 'default' : 'outline'}
                  className="flex-shrink-0 gap-2 h-10"
                  onClick={() => setCategory(selected ? null : c.id)}
                  aria-pressed={selected}
                >
                  <span>{c.icon}</span>
                  <span className="whitespace-nowrap">{c.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="text-sm text-red-600 py-6">{t('common.failed_to_load')}</div>
          )}
          {loading && !properties.length && (
            <div className="py-6 text-sm text-muted-foreground">{t('common.loading')}…</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Card
                key={property._id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onPropertySelect(property._id)}
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
                    onClick={(e) => e.stopPropagation()}
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
                      <span>{property.rating?.toFixed?.(1) ?? property.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                    {property.location}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(property.amenities || []).slice(0, 3).map((amenity) => (
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

/** debounce hook */
function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<number | undefined>();
  useEffect(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timerRef.current);
  }, [value, delay]);
  return debounced;
}
