
import { useState, useEffect, useCallback, RefObject, useRef } from 'react';

export function useInfiniteScroll<T>(
  fetchData: (cursor?: string) => Promise<{ items: T[], nextCursor?: string }>,
  targetRef?: RefObject<HTMLElement | null>,
  threshold: number = 300
) {
  const [data, setData] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Use ref to track loading state in closures (event listeners)
  const loadingRef = useRef(false);

  // Use refs to keep functions stable even if fetchData changes
  const fetchDataRef = useRef(fetchData);
  const attemptedInitialLoad = useRef(false);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    setLoading(true);
    loadingRef.current = true;
    
    try {
      const { items, nextCursor } = await fetchDataRef.current(cursor);
      
      if (!Array.isArray(items)) {
        console.error('useInfiniteScroll: items is not an array', items);
        setHasMore(false);
        return;
      }
      
      if (items.length === 0 || !nextCursor) {
        setHasMore(false);
      } else {
        setCursor(nextCursor);
      }
      
      setData(prev => {
        const newItems = items.filter(item => {
            const id = (item as any).id;
            return !prev.some(p => (p as any).id === id);
        });
        if (newItems.length === 0) return prev;
        return [...prev, ...newItems];
      });
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [cursor, hasMore]);

  const refresh = useCallback(async () => {
      if (loadingRef.current) return;
      
      setLoading(true);
      loadingRef.current = true;
      attemptedInitialLoad.current = true;
      
      try {
          const { items, nextCursor } = await fetchDataRef.current(undefined);
          setData(items);
          setCursor(nextCursor);
          setHasMore(!!nextCursor);
      } catch (error) {
          console.error("Refresh failed", error);
      } finally {
          setLoading(false);
          loadingRef.current = false;
      }
  }, []);

  // Initial load
  useEffect(() => {
    if (!attemptedInitialLoad.current && !cursor && data.length === 0) {
      attemptedInitialLoad.current = true;
      loadMore();
    }
  }, [loadMore, cursor, data.length]);

  useEffect(() => {
    let target: HTMLElement | Window | null = targetRef?.current || null;
    
    if (!target) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) target = mainContent;
        else target = window;
    }

    const isWindow = target === window;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (loadingRef.current || !hasMore) {
            ticking = false;
            return;
          }

          let scrollTop = 0;
          let clientHeight = 0;
          let scrollHeight = 0;

          if (isWindow) {
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            clientHeight = window.innerHeight;
            scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
          } else {
            const el = target as HTMLElement;
            scrollTop = el.scrollTop;
            clientHeight = el.clientHeight;
            scrollHeight = el.scrollHeight;
          }

          if (scrollHeight - scrollTop - clientHeight < threshold) {
            loadMore();
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    target!.addEventListener('scroll', onScroll, { passive: true });
    return () => target!.removeEventListener('scroll', onScroll);
  }, [loadMore, hasMore, targetRef, threshold]);

  // Function to prepend new items (e.g. from websocket)
  const addNewItems = useCallback((newItems: T[]) => {
      setData(prev => [...newItems, ...prev]);
  }, []);

  return { data, loading, hasMore, addNewItems, refresh };
}
