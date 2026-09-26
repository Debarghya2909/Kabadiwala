import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

function ttsProxyPlugin(): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/tts')) {
      return next();
    }
    try {
      const parsedUrl = new URL(req.url, 'http://localhost:3000');
      const text = parsedUrl.searchParams.get('text') || '';
      const lang = parsedUrl.searchParams.get('lang') || 'bn';
      if (!text) {
        res.statusCode = 400;
        res.end('Missing text query parameter');
        return;
      }

      const sampleText = text.slice(0, 180);
      const targetLang = lang === 'bn' ? 'bn' : lang === 'hi' ? 'hi' : 'en';
      const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${encodeURIComponent(sampleText)}`;

      const upstreamRes = await fetch(googleUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      });

      if (!upstreamRes.ok) {
        res.statusCode = upstreamRes.status;
        res.end(`TTS upstream error: ${upstreamRes.statusText}`);
        return;
      }

      const buffer = Buffer.from(await upstreamRes.arrayBuffer());
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(buffer);
    } catch (err: any) {
      console.error('TTS proxy error:', err);
      res.statusCode = 500;
      res.end('Internal server error in TTS proxy');
    }
  };

  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    ttsProxyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: process.env.STANDALONE_BUILD ? 'dist' : path.resolve(import.meta.dirname, '../../dist'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});

