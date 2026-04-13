import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCart from '@/components/FloatingCart';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://fromthehiddenleafstore.com'),
  title: {
    default: 'Hidden Leaf | Premium Handcrafted & Wooden Products',
    template: '%s | Hidden Leaf',
  },
  description:
    'Discover rare, handmade, and premium wooden products sourced from hidden artisans across India. Corporate gifting, artisan collections & limited editions.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hidden Leaf | Premium Handcrafted & Wooden Products',
    description:
      'Discover rare, handmade, and premium wooden products sourced from hidden artisans across India.',
    url: 'https://fromthehiddenleafstore.com',
    siteName: 'Hidden Leaf Store',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Hidden Leaf Store',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden Leaf | Premium Handcrafted & Wooden Products',
    description:
      'Discover rare, handmade, and premium wooden products sourced from hidden artisans across India.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <div className="page-container">
              <Navbar />
              <main className="main-content">{children}</main>
              <Footer />
            </div>
            <FloatingCart />
            <ToastContainer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
