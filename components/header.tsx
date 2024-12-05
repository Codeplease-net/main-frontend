"use client";

import React, { useState, useEffect } from 'react';
import {Link} from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import Login from './login';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import logo from "../public/logo.png"
import Image from 'next/image'
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './ui/changeLocale';

export default function Header() {
  const t = useTranslations('Header');
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [Lightmode, setLightmode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const Logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    if (Lightmode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [Lightmode]);

  const toggleLoginVisibility = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b p-4 relative">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex ml-6">
          <div className='w-7 h-7'>
            <Image
              src={logo} alt='Logo'/>
          </div>
          <p className='ml-2'>CodePlease</p>
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <Link
            href="/"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Home')}
          </Link>
          <Link
            href="/problems"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Problems')}
          </Link>
          {/* <Link
            href="/contests"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Contests')}
          </Link> */}
          <Link
            href="/leaderboard"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Leaderboard')}
          </Link>
          <Link
            href="/topics"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Topics')}
          </Link>
        </div>
        <div className='flex justify-center items-center gap-2'>
        <div className='hidden md:flex items-center justify-start gap-2'>
          <LocaleSwitcher />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLightmode(!Lightmode)}
          >
            {Lightmode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="/cat.png"/>
                  <AvatarFallback>{user.uid}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href={`/profile/${user.uid}`}>{t('Profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem><Link href={`/profile/submissions/${user.uid}`}>{t('Submissions')}</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={Logout}>{t('Sign Out')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="secondary" onClick={toggleLoginVisibility}>{t('Sign In')}</Button>
          )}
        </div>
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              >
              <Menu className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col mt-2 space-y-2 md:hidden">
          <Link
            href="/"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Home')}
          </Link>
          <Link
            href="/problems"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Problems')}
          </Link>
          {/* <Link
            href="/contests"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Contests')}
          </Link> */}
          <Link
            href="/leaderboard"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Leaderboard')}
          </Link>
          <Link
            href="/topics"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Topics')}
          </Link>
          
          {/* Dark Mode Toggle and User Info in Burger Menu */}
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLightmode(!Lightmode)}
            >
              {Lightmode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/cat.png"/>
                    <AvatarFallback>{user.displayName}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary" onClick={toggleLoginVisibility}>Sign In</Button>
            )}
          </div>
        </div>
      )}

      {isLoginVisible && (
          <Login onClose={toggleLoginVisibility} redirectDes='/problems'/>
      )}
    </header>
  );
}