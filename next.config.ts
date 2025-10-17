import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip type checking and linting during production build
  // (these should be done in CI/CD or locally before deploy)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Redirects para URLs antigas do site anterior
  async redirects() {
    return [
      // Redirects específicos para páginas equivalentes
      {
        source: '/profissionais',
        destination: '/para-psicologos',
        permanent: true, // 301 redirect
      },
      {
        source: '/profissionais/',
        destination: '/para-psicologos',
        permanent: true,
      },
      
      // Posts/artigos antigos por ano (2011-2025)
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:slug*',
        destination: '/',
        permanent: true,
      },
      
      // Artigos antigos em geral
      {
        source: '/artigos/:slug*',
        destination: '/',
        permanent: true,
      },
      
      // Páginas antigas que não existem mais
      {
        source: '/termos',
        destination: '/',
        permanent: true,
      },
      {
        source: '/privacidade',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contato',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sobre',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/',
        permanent: true,
      },
      
      // Categorias antigas
      {
        source: '/categoria/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/',
        permanent: true,
      },
      
      // Tags antigas
      {
        source: '/tag/:slug*',
        destination: '/',
        permanent: true,
      },
      
      // Autor(es)
      {
        source: '/author/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/autor/:slug*',
        destination: '/',
        permanent: true,
      },
      
      // Feeds RSS antigos
      {
        source: '/feed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/',
        permanent: true,
      },
      
      // Páginas de arquivo/busca antigas
      {
        source: '/arquivo/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/search',
        destination: '/',
        permanent: true,
      },
      {
        source: '/busca',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
