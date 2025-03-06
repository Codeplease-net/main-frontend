"use client";

import { useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "@/api/ReadFirebase";
import { db } from "@/api/ReadFirebase";
import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";

// Icons
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale || 'en';
  
  // Get return_to parameter for redirect after login
  const returnTo = searchParams?.get("return_to") || "/";
  
  // Active tab state (login or register)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Forgot password state
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerHandle, setRegisterHandle] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(null);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);

  // Check if a handle is already taken
  const checkHandleAvailability = async (handle: string) => {
    if (!handle || handle.length < 3) {
      setIsHandleAvailable(null);
      return;
    }
    
    setIsCheckingHandle(true);
    
    try {
      // Query Firestore to check if handle exists
      const handleQuery = query(collection(db, "users"), where("handle", "==", handle));
      const querySnapshot = await getDocs(handleQuery);
      
      setIsHandleAvailable(querySnapshot.empty);
    } catch (err) {
      console.error("Error checking handle:", err);
      setIsHandleAvailable(null);
    } finally {
      setIsCheckingHandle(false);
    }
  };

  // Handle handle input change with debounce
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegisterHandle(value);
    
    // Debounce to avoid too many queries
    if (value) {
      setTimeout(() => {
        checkHandleAvailability(value);
      }, 500);
    } else {
      setIsHandleAvailable(null);
    }
  };

  // Password strength validation
  const validatePassword = (password: string): boolean => {
    // At least 8 characters, with at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!loginEmail || !loginPassword) {
      setError(t("fieldsRequired"));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      // Show success message briefly before redirect
      setSuccessMessage(t("loginSuccess"));
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        const decodedReturnTo = decodeURIComponent(returnTo);
        if (decodedReturnTo.startsWith('/')) {
          router.push(decodedReturnTo);
        } else {
          router.push(`/${locale}${decodedReturnTo.startsWith('/') ? '' : '/'}${decodedReturnTo}`);
        }
      }, 1000);
      
    } catch (err: any) {
      // Handle specific Firebase auth errors
      switch (err.code) {
        case "auth/invalid-email":
          setError(t("invalidEmail"));
          break;
        case "auth/user-not-found":
          setError(t("userNotFound"));
          break;
        case "auth/wrong-password":
          setError(t("wrongPassword"));
          break;
        case "auth/too-many-requests":
          setError(t("tooManyRequests"));
          break;
        default:
          setError(t("loginFailed"));
          console.error("Login error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle forgot password submission
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!resetEmail) {
      setError(t("emailRequired"));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail).then(data => {
        console.log("Email sent", data);
      }).catch(err => console.log("Error", err));
      setSuccessMessage(t("resetEmailSent"));
      
      // Clear the form
      setResetEmail("");
    } catch (err: any) {
      // Handle specific Firebase auth errors
      switch (err.code) {
        case "auth/invalid-email":
          setError(t("invalidEmail"));
          break;
        case "auth/user-not-found":
          setError(t("userNotFound"));
          break;
        default:
          setError(t("resetEmailError"));
          console.error("Password reset error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modified register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Validate form fields
    if (!registerEmail || !registerPassword || !confirmPassword || !registerHandle) {
      setError(t("fieldsRequired"));
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (!validatePassword(registerPassword)) {
      setError(t("passwordRequirements"));
      return;
    }
    
    // Validate handle
    if (registerHandle.length < 3) {
      setError(t("handleTooShort"));
      return;
    }
    
    // Check handle availability one more time before proceeding
    setIsLoading(true);
    
    try {
      // Check if handle is already taken
      const handleQuery = query(collection(db, "users"), where("handle", "==", registerHandle));
      const querySnapshot = await getDocs(handleQuery);
      
      if (!querySnapshot.empty) {
        setError(t("handleAlreadyTaken"));
        setIsLoading(false);
        return;
      }
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        handle: registerHandle,
        email: registerEmail,
        createdAt: new Date(),
      });
      
      // Show success message briefly before redirect
      setSuccessMessage(t("registrationSuccess"));
      
      // Reset form fields
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setRegisterHandle("");
      
      // Redirect after short delay
      setTimeout(() => {
        const decodedReturnTo = decodeURIComponent(returnTo);
        if (decodedReturnTo.startsWith('/')) {
          router.push(decodedReturnTo);
        } else {
          router.push(`/${locale}${decodedReturnTo.startsWith('/') ? '' : '/'}${decodedReturnTo}`);
        }
      }, 1500);
      
    } catch (err: any) {
      // Handle specific Firebase auth errors
      switch (err.code) {
        case "auth/email-already-in-use":
          setError(t("emailAlreadyInUse"));
          break;
        case "auth/invalid-email":
          setError(t("invalidEmail"));
          break;
        case "auth/weak-password":
          setError(t("weakPassword"));
          break;
        default:
          setError(t("registrationFailed"));
          console.error("Registration error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all states when switching tabs or modes
  const resetStates = () => {
    setError(null);
    setSuccessMessage(null);
    setForgotPasswordMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-block">
            <Image 
              src="/icon.png" 
              alt="Logo" 
              width={60} 
              height={60} 
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold">
            {forgotPasswordMode 
              ? t("resetPassword")
              : activeTab === 'login' 
                ? t("signIn") 
                : t("createAccount")
            }
          </h1>
          <p className="text-muted-foreground mt-2">
            {forgotPasswordMode 
              ? t("resetPasswordPrompt")
              : activeTab === 'login' 
                ? t("signInPrompt") 
                : t("registerPrompt")
            }
          </p>
        </div>
        
        {/* Tab navigation - only show when not in forgot password mode */}
        {!forgotPasswordMode && (
          <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                setActiveTab('login');
                resetStates();
              }}
            >
              {t("signIn")}
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                setActiveTab('register');
                resetStates();
              }}
            >
              {t("register")}
            </button>
          </div>
        )}
        
        {/* Back to login button - only show in forgot password mode */}
        {forgotPasswordMode && (
          <button
            onClick={() => {
              setForgotPasswordMode(false);
              resetStates();
            }}
            className="flex items-center text-primary hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            {t("backToLogin")}
          </button>
        )}
        
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive"
          >
            {error}
          </motion.div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            {successMessage}
          </motion.div>
        )}
        
        {/* Forgot Password Form */}
        {forgotPasswordMode && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium">
                {t("email")}
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t("resetPasswordHint")}
              </p>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  {t("sending")}
                </span>
              ) : (
                t("sendResetLink")
              )}
            </button>
          </form>
        )}
        
        {/* Login Form */}
        {!forgotPasswordMode && activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium">
                {t("email")}
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Password input */}
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showLoginPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showLoginPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Forgot password link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordMode(true);
                  setError(null);
                  setSuccessMessage(null);
                  // Pre-fill reset email with login email if available
                  if (loginEmail) {
                    setResetEmail(loginEmail);
                  }
                }}
                className="text-sm text-primary hover:underline"
              >
                {t("forgotPassword")}
              </button>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  {t("signingIn")}
                </span>
              ) : (
                t("signIn")
              )}
            </button>
          </form>
        )}
        
        {/* Register Form */}
        {!forgotPasswordMode && activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Handle input - now first field */}
            <div className="space-y-2">
              <label htmlFor="register-handle" className="text-sm font-medium">
                {t("handle")}
              </label>
              <div>
                <input
                  id="register-handle"
                  type="text"
                  value={registerHandle}
                  onChange={handleHandleChange}
                  className={`w-full p-2 rounded-md border ${
                    isHandleAvailable === true 
                      ? 'border-green-500' 
                      : isHandleAvailable === false
                        ? 'border-red-500'
                        : 'border-input'
                  } bg-background`}
                  placeholder="username"
                  disabled={isLoading}
                  required
                />
                {isCheckingHandle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("checkingHandle")}...
                  </p>
                )}
                {isHandleAvailable === true && !isCheckingHandle && (
                  <p className="text-xs text-green-500 mt-1">
                    {t("handleAvailable")}
                  </p>
                )}
                {isHandleAvailable === false && !isCheckingHandle && (
                  <p className="text-xs text-red-500 mt-1">
                    {t("handleTaken")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {t("handleDescription")}
                </p>
              </div>
            </div>
            
            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium">
                {t("email")}
              </label>
              <input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Password input */}
            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showRegisterPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showRegisterPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("passwordHint")}
              </p>
            </div>
            
            {/* Confirm Password input */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || isHandleAvailable === false}
              className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  {t("creatingAccount")}
                </span>
              ) : (
                t("createAccount")
              )}
            </button>
            
          </form>
        )}
      </div>
    </div>
  );
}