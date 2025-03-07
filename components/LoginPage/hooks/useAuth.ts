import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification 
} from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/api/Readfirebase';
import { KYCData } from '../types';
import { validatePassword, validateBirthdate } from '../utils/validation';

export function useAuth() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale || 'en';
  
  // Get return_to parameter for redirect after login
  const returnTo = searchParams?.get("return_to") || "/";
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  
  // Reset state
  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
    setVerificationSent(false);
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    resetMessages();
    
    if (!email || !password) {
      setError(t("fieldsRequired"));
      return false; // Return false to indicate failure
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified - this is the critical part
      if (!user.emailVerified) {
        setError(t("emailNotVerified"));
        // Send a new verification email
        await sendEmailVerification(user);
        setSuccessMessage(t("verificationEmailResent"));
        setVerificationSent(true); // Set this to true to show verification UI
        setIsLoading(false);
        return false; // Return false to indicate login should not proceed
      }
      
      // Email is verified, continue with login
      // UPDATE FIRESTORE to reflect emailVerified status
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { emailVerified: true }, { merge: true });

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
      
      return true; // Return true to indicate successful login
      
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
      return false; // Return false to indicate failure
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    handle: string,
    kycData: KYCData
  ): Promise<void> => {
    resetMessages();
    
    // Validate form fields
    if (!email || !password || !confirmPassword || !handle || 
        !kycData.fullName || !kycData.country || !kycData.birthdate) {
      setError(t("fieldsRequired"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (!validatePassword(password)) {
      setError(t("passwordRequirements"));
      return;
    }
    
    // Validate handle
    if (handle.length < 3) {
      setError(t("handleTooShort"));
      return;
    }
    
    // Validate birthdate
    if (!validateBirthdate(kycData.birthdate)) {
      setError(t("invalidBirthdate"));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if handle is already taken
      const handleQuery = query(collection(db, "users"), where("handle", "==", handle));
      const querySnapshot = await getDocs(handleQuery);
      
      if (!querySnapshot.empty) {
        setError(t("handleAlreadyTaken"));
        setIsLoading(false);
        return;
      }
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      setVerificationSent(true);
      
      // Store user data in Firestore including KYC data
      await setDoc(doc(db, "users", user.uid), {
        handle,
        email,
        fullName: kycData.fullName,
        country: kycData.country,
        birthdate: kycData.birthdate,
        emailVerified: false,
        createdAt: new Date(),
      });
      
      // Show success message
      setSuccessMessage(t("registrationSuccessVerifyEmail"));
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
  
  // Password reset function
  const resetPassword = async (email: string) => {
    resetMessages();
    
    if (!email) {
      setError(t("emailRequired"));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(t("resetEmailSent"));
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
  
  return {
    login,
    register,
    resetPassword,
    resetMessages,
    isLoading,
    error,
    successMessage,
    verificationSent
  };
}