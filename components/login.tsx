import { auth, googleProvider, facebookProvider, githubProvider} from "@/api/Readfirebase";
import { signInWithPopup, User } from "firebase/auth";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Github, Facebook, Chrome } from 'lucide-react';
import { useEffect, useState } from "react";
import nookies from 'nookies';

export default function Login({ onClose, redirectDes }: { onClose: () => void, redirectDes: string }) {
  
  const [cookieConsent, setCookieConsent] = useState(false);
  const [user, setUser] = useState<null | User>(null);

  // Check if user has already given cookie consent
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setCookieConsent(true);
    }
  }, []);

  // Function to ask for cookie permission
  const askForCookieConsent = () => {
    const userConsent = confirm("Do you allow us to use cookies for login?");
    if (userConsent) {
      localStorage.setItem('cookieConsent', 'true');
      setCookieConsent(true);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user){
        setUser(user);
      } else
        setUser(null);
    });
    return () => unsubscribe();
  }, [])

  const handleGoogleLogin = async () => {
    if (!cookieConsent) {
      askForCookieConsent();
    }
    
    if (cookieConsent) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        
        // Get the token from Firebase
        const token = await result.user.getIdToken();
        
        // Save the token as a cookie
        nookies.set(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: true,
        });

        // Redirect to a protected page or home
        window.location.href = redirectDes;
      } catch (error) {
        console.error("Error signing in:", error);
      }
    }
  };

  const handleFacebookLogin = async () => {
    if (!cookieConsent) {
      askForCookieConsent();
    }
    
    if (cookieConsent) {
      try {
        const result = await signInWithPopup(auth, facebookProvider);
        
        // Get the token from Firebase
        const token = await result.user.getIdToken();
        
        // Save the token as a cookie
        nookies.set(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: true,
        });

        // Redirect to a protected page or home
        window.location.href = redirectDes;
      } catch (error) {
        console.error("Error signing in:", error);
      }
    }         
  }
  
  const handleGithubLogin = async() => {
    if (!cookieConsent) {
      askForCookieConsent();
    }
    
    if (cookieConsent) {
      try {
        const result = await signInWithPopup(auth, githubProvider);
        
        // Get the token from Firebase
        const token = await result.user.getIdToken();
        
        // Save the token as a cookie
        nookies.set(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: true,
        });

        // Redirect to a protected page or home
        window.location.href = redirectDes;
      } catch (error) {
        console.error("Error signing in:", error);
      }
    }         
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="flex items-center justify-center min-h-screen bg-transparent fixed top-0 z-50 inset-0">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex justify-between flex-row items-center">
              Sign In
              <Button variant="ghost" onClick={onClose} className="text-lg">X</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-between text-xl" onClick={handleGoogleLogin}>
              <Chrome className="h-6 w-6" />
              <div>Google</div>
              <div></div>
            </Button>
            <Button variant="outline" className="w-full justify-between text-xl" onClick = {handleGithubLogin}>
              <Github className="h-6 w-6" />
              <div>Github</div>
              <div></div>
            </Button>
            <Button variant="outline" className="w-full justify-between text-xl text-blue-800" onClick = {handleFacebookLogin}>
              <Facebook className="h-6 w-6" />
              <div>Facebook</div>
              <div></div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
