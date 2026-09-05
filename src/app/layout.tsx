import type { Metadata } from 'next';
import { Inter, Playfair_Display, Great_Vibes } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-great-vibes' });

export const metadata: Metadata = {
  title: 'chitoria.dev — Hyper-Personalized AI Birthday Wishes',
  description:
    'Schedule unforgettable AI birthday roasts, sentimental digital time-capsules, and collaborative group boards delivered at exact local midnight.',
  keywords: [
    'birthday wish',
    'AI birthday roast',
    'scheduled birthday message',
    'birthday reminder',
    'collaborative birthday card',
    'chitoria.dev',
  ],
  openGraph: {
    title: 'chitoria.dev — The Birthday Wish They’ll Never Live Down',
    description:
      'Schedule hyper-personalized AI roasts or tearjerkers in under 2 minutes. 100% free serverless delivery.',
    url: 'https://chitoria.dev',
    siteName: 'chitoria.dev',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${playfair.variable} ${greatVibes.variable}`}>
      <body className="min-h-full flex flex-col text-black antialiased selection:bg-rose-500 selection:text-white font-sans">
        <SplashScreen />
        <ToastProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
