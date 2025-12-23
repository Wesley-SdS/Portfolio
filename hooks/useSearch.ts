import { useState, useMemo, useCallback } from 'react';
import { searchAll, SearchResult } from '@/lib/search';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return searchAll(query);
  }, [query]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(searchQuery.length >= 2);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setIsOpen(false);
  }, []);

  return {
    query,
    results,
    isOpen,
    handleSearch,
    clearSearch,
    setIsOpen,
  };
}

