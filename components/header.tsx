"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import Login from "./login";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import logoheadwhite from "../public/logoheadwhite.png";
import logoheadblack from "../public/logoheadblack.png";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./ui/change-locale";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/api/Readfirebase";

export default function Header() {
  const t = useTranslations("Header");
  const pathName = usePathname();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [Lightmode, setLightmode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userHandle, setUserHandle] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingHandle, setIsLoadingHandle] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setUserHandle("");
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    setIsLoadingHandle(true);
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserHandle(userData.handle || "");
        setIsAdmin(userData.admin === true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingHandle(false);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        setUserHandle("");
        setIsAdmin(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("light", Lightmode);
  }, [Lightmode]);

  return (
    <header className="border-b relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex justify-between items-center h-20 px-4">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center hover:opacity-90 transition-opacity"
        >
          <Image
            src={Lightmode ? logoheadwhite : logoheadblack}
            height={48}
            alt="logo-head"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {["home", "problems", "topics"].map((route, index) => (
            <Link
              key={index}
              href={route == 'home' ? '/' : `/${route}`}
              className={`text-lg px-4 py-2 rounded-md transition-all duration-200 ${
                pathName.includes(route)
                  ? "bg-secondary text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-primary"
              }`}
            >
              {t(route.charAt(0).toUpperCase() + route.slice(1))}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLightmode(!Lightmode)}
              className="hover:bg-secondary/80"
            >
              {Lightmode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:opacity-80 transition-opacity">
                  <Avatar>
                    <AvatarImage src="/cat.png" />
                    <AvatarFallback>{isLoadingHandle ? "..." : (userHandle.charAt(0) || "U")}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-medium">
                    {isLoadingHandle ? "Loading..." : userHandle || "User"}
                  </DropdownMenuLabel>
                  
                  {/* <DropdownMenuItem>
                    <Link href={`/profile/${user.uid}`}>{t("Profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/profile/submissions/${user.uid}`}>{t("Submissions")}</Link>
                  </DropdownMenuItem> */}
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/polygon" className="w-full">
                          {t("Admin Console")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>{t("Sign Out")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary" onClick={() => setIsLoginVisible(true)} className="font-medium">
                {t("Sign In")}
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[80px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden z-50">
          <div className="flex flex-col p-4 space-y-3">
            {["home", "problems", "leaderboard", "topics"].map((route, index) => (
              <Link
                key={index}
                href={route == 'home' ? '/' : `/${route}`}
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathName.includes(route)
                    ? "bg-secondary text-primary"
                    : "hover:bg-secondary/80"
                }`}
              >
                {t(route.charAt(0).toUpperCase() + route.slice(1))}
              </Link>
            ))}
            <div className="flex items-center justify-between gap-3 px-4 pt-3 border-t">
              <LocaleSwitcher />
              <Button variant="outline" size="icon" onClick={() => setLightmode(!Lightmode)}>
                {Lightmode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/cat.png" />
                    <AvatarFallback>{isLoadingHandle ? "..." : (userHandle.charAt(0) || "U")}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    {isLoadingHandle ? "Loading..." : userHandle || "User"}
                  </DropdownMenuLabel>
                  
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link href="/polygon" className="w-full">
                        {t("Admin Console")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={handleLogout}>{t("Sign Out")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary" onClick={() => setIsLoginVisible(true)}>
                {t("Sign In")}
              </Button>
            )}
          </div>
        </div>
      )}

      <Login isOpen={isLoginVisible} onClose={() => setIsLoginVisible(false)} redirectDes="/problems" />
    </header>
  );
}