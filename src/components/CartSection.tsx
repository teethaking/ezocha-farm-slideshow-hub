import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartSectionProps {
  cart: {[key: string]: number};
  products: Product[];
  onUpdateCart: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartSection = ({ 
  cart, 
  products, 
  onUpdateCart, 
  onRemoveFromCart,
  onProceedToCheckout 
}: CartSectionProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Convert cart object to array of cart items
    const items = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return product ? { product, quantity } : null;
    }).filter((item): item is CartItem => item !== null);
    
    setCartItems(items);
  }, [cart, products]);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveFromCart(productId);
      toast({
        title: "Item removed",
        description: "Item removed from your cart",
      });
    } else {
      onUpdateCart(productId, newQuantity);
    }
  };

  const removeItem = (productId: string) => {
    onRemoveFromCart(productId);
    toast({
      title: "Item removed",
      description: "Item removed from your cart",
    });
  };

  if (cartItems.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add some fresh products to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart ({getTotalItems()} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold text-xs text-center">
                  {item.product.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatNaira(item.product.price)} per {item.product.unit}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="font-medium text-sm min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatNaira(item.product.price * item.quantity)}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeItem(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{getTotalItems()} items</p>
              <p className="text-2xl font-bold text-green-700">
                {formatNaira(getTotalPrice())}
              </p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full"
            onClick={onProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};