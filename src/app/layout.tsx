import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

// Load Inter font for non-Apple devices
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Arshdeep Singh Portfolio',
  description:
    'Interactive portfolio covering my skills and experience',
  keywords: [
    'Arshdeep Singh',
    'Portfolio',
    'Developer',
    'AI',
    'Interactive',
    'Memoji',
    'Web Development',
    'Full Stack',
    'Next.js',
    'React',
  ],
  authors: [
    {
      name: 'Arshdeep Singh',
      url: 'https://arshdeep-singh-portfolio.vercel.app',
    },
  ],
  creator: 'Arshdeep Singh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arshdeep-singh-portfolio.vercel.app',
    title: 'Arshdeep Singh Portfolio',
    description:
      'Interactive portfolio with local answering systems keeping tabs on my skills',
    siteName: 'Arshdeep Singh Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arshdeep Singh Portfolio',
    description:
      'Interactive portfolio covering my skills and experience',
    creator: '@arshdeep71',
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        sizes: 'any',
      },
    ],
    shortcut: '/favicon.svg?v=2',
    apple: '/apple-touch-icon.svg?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased text-foreground',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
