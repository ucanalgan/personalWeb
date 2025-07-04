// Enhanced Service Worker for Performance Optimization
// Version: 2.0.0

const CACHE_NAME = 'portfolio-v2';
const RUNTIME_CACHE = 'runtime-v2';
const IMAGE_CACHE = 'images-v2';
const API_CACHE = 'api-v2';

// Cache strategy configuration
const CACHE_STRATEGIES = {
  // Static assets - Cache first with long TTL
  STATIC_ASSETS: [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg'
  ],
  
  // Cache for different resource types
  CACHE_PATTERNS: {
    // JavaScript and CSS - Stale while revalidate
    ASSETS: /\.(?:js|css|woff2|woff|ttf|eot)$/,
    // Images - Cache first with fallback
    IMAGES: /\.(?:png|jpg|jpeg|gif|svg|webp|avif)$/,
    // API calls - Network first with cache fallback
    API: /\/api\//,
    // CDN resources - Cache first
    CDN: /^https:\/\/(fonts\.googleapis\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)/
  }
};

// Cache durations (in seconds)
const CACHE_DURATION = {
  SHORT: 60 * 60, // 1 hour
  MEDIUM: 60 * 60 * 24, // 1 day  
  LONG: 60 * 60 * 24 * 30, // 30 days
  FOREVER: 60 * 60 * 24 * 365 // 1 year
};

// Install event - Pre-cache critical resources
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      try {
        // Pre-cache critical static assets
        await cache.addAll(CACHE_STRATEGIES.STATIC_ASSETS);
        console.log('SW: Critical assets cached');
        
        // Force activation
        await self.skipWaiting();
      } catch (error) {
        console.warn('SW: Pre-caching failed:', error);
      }
    })()
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name !== CACHE_NAME && 
        name !== RUNTIME_CACHE && 
        name !== IMAGE_CACHE &&
        name !== API_CACHE
      );
      
      await Promise.all(
        oldCaches.map(name => {
          console.log('SW: Deleting old cache:', name);
          return caches.delete(name);
        })
      );
      
      // Take control of all pages
      await self.clients.claim();
      console.log('SW: Activated and took control');
    })()
  );
});

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;
  
  event.respondWith(handleRequest(request));
});

// Main request handler with different strategies
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: CDN Resources - Cache First
    if (CACHE_STRATEGIES.CACHE_PATTERNS.CDN.test(request.url)) {
      return await cacheFirst(request, CACHE_NAME, CACHE_DURATION.FOREVER);
    }
    
    // Strategy 2: Images - Cache First with optimization
    if (CACHE_STRATEGIES.CACHE_PATTERNS.IMAGES.test(request.url)) {
      return await imageOptimizationStrategy(request);
    }
    
    // Strategy 3: JS/CSS Assets - Stale While Revalidate
    if (CACHE_STRATEGIES.CACHE_PATTERNS.ASSETS.test(request.url)) {
      return await staleWhileRevalidate(request, CACHE_NAME, CACHE_DURATION.LONG);
    }
    
    // Strategy 4: API Calls - Network First
    if (CACHE_STRATEGIES.CACHE_PATTERNS.API.test(request.url)) {
      return await networkFirst(request, API_CACHE, CACHE_DURATION.SHORT);
    }
    
    // Strategy 5: HTML Pages - Network First with cache fallback
    if (request.headers.get('accept')?.includes('text/html')) {
      return await networkFirst(request, RUNTIME_CACHE, CACHE_DURATION.MEDIUM);
    }
    
    // Default strategy - Network with cache fallback
    return await networkWithCacheFallback(request);
    
  } catch (error) {
    console.warn('SW: Request failed:', request.url, error);
    return await handleOfflineFallback(request);
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    // Return cached version even if expired
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore network errors for background updates
  });
  
  // Return cached response immediately if available
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    // Don't wait for background update
    fetchPromise;
    return cachedResponse;
  }
  
  // Wait for network if no cache or expired
  return await fetchPromise || cachedResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Image Optimization Strategy
async function imageOptimizationStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const url = new URL(request.url);
  
  // Check for WebP support and optimize accordingly
  const supportsWebP = request.headers.get('accept')?.includes('image/webp');
  
  // Try to get optimized version first
  let optimizedRequest = request;
  if (supportsWebP && !url.pathname.endsWith('.webp')) {
    // Create WebP request if possible
    const webpUrl = url.pathname.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    optimizedRequest = new Request(url.origin + webpUrl, {
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials
    });
  }
  
  // Try cache first
  const cachedResponse = await cache.match(optimizedRequest) || await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Try network
  try {
    const networkResponse = await fetch(optimizedRequest);
    if (networkResponse.ok) {
      await cache.put(optimizedRequest, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    // Fallback to original request
    try {
      const fallbackResponse = await fetch(request);
      if (fallbackResponse.ok) {
        await cache.put(request, fallbackResponse.clone());
        return fallbackResponse;
      }
    } catch (fallbackError) {
      // Return placeholder image
      return await getPlaceholderImage();
    }
  }
}

// Network with Cache Fallback
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache fallback
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Offline Fallback Handler
async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // HTML pages - return cached index.html
  if (request.headers.get('accept')?.includes('text/html')) {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match('/index.html') || new Response('Offline', { status: 503 });
  }
  
  // Images - return placeholder
  if (CACHE_STRATEGIES.CACHE_PATTERNS.IMAGES.test(request.url)) {
    return await getPlaceholderImage();
  }
  
  // Default offline response
  return new Response('Resource not available offline', { 
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Utility Functions

// Check if cached response is expired
function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  const diffSeconds = (now - responseDate) / 1000;
  
  return diffSeconds > maxAge;
}

// Get placeholder image for failed image loads
async function getPlaceholderImage() {
  // Return a simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" 
            text-anchor="middle" dominant-baseline="central">
        Image not available
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background sync for analytics and form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(sendPendingAnalytics());
  }
});

// Send pending analytics data when online
async function sendPendingAnalytics() {
  // Implementation for background analytics sync
  console.log('SW: Syncing pending analytics data');
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_CACHE_STATS':
      event.ports[0].postMessage(getCacheStats());
      break;
    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName);
      break;
    default:
      console.log('SW: Unknown message type:', type);
  }
});

// Get cache statistics
async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    stats[name] = keys.length;
  }
  
  return stats;
}

// Clear specific cache
async function clearSpecificCache(cacheName) {
  if (cacheName) {
    await caches.delete(cacheName);
    console.log('SW: Cleared cache:', cacheName);
  }
}

console.log('SW: Service Worker loaded and ready'); 