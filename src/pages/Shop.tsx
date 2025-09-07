import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, ShoppingCart, Search, LogOut, User, Plus, Minus, Settings, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import cucumberSeeds from "@/assets/cucumber-seeds.jpg";
import pepperSeeds from "@/assets/pepper-seeds.jpg";
import tomatoSeeds from "@/assets/tomato-seeds.jpg";
import lettuceSpinach from "@/assets/lettuce-spinach.jpg";
import carrots from "@/assets/carrots.jpg";
import yamTuber from "@/assets/yam-tuber.jpg";
import palmOil from "@/assets/palm-oil.jpg";
import watermelon from "@/assets/watermelon.jpg";
import plantainSuccers from "@/assets/plantain-suckers.jpg";
import { FloatingFarmBot } from "@/components/FloatingFarmBot";
import { CartSection } from "@/components/CartSection";
import { EmailConfirmationStatus } from "@/components/EmailConfirmationStatus";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  stock: number;
  unit: string;
  categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
  description: string;
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

const Shop = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ezocha_cart_simple");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");
      
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch products with categories
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `);
      
      if (productsError) throw productsError;
      setProducts(productsData || []);
      setFilteredProducts(productsData || []);
      
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
      filtered = filtered.filter(product => product.category_id === selectedCategory);
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
    const newCart = {
      ...cart,
      [productId]: (cart[productId] || 0) + 1
    };
    setCart(newCart);
    
    // Save to localStorage
    localStorage.setItem("ezocha_cart_simple", JSON.stringify(newCart));
    
    toast({
      title: "Added to cart",
      description: "Item successfully added to your cart",
    });
  };

  const removeFromCart = (productId: string) => {
    const newCart = { ...cart };
    if (newCart[productId] > 1) {
      newCart[productId] -= 1;
    } else {
      delete newCart[productId];
    }
    setCart(newCart);
    
    // Save to localStorage
    localStorage.setItem("ezocha_cart_simple", JSON.stringify(newCart));
  };

  const updateCartQuantity = (productId: string, change: number) => {
    if (change > 0) {
      addToCart(productId);
    } else {
      removeFromCart(productId);
    }
  };

  const removeItemCompletely = (productId: string) => {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
    
    // Save to localStorage
    localStorage.setItem("ezocha_cart_simple", JSON.stringify(newCart));
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
  
  const handleProceedToCheckout = () => {
    // Create cart data for checkout
    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        product,
        quantity
      };
    }).filter(item => item.product); // Remove any items where product wasn't found
    
    // Save cart items to localStorage for checkout page
    localStorage.setItem("ezocha_cart", JSON.stringify(cartItems));
    
    // Navigate to checkout
    navigate("/checkout");
  };
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!user || isLoading) {
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

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
              
              <Button variant="ghost" className="flex items-center gap-2 bg-green-100 text-green-700">
                <ShoppingCart className="h-4 w-4" />
                Shop
              </Button>
              
              <Button variant="ghost" onClick={() => navigate("/auth")} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
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

              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
              
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
          <EmailConfirmationStatus user={user} />
          <h2 className="text-3xl font-bold text-green-800 mb-4 mt-6">Fresh Farm Products</h2>
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
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
              <div className="aspect-video bg-green-100 flex items-center justify-center overflow-hidden">
                {product.image_url && imageMap[product.image_url] ? (
                  <img 
                    src={imageMap[product.image_url]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Leaf className="h-16 w-16 text-green-400" />
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.categories?.name || 'Unknown'}</Badge>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-700">
                      {formatNaira(product.price)}
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

        {/* Enhanced Cart Section */}
        <CartSection 
          cart={cart}
          products={products}
          onUpdateCart={(productId, quantity) => {
            const newCart = { ...cart, [productId]: quantity };
            setCart(newCart);
            localStorage.setItem("ezocha_cart_simple", JSON.stringify(newCart));
          }}
          onRemoveFromCart={removeFromCart}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </div>
      <FloatingFarmBot />
    </div>
  );
};

export default Shop;