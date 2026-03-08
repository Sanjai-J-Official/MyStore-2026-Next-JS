import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyStore | Fresh Styles, Real Prices',
  description: 'Production-ready Next.js 14 ecommerce store',
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
            <ToastContainer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
