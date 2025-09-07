import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface EmailConfirmationStatusProps {
  user: User | null;
}

export const EmailConfirmationStatus = ({ user }: EmailConfirmationStatusProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if email is confirmed
      setIsConfirmed(user.email_confirmed_at !== null);
      
      // Listen for auth state changes (including email confirmation)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          if (session?.user?.email_confirmed_at) {
            setIsConfirmed(true);
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="mb-4">
      {isConfirmed ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Email Confirmed
            </Badge>
            <span className="text-green-700">Your email has been verified successfully!</span>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <Mail className="h-3 w-3 mr-1" />
              Pending
            </Badge>
            <span className="text-orange-700">
              Please check your email and click the confirmation link to verify your account.
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};