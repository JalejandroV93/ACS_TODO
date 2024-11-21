// @ts-expect-error no types for workbox
self.__WB_MANIFEST

const DB_NAME = 'TodoDB';
const STORE_NAME = 'todos';
const PENDING_STORE = 'pending';

let db;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        db.createObjectStore(PENDING_STORE, { autoIncrement: true });
      }
    };
  });
};

self.addEventListener('activate', (event) => {
  event.waitUntil(initDB());
  // Forzar la activación inmediata
  event.waitUntil(self.clients.claim());
});

self.addEventListener('online', async () => {
  syncPendingOperations();
});

async function syncPendingOperations() {
  if (!db) await initDB();
  
  const tx = db.transaction(PENDING_STORE, 'readwrite');
  const store = tx.objectStore(PENDING_STORE);
  const operations = await store.getAll();

  for (const operation of operations) {
    try {
      const response = await fetch(operation.request.url, {
        method: operation.request.method,
        headers: { 'Content-Type': 'application/json' },
        body: operation.request.body
      });

      if (response.ok) {
        // Si la operación fue exitosa, eliminarla del store
        await store.delete(operation.id);
      }
    } catch (error) {
      console.error('Failed to sync operation:', error);
    }
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/todos')) {
    event.respondWith(handleTodosRequest(event.request));
  }
});

async function handleTodosRequest(request) {
  if (!db) await initDB();

  try {
    const response = await fetch(request);
    if (response.ok) {
      if (request.method === 'GET') {
        const data = await response.clone().json();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        data.forEach(todo => store.put(todo));
      }
      return response;
    }
  } catch (error) {
    console.log('Offline mode, using cached data');
  }

  if (request.method === 'GET') {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const todos = await store.getAll();
    return new Response(JSON.stringify(todos), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    const data = await request.json();
    const operation = {
      request: {
        url: request.url,
        method: request.method,
        body: JSON.stringify(data)
      }
    };

    // Guardar la operación pendiente
    const pendingTx = db.transaction(PENDING_STORE, 'readwrite');
    const pendingStore = pendingTx.objectStore(PENDING_STORE);
    await pendingStore.add(operation);

    // Actualizar la UI localmente
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    if (request.method === 'POST') {
      const tempId = Date.now();
      await store.add({ ...data, id: tempId });
      return new Response(JSON.stringify({ ...data, id: tempId }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (request.method === 'PUT') {
      await store.put(data);
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (request.method === 'DELETE') {
      await store.delete(data.id);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}