// Dosyanın en üstündeki import'lardan SocketProvider'ı kaldırıyoruz.
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
// import { SocketProvider } from '@/contexts/SocketContext'; // BU SATIRI SİLİYORUZ
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Chat Application',
  description: 'A sleek and modern chat application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <SocketProvider> // BU SARMALAYICIYI KALDIRIYORUZ */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={true}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        {/* </SocketProvider> // BU SARMALAYICIYI KALDIRIYORUZ */}
      </body>
    </html>
  );
}