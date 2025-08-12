import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, CheckCircle, Package, Home, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      toast({
        title: "Invalid Session",
        description: "No payment session found",
        variant: "destructive",
      });
      navigate("/shop");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data?.success) {
        setOrderDetails(data.order);
        
        // Clear cart from localStorage
        localStorage.removeItem("ezocha_cart");
        
        toast({
          title: "Payment Successful!",
          description: "Your order has been confirmed and will be processed shortly.",
        });
      } else {
        throw new Error("Payment verification failed");
      }

    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify payment",
        variant: "destructive",
      });
      navigate("/shop");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">Ezocha Farms</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
          <p className="text-lg text-green-600">Thank you for your order from Ezocha Farms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Confirmation
              </CardTitle>
              <CardDescription>Your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono text-sm">{orderDetails.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-green-700">
                      {formatNaira(orderDetails.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="capitalize text-green-600 font-medium">
                      {orderDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Order Date:</span>
                    <span>{new Date(orderDetails.created_at).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                What's Next?
              </CardTitle>
              <CardDescription>Your order journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-700">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your fresh farm products
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-700">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Quality Check</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensuring only the best products for you
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-700">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Fresh delivery within 2-3 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate("/shop")}>
            <Package className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Contact our customer support</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              If you have any questions about your order, don't hesitate to contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> support@ezochafarms.com</p>
              <p><strong>Phone:</strong> +234 xxx xxx xxxx</p>
              <p><strong>WhatsApp:</strong> +234 xxx xxx xxxx</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccess;