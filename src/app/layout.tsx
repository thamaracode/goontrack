import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GOONTRACK — Personal Habit Arcade',
  description: 'Private personal habit/session tracker disguised as a playful arcade statistics app.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GOONTRACK',
  },
};

export const viewport: Viewport = {
  themeColor: '#100B1F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#100B1F] text-[#F8FAFC] min-h-screen selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
