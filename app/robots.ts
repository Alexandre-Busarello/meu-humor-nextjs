import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.meuhumor.com.br';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/para-psicologos',
        ],
        disallow: [
          '/api/',
          '/home',
          '/dia/',
          '/historico',
          '/prontuarios',
          '/perfil',
          '/registrar',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

