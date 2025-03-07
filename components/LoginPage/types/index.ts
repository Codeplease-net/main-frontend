export interface KYCData {
    fullName: string;
    country: string;
    birthdate: string;
  }
  
  export interface RegisterFormData extends KYCData {
    email: string;
    password: string;
    confirmPassword: string;
    handle: string;
    agreeToTerms: boolean;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface FormMessageProps {
    error: string | null;
    success: string | null;
    verificationSent?: boolean;
  }
  
  export interface TabNavigationProps {
    activeTab: 'login' | 'register';
    onTabChange: (tab: 'login' | 'register') => void;
  }