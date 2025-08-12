import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Leaf, ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Checkout = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadCartData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    setCustomerInfo(prev => ({
      ...prev,
      email: session.user.email || "",
    }));
  };

  const loadCartData = () => {
    // Get cart from localStorage (from Shop component)
    const storedCart = localStorage.getItem("ezocha_cart");
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      setCartItems(cart);
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive",
      });
      navigate("/shop");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your order.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      navigate("/shop");
      return;
    }

    setIsLoading(true);

    try {
      const items = cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { items, customerInfo }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in the same tab
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!user) {
    return <div>Loading...</div>;
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
            
            <Button variant="outline" onClick={() => navigate("/shop")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </CardTitle>
              <CardDescription>
                Please provide your delivery details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={customerInfo.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isLoading ? "Processing..." : `Pay ${formatNaira(getTotalPrice())}`}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Secured by Stripe
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your items before payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatNaira(item.product.price)} per {item.product.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatNaira(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-green-700">{formatNaira(getTotalPrice())}</span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing fee</span>
                  <span>Included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;