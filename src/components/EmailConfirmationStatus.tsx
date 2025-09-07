import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const EmailConfirmationStatus = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      // Show success message when email is confirmed
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        toast({
          title: "Email Confirmed! ✅",
          description: "Your email has been successfully verified.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleResendConfirmation = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/shop`
        }
      });

      if (error) throw error;

      toast({
        title: "Confirmation Email Sent",
        description: "Please check your email for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show anything if no user or still loading
  if (isLoading || !user) return null;

  // Show confirmed status
  if (user.email_confirmed_at) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center gap-2 text-green-800">
          <span className="font-medium">Email Confirmed</span>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </AlertDescription>
      </Alert>
    );
  }

  // Show unconfirmed status
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Please confirm your email address</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendConfirmation}
            disabled={isLoading}
            className="ml-4"
          >
            {isLoading ? "Sending..." : "Resend"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};