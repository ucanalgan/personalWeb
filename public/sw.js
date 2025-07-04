// Service Worker for Portfolio PWA
const CACHE_NAME = 'ucanalgan-portfolio-v2.0.1';
const OFFLINE_URL = '/offline.html';

// Resources to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/favicon.svg',
  '/manifest.json'
];

// Resources to cache on first use
const RUNTIME_CACHE_URLS = [
  '/components/',
  '/js/',
  '/utils/',
  '/assets/'
];

// CDN resources
const CDN_CACHE_URLS = [
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
];

// API endpoints to cache
const API_CACHE_URLS = [
  'https://api.github.com/users/ucanalgan'
];

/**
 * Service Worker Install Event
 */
self.addEventListener('install', (event) => {
  console.log('💾 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache static resources
        await cache.addAll(STATIC_CACHE_URLS);
        console.log('✅ Static resources cached');
        
        // Cache CDN resources
        for (const url of CDN_CACHE_URLS) {
          try {
            await cache.add(url);
          } catch (error) {
            console.warn(`⚠️ Failed to cache CDN resource: ${url}`, error);
          }
        }
        
        // Skip waiting to activate immediately
        self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Service Worker install failed:', error);
      }
    })()
  );
});

/**
 * Service Worker Activate Event
 */
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log(`🗑️ Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
        
        // Take control of all clients
        await self.clients.claim();
        
        console.log('✅ Service Worker activated');
        
      } catch (error) {
        console.error('❌ Service Worker activation failed:', error);
      }
    })()
  );
});

/**
 * Service Worker Fetch Event
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests that we don't want to cache
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('cdn.jsdelivr.net') &&
      !url.hostname.includes('api.github.com')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch requests with caching strategy
 */
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First (for static assets)
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First (for API calls)
    if (isApiRequest(url.hostname)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (for HTML pages)
    if (isNavigationRequest(request)) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network First
    return await networkFirst(request);
    
  } catch (error) {
    console.error('❌ Fetch failed:', error);
    return await handleOffline(request);
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

/**
 * Network First Strategy
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached version immediately if available
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || await fetchPromise;
}

/**
 * Handle offline scenarios
 */
async function handleOffline(request) {
  if (isNavigationRequest(request)) {
    const cachedPage = await caches.match('/');
    if (cachedPage) {
      return cachedPage;
    }
  }
  
  // Return cached version if available
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline fallback
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(pathname) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

/**
 * Check if request is for API
 */
function isApiRequest(hostname) {
  return hostname.includes('api.github.com') || 
         hostname.includes('formspree.io') ||
         hostname.includes('api.');
}

/**
 * Check if request is for navigation
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

/**
 * Background Sync for offline form submissions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

/**
 * Sync contact form submissions when back online
 */
async function syncContactForm() {
  try {
    // Get stored form submissions from IndexedDB
    const submissions = await getStoredSubmissions();
    
    for (const submission of submissions) {
      try {
        const response = await fetch(submission.url, {
          method: 'POST',
          headers: submission.headers,
          body: submission.body
        });
        
        if (response.ok) {
          await removeStoredSubmission(submission.id);
          console.log('✅ Form submission synced successfully');
        }
      } catch (error) {
        console.error('❌ Failed to sync form submission:', error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

/**
 * Push notification handling
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey
    },
    actions: [
      {
        action: 'explore',
        title: 'Visit Portfolio',
        icon: '/assets/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification click handling
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Message handling from main thread
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

/**
 * Helper functions for IndexedDB operations
 */
async function getStoredSubmissions() {
  // IndexedDB implementation for storing form submissions
  return [];
}

async function removeStoredSubmission(id) {
  // IndexedDB implementation for removing synced submissions
  return true;
}

/**
 * Periodic background sync
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

/**
 * Update cache periodically
 */
async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Update GitHub API data
    for (const url of API_CACHE_URLS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to update cache for: ${url}`);
      }
    }
    
    console.log('✅ Cache updated successfully');
  } catch (error) {
    console.error('❌ Cache update failed:', error);
  }
}

console.log('🚀 Service Worker loaded successfully'); 