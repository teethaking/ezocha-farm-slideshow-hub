import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, X, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cucumberSeeds from "@/assets/cucumber-seeds.jpg";
import pepperSeeds from "@/assets/pepper-seeds.jpg";
import tomatoSeeds from "@/assets/tomato-seeds.jpg";
import lettuceSpinach from "@/assets/lettuce-spinach.jpg";
import carrots from "@/assets/carrots.jpg";
import yamTuber from "@/assets/yam-tuber.jpg";
import palmOil from "@/assets/palm-oil.jpg";
import watermelon from "@/assets/watermelon.jpg";
import plantainSuccers from "@/assets/plantain-suckers.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  unit: string;
}

interface CartSidebarProps {
  cart: {[key: string]: number};
  products: Product[];
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const imageMap: { [key: string]: string } = {
  '/src/assets/cucumber-seeds.jpg': cucumberSeeds,
  '/src/assets/pepper-seeds.jpg': pepperSeeds,
  '/src/assets/tomato-seeds.jpg': tomatoSeeds,
  '/src/assets/lettuce-spinach.jpg': lettuceSpinach,
  '/src/assets/carrots.jpg': carrots,
  '/src/assets/yam-tuber.jpg': yamTuber,
  '/src/assets/palm-oil.jpg': palmOil,
  '/src/assets/watermelon.jpg': watermelon,
  '/src/assets/plantain-suckers.jpg': plantainSuccers,
};

export const CartSidebar = ({ cart, products, onUpdateQuantity, onRemoveItem }: CartSidebarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleProceedToCheckout = () => {
    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        product,
        quantity
      };
    }).filter(item => item.product);
    
    localStorage.setItem("ezocha_cart", JSON.stringify(cartItems));
    navigate("/checkout");
    setIsOpen(false);
  };

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return product ? { product, quantity } : null;
  }).filter(Boolean);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({getTotalItems()} items)
          </SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some fresh products to get started!</p>
            </div>
          ) : (
            <>
              {cartItems.map(({ product, quantity }) => (
                <Card key={product.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => onRemoveItem(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center overflow-hidden">
                        {product.image_url && imageMap[product.image_url] ? (
                          <img 
                            src={imageMap[product.image_url]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="h-8 w-8 text-green-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatNaira(product.price)} per {product.unit}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onUpdateQuantity(product.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="font-medium text-sm px-2">
                              {quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onUpdateQuantity(product.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {formatNaira(product.price * quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator />
              
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total ({getTotalItems()} items)</span>
                    <span className="text-xl font-bold text-green-700">
                      {formatNaira(getTotalPrice())}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleProceedToCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};