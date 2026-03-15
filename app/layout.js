import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

 

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
export const metadata = {
  title: 'Hiddenleaf | Premium Fashion Store',
  description: 'Production-ready Next.js ecommerce store',
  icons: {
    icon: '/favicon.ico',  // use your existing .ico
  },
};
