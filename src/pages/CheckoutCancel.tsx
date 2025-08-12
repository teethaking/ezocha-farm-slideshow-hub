import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Cancelled</h1>
          <p className="text-lg text-red-600">Your order was not completed</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
            <CardDescription>Your payment was cancelled or interrupted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Don't worry! Your cart items are still saved. You can complete your purchase anytime by going back to checkout.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Common reasons for cancellation:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• You clicked the back button during payment</li>
                <li>• The payment window was closed</li>
                <li>• Network connection issues</li>
                <li>• You chose to return to the website</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => navigate("/checkout")} className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Complete Purchase
              </Button>
              <Button variant="outline" onClick={() => navigate("/shop")} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Assistance?</CardTitle>
            <CardDescription>We're here to help</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              If you're experiencing issues with payment, please contact our support team:
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

export default CheckoutCancel;