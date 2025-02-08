import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StorageProvider } from '@/contexts/storage-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Management Tools',
  description: 'A comprehensive management tool for links, PCs, and todos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StorageProvider>
          {children}
        </StorageProvider>
      </body>
    </html>
  );
}