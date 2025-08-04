import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, ShoppingCart, Search, LogOut, User, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  unit: string;
}

// Sample product data - in a real app, this would come from your database
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Organic Tomatoes",
    description: "Fresh, juicy organic tomatoes grown with care",
    price: 4.99,
    category: "vegetables",
    image_url: "/api/placeholder/300/200",
    stock: 50,
    unit: "lb"
  },
  {
    id: "2",
    name: "Free-Range Eggs",
    description: "Farm-fresh eggs from happy, free-range chickens",
    price: 6.99,
    category: "dairy",
    image_url: "/api/placeholder/300/200",
    stock: 30,
    unit: "dozen"
  },
  {
    id: "3",
    name: "Fresh Spinach",
    description: "Nutrient-rich organic spinach leaves",
    price: 3.49,
    category: "vegetables",
    image_url: "/api/placeholder/300/200",
    stock: 25,
    unit: "bunch"
  },
  {
    id: "4",
    name: "Raw Honey",
    description: "Pure, unprocessed honey from our own beehives",
    price: 12.99,
    category: "pantry",
    image_url: "/api/placeholder/300/200",
    stock: 15,
    unit: "jar"
  },
  {
    id: "5",
    name: "Organic Carrots",
    description: "Sweet, crunchy carrots perfect for snacking",
    price: 2.99,
    category: "vegetables",
    image_url: "/api/placeholder/300/200",
    stock: 40,
    unit: "lb"
  },
  {
    id: "6",
    name: "Fresh Basil",
    description: "Aromatic basil perfect for cooking",
    price: 2.49,
    category: "herbs",
    image_url: "/api/placeholder/300/200",
    stock: 20,
    unit: "bunch"
  }
];

const Shop = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [products] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast({
      title: "Added to cart",
      description: "Item successfully added to your cart",
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const categories = ["all", "vegetables", "fruits", "dairy", "herbs", "pantry"];

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
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-green-600" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Fresh Farm Products</h2>
          <p className="text-green-600 mb-6">Discover our selection of fresh, organic produce</p>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-green-100 flex items-center justify-center">
                <Leaf className="h-16 w-16 text-green-400" />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-700">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      per {product.unit}
                    </span>
                  </div>
                  <Badge variant={product.stock > 10 ? "default" : "secondary"}>
                    {product.stock} in stock
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="font-medium px-4">
                        {cart[product.id]}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => addToCart(product.id)}
                      className="flex-1"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold">
                    {getTotalItems()} items
                  </span>
                  <span className="text-2xl font-bold text-green-700 ml-4">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Button size="lg">
                  Proceed to Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Shop;