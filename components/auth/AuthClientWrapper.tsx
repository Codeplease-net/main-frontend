"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Safety timeout to prevent infinite loading state
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Get current path
    const currentPath = window.location.pathname;
    const isPolygonPath = currentPath.includes('/polygon');
        
    // Import auth and db dynamically
    Promise.all([
      import('@/api/ReadFirebase').then(module => module.auth),
      import('@/api/ReadFirebase').then(module => module.db)
    ]).then(([auth, db]) => {
      // Set up auth state listener
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        setUser(currentUser);
        
        try {
          // If user is authenticated and trying to access /polygon, check admin status
          if (currentUser && isPolygonPath) {
            try {
              const { doc, getDoc } = await import('firebase/firestore');
              const userDoc = await getDoc(doc(db, "users", currentUser.uid));
              
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const userIsAdmin = userData.admin === true;
                setIsAdmin(userIsAdmin);
                
                // If not admin and trying to access /polygon, redirect to home
                if (!userIsAdmin && isPolygonPath) {
                    window.location.href = "/";
                  toast.error("You don't have access to the admin console");
                }
              } else {
                // No user data found, definitely not an admin
                if (isPolygonPath) {
                    window.location.href = "/";
                  toast.error("You don't have access to the admin console");
                }
              }
            } catch (error) {
              console.error("Failed to check admin status:", error);
              // On error, don't allow access to /polygon
              if (isPolygonPath) {
                window.location.href = "/";
                toast.error("Error checking permissions");
              }
            }
          }
          // Handle authentication redirect after admin check
          if (!currentUser) {
            // Get current path for redirect back after login
            const returnPath = encodeURIComponent(currentPath);
            
            // Prevent redirect loop by checking we're not already on a login page
            if (!currentPath.includes('/login')) {
              window.location.href = `/login?return_to=${returnPath}`;
            }
          }
        } catch (error) {
          console.error("Error in auth state handler:", error);
        } finally {
          // Always set loading to false, regardless of what happened
          clearTimeout(safetyTimer);
          setIsLoading(false);
        }
      });
      
      return () => {
        clearTimeout(safetyTimer);
        unsubscribe();
      };
    }).catch(error => {
      console.error("Failed to load Firebase modules:", error);
      clearTimeout(safetyTimer);
      setIsLoading(false);
    });
    
    // Clean up safety timer on component unmount
    return () => clearTimeout(safetyTimer);
  }, [router]); 
  
  // Show loading state during initial auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
      </div>
    );
  }
  
  const currentPath = window.location.pathname;
  const isPolygonPath = currentPath.includes('/polygon');

  // Check for polygon access
  if (isPolygonPath && !isAdmin && user) {
    return null; // Return null as we're already redirecting
  }

  if (isPolygonPath && isAdmin && user){
    return <>{children}</>;
  }

  // If user is authenticated or on login page, show content
  if (user || currentPath.includes('/login')) {
    return <>{children}</>;
  }
  
  // For all other cases, show a redirecting message
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to login...</p>
      </div>
    </div>
  );
}