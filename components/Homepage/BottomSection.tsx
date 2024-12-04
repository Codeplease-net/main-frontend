"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import Login from "@/components/login"
import { useTranslations } from 'next-intl';


export default function BottomSection() {
  const t = useTranslations('Home.BottomSection')
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  
  const toggleLoginVisibility = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <div className="bg-background text-foreground">
      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('Title')}</h2>
          <p className="text-xl mb-8">{t('Description')}</p>
          <Button size="lg" variant="secondary" onClick={toggleLoginVisibility}>{t('SignUpText')}</Button>
        </div>
      </section>
      {isLoginVisible && (
        <Login onClose={toggleLoginVisibility} redirectDes='/' />
      )}
    </div>
  )
}