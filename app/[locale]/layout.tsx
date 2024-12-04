import localFont from "next/font/local";
import "../globals.css";
import Header from '@/components/header';
import React from "react";

import {NextIntlClientProvider} from 'next-intl';

import {routing} from '@/i18n/routing';
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
 
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface rootLayoutProps{
  children: React.ReactNode;
  params: {
    locale: string
  }
}

export default async function RootLayout({children, params: {
  locale
}}: rootLayoutProps) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <title>CodePlease</title>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"/>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
