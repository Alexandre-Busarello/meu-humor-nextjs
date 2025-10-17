import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.meuhumor.com.br';
  
  // Data de última modificação (você pode tornar isso dinâmico no futuro)
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/para-psicologos`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Páginas autenticadas (com prioridade menor pois requerem login)
    {
      url: `${baseUrl}/home`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/dia`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/historico`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.1,
    },
    {
      url: `${baseUrl}/prontuarios`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.1,
    },
    {
      url: `${baseUrl}/perfil`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.1,
    },
    {
      url: `${baseUrl}/registrar`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.1,
    },
  ];
}

