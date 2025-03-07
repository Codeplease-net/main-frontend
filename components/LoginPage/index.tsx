"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail } from "lucide-react";

// Auth components
import {LoginForm} from "./forms/LoginForm";  // Fix: Import as default export
import RegisterForm from "./forms/RegisterForm";
import { ForgotPasswordForm } from "./forms/ForgotPasswordForm";  // Fix: Import as named export
import { FormMessage } from "./components/FormMessage";
import { useAuth } from "./hooks/useAuth";

// Page animations
const pageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function LoginPage() {
  const t = useTranslations("Auth");
  const params = useParams();
  
  const locale = params.locale || 'en';
  const { login, register, resetPassword, resetMessages, isLoading, error, successMessage, verificationSent } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("login");
      
  
  // Password reset states
  const [resetSent, setResetSent] = useState<boolean>(false);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetMessages();
    setResetSent(false);
  };

  // Handle forgot password
  const handleForgotPassword = (email: string) => {
    handleTabChange("forgotPassword");
  };
  
  // Handle back button for sub-views
  const handleBackToLogin = () => {
    setActiveTab("login");
    resetMessages();
    setResetSent(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{t("welcomeTo")}</h1>
          <p className="text-muted-foreground mt-2">{t("accountPlatformDesc")}</p>
        </div>

        {/* Main Card */}
        <motion.div 
          className="bg-background rounded-xl shadow-lg border border-border/40 overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageVariants}
        >
          {/* Email Verification View */}
          {verificationSent ? (
            <div className="p-6">
              <button 
                onClick={handleBackToLogin}
                className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} className="mr-1" />
                {t("backToLogin")}
              </button>
              
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Mail size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{t("checkYourEmail")}</h2>
                <p className="text-muted-foreground mb-2">
                  {t("verificationEmailSent")}
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md text-yellow-800 dark:text-yellow-200 text-sm mb-4">
                  <p>{t("checkSpamFolderNotice")}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("didntReceiveEmail")} <button className="text-primary hover:underline" onClick={() => resetMessages()}>{t("tryAgain")}</button>
                </p>
              </div>
            </div>
          ) : resetSent ? (
            // Password Reset View
            <div className="p-6">
              <button 
                onClick={handleBackToLogin}
                className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} className="mr-1" />
                {t("backToLogin")}
              </button>
              
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Mail size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{t("checkYourEmail")}</h2>
                <p className="text-muted-foreground mb-2">
                  {t("resetEmailSent")} 
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md text-yellow-800 dark:text-yellow-200 text-sm mb-4">
                  <p>{t("checkSpamFolderNotice")}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("didntReceiveEmail")} <button className="text-primary hover:underline" onClick={() => setResetSent(false)}>{t("tryAgain")}</button>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Error and Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FormMessage 
                      error={error}
                      success={null} 
                    />
                  </motion.div>
                )}
                
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FormMessage 
                      error={null}
                      success={successMessage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Auth Tabs */}
              <Tabs 
                defaultValue="login" 
                value={activeTab} 
                onValueChange={handleTabChange} 
                className="w-full"
              >
                <div className="p-1 px-4 pt-4">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="login">{t("signIn")}</TabsTrigger>
                    <TabsTrigger value="register">{t("createAccount")}</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-4 pt-2 pb-6">
                  <TabsContent value="login" className="mt-0 pt-2">
                    <LoginForm 
                      onSubmit={login} 
                      onForgotPassword={handleForgotPassword}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="register" className="mt-0 pt-2">
                    <RegisterForm 
                      onSubmit={register}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="forgotPassword" className="mt-0 pt-2">
                    <div className="mb-4">
                      <button 
                        onClick={() => handleTabChange("login")}
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft size={16} className="mr-1" />
                        {t("backToLogin")}
                      </button>
                    </div>
                    
                    <ForgotPasswordForm 
                      onSubmit={resetPassword}
                      onBack={() => handleTabChange("login")}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </motion.div>
        
      </div>
    </div>
  );
}