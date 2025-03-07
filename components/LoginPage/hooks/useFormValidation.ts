import { useState } from 'react';
// Import the validation functions from the utils file
import { validatePassword, validateBirthdate } from '../utils/validation';

type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean;
};

type ValidationErrors = {
  [key: string]: string | null;
};

export const useFormValidation = () => {
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

// Validate handle (username)
const validateHandle = (handle: string): boolean => {
    // Better handle validation:
    // - Must start with a letter
    // - Can contain letters, numbers, underscores, and hyphens
    // - Cannot have consecutive special characters (no __ or -_ etc)
    // - Must be between 3-20 characters
    // - Cannot end with a special character
    // - No spaces allowed
    const handleRegex = /^[a-zA-Z][a-zA-Z0-9]*(?:[_-][a-zA-Z0-9]+)*$/;
    return handle.length >= 3 && handle.length <= 20 && handleRegex.test(handle);
  };
  // Generic field validation with configurable rules
  const validateField = (
    fieldName: string, 
    value: string, 
    rules: ValidationRules
  ): boolean => {
    let isValid = true;
    let errorMessage: string | null = null;

    // Required check
    if (rules.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } 
    // Min length check
    else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `Minimum length is ${rules.minLength} characters`;
    } 
    // Max length check
    else if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `Maximum length is ${rules.maxLength} characters`;
    } 
    // Pattern check
    else if (rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = 'Invalid format';
    } 
    // Custom validator
    else if (rules.customValidator && !rules.customValidator(value)) {
      isValid = false;
      errorMessage = 'Invalid value';
    }

    // Update errors state
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));

    return isValid;
  };

  // Validate passwords match
  const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    const match = password === confirmPassword;
    setFormErrors(prev => ({
      ...prev,
      confirmPassword: match ? null : 'Passwords do not match'
    }));
    return match;
  };

  // Reset all errors
  const resetErrors = () => {
    setFormErrors({});
  };

  // Clear a specific error
  const clearError = (fieldName: string) => {
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  return {
    formErrors,
    validatePassword, // Re-export from utils
    validateBirthdate, // Re-export from utils
    validateEmail,
    validateHandle,
    validateField,
    validatePasswordMatch,
    resetErrors,
    clearError
  };
};