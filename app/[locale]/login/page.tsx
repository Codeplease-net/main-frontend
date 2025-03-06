import React from 'react';
import { getTranslations } from 'next-intl/server';
import LoginPage from '@/components/LoginPage';

// Generate metadata for the page
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Auth' });
  
  return {
    title: t('signIn'),
    description: t('signInPrompt'),
  };
}

export default function Login({
  params: { locale }
}: {
  params: { locale: string };
}) {
  
  // Use the component directly without nesting
  return <LoginPage />;
}