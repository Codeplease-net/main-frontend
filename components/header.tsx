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
import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcher from './ui/changeLocale';
import { usePathname } from 'next/navigation';

export default function Header() {
  const t = useTranslations('Header');
  const pathName = usePathname();
  const locale = useLocale()
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [Lightmode, setLightmode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <header className="border-b relative p-4">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex ml-6 align-bottom">
          <div className='w-7 h-7'>
            <Image
              src={logo} alt='Logo'/>
          </div>
          odePlease
        </Link>
        <div className="hidden md:flex items-center">
          <Link
            href="/"
            className={`text-lg hover:bg-secondary rounded-md px-3 h-12 hover:text-primary flex items-center transition-colors ${pathName == `/${locale}` ? 'text-primary': 'text-gray-500'}`}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            >
              {t('Home')}
          </Link>
          <div className={`bg-gray-500 w-[0.05vw] h-[2vh] ${hoveredIndex == 1 || hoveredIndex == 2 ? 'opacity-0' : null}`}/>
          <Link
            href="/problems"
            className={`text-lg hover:bg-secondary rounded-md px-3 h-12 hover:text-primary flex items-center transition-colors ${pathName.includes('problems') ? 'text-primary': 'text-gray-500'}`}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {t('Problems')}
          </Link>
          {/* <Link
            href="/contests"
            className="hover:bg-secondary hover:text-white px-3 py-2 rounded transition-colors"
          >
            {t('Contests')}
          </Link> */}
          <div className={`bg-gray-500 w-[0.05vw] h-[2vh] ${hoveredIndex == 2 || hoveredIndex == 3 ? 'opacity-0' : null}`}/>
          <Link
            href="/leaderboard"
            className={`text-lg hover:bg-secondary rounded-md px-3 h-12 hover:text-primary flex items-center transition-colors ${pathName.includes('leaderboard') ? 'text-primary': 'text-gray-500'}`}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {t('Leaderboard')} 
          </Link>
          <div className={`bg-gray-500 w-[0.05vw] h-[2vh] ${hoveredIndex == 3 || hoveredIndex == 4 ? 'opacity-0' : null}`}/>
          <Link
            href="/topics"
            className={`text-lg hover:bg-secondary rounded-md px-3 h-12 hover:text-primary flex items-center transition-colors ${pathName.includes('topics') ? 'text-primary': 'text-gray-500'}`}
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
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