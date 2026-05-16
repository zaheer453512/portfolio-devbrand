import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevBrand — Premium Shopify & Full Stack Developer',
  description: 'Professional Shopify development, full stack solutions, and custom software engineering. Premium developer portfolio.',
  keywords: 'Shopify developer, full stack developer, Node.js, Next.js, custom development',
  openGraph: {
    title: 'DevBrand — Premium Developer Portfolio',
    description: 'Premium Shopify & Full Stack Development Services',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-secondary text-white antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid #222',
              borderRadius: '0',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
