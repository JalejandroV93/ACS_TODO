import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ToDo App ACS',
    short_name: 'ToDo ACS',
    description: 'Aplicación de lista de tareas para la clase ACS',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#18181b', // Color del tema oscuro de Zinc usado en tu app
    orientation: 'portrait',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-384x384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    prefer_related_applications: false,
    
  }
}