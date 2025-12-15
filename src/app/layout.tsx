'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';
import SubHeader from '@/components/SubHeader';
import { usePathname } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'Giftopia',
//   description: 'The perfect gift for every occasion.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin-secret-sam01');

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Giftopia</title>
        <meta
          name="description"
          content="The perfect gift for every occasion."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {!isAdminPage && <Header />}
              {!isAdminPage && <SubHeader />}
              <main className="flex-grow">{children}</main>
              {!isAdminPage && <Footer />}
            </div>
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
