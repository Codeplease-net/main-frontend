"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { countries } from 'countries-list';
import { useParams } from "next/navigation";

// Icons
import { Eye, EyeOff, Loader2, Calendar, Flag, User } from "lucide-react";

// Types 
import { KYCData } from "../types";

// Firebase services
import { db } from "@/api/Readfirebase";
import { query, collection, where, getDocs } from "firebase/firestore";

// Hooks
import { useFormValidation } from "../hooks/useFormValidation";

interface RegisterFormProps {
  onSubmit: (email: string, password: string, confirmPassword: string, handle: string, kycData: KYCData) => Promise<void>;
  isLoading: boolean;
}

export default function RegisterForm({ 
  onSubmit,
  isLoading
}: RegisterFormProps) {
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = params.locale || 'en';
  
  // Form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerHandle, setRegisterHandle] = useState("");
  
  // KYC state (Know Your Customer)
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [birthdate, setBirthdate] = useState("");
  
  // Form validation state
  const [isHandleAvailable, setIsHandleAvailable] = useState<boolean | null>(null);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Validation
  const { validatePassword, validateBirthdate, validateField } = useFormValidation();
  
  // Country options
  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: country.name
  })).sort((a, b) => a.label.localeCompare(b.label));

  // Check if handle is available with debounce
  useEffect(() => {
    const checkHandleTimer = setTimeout(() => {
      if (registerHandle && registerHandle.length >= 3) {
        checkHandleAvailability(registerHandle);
      }
    }, 500);
    
    return () => clearTimeout(checkHandleTimer);
  }, [registerHandle]);

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

  // Handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate all fields
    const isValid = validateAllFields();
    if (!isValid) return;
    
    // Local validation passed, collect KYC data
    const kycData: KYCData = {
      fullName,
      country,
      birthdate
    };
    
    // Call the onSubmit prop (register function from useAuth)
    try {
      await onSubmit(registerEmail, registerPassword, confirmPassword, registerHandle, kycData);
      resetForm();
    } catch (err) {
      // Error handling is done in useAuth
      console.error("Registration error", err);
    }
  };

  // Validate all form fields
  const validateAllFields = () => {
    if (!registerEmail || !registerPassword || !confirmPassword || !registerHandle || 
        !fullName || !country || !birthdate) {
      setFormError(t("fieldsRequired"));
      return false;
    }

    if (registerPassword !== confirmPassword) {
      setFormError(t("passwordsDoNotMatch"));
      return false;
    }

    if (!validatePassword(registerPassword)) {
      setFormError(t("passwordRequirements"));
      return false;
    }
    
    // Validate handle
    if (registerHandle.length < 3) {
      setFormError(t("handleTooShort"));
      return false;
    }
    
    // Validate birthdate
    if (!validateBirthdate(birthdate)) {
      setFormError(t("invalidBirthdate"));
      return false;
    }

    // Check if handle is marked as unavailable
    if (isHandleAvailable === false) {
      setFormError(t("handleAlreadyTaken"));
      return false;
    }

    return true;
  };

  // Reset form
  const resetForm = () => {
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
    setRegisterHandle("");
    setFullName("");
    setCountry("");
    setBirthdate("");
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Display form error if any */}
      {formError && (
        <div className="p-3 text-sm bg-red-100 border border-red-300 text-red-800 rounded-md">
          {formError}
        </div>
      )}
      
      {/* Handle input */}
      <div className="space-y-2">
        <label htmlFor="register-handle" className="text-sm font-medium">
          {t("handle")}
        </label>
        <div>
          <input
            id="register-handle"
            type="text"
            value={registerHandle}
            onChange={(e) => setRegisterHandle(e.target.value)}
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
        <p className="text-xs text-muted-foreground">
          <strong>{t("emailVerificationRequired")}</strong> - {t("youMustVerifyEmail")}
        </p>
      </div>

      {/* Full Name - KYC */}
      <div className="space-y-2">
        <label htmlFor="full-name" className="text-sm font-medium flex items-center">
          <User size={16} className="mr-1.5 text-muted-foreground" />
          {t("fullName")}
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 rounded-md border border-input bg-background"
          placeholder={t("fullName")}
          disabled={isLoading}
          required
        />
      </div>

      {/* Country - KYC */}
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium flex items-center">
          <Flag size={16} className="mr-1.5 text-muted-foreground" />
          {t("country")}
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 rounded-md border border-input bg-background"
          disabled={isLoading}
          required
        >
          <option value="" disabled>
            {t("selectCountry")}
          </option>
          {countryOptions.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      {/* Birthdate - KYC */}
      <div className="space-y-2">
        <label htmlFor="birthdate" className="text-sm font-medium flex items-center">
          <Calendar size={16} className="mr-1.5 text-muted-foreground" />
          {t("birthdate")}
        </label>
        <input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full p-2 rounded-md border border-input bg-background"
          max={new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 13).toISOString().split('T')[0]} // 13 years ago
          disabled={isLoading}
          required
        />
        <p className="text-xs text-muted-foreground">
          {t("ageRequirement")}
        </p>
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
        className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none mt-4"
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
  );
}