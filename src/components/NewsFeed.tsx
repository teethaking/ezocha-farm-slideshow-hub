import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Eye, Leaf, TrendingUp, Truck, Cpu, Users, Fish } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NewsModal } from "./NewsModal";

interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  category: string;
  author_name: string;
  published_at: string;
  featured: boolean;
  views: number;
}

const categoryIcons = {
  general: Leaf,
  crops: TrendingUp,
  sustainability: Leaf,
  market: Truck,
  technology: Cpu,
  livestock: Users,
  aquaculture: Fish,
};

const categoryColors = {
  general: "bg-green-100 text-green-800 border-green-200",
  crops: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  sustainability: "bg-emerald-100 text-emerald-800 border-emerald-200",
  market: "bg-blue-100 text-blue-800 border-blue-200",
  technology: "bg-purple-100 text-purple-800 border-purple-200",
  livestock: "bg-orange-100 text-orange-800 border-orange-200",
  aquaculture: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export const NewsFeed = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    
    // Auto-refresh news every 5 minutes
    const interval = setInterval(fetchPosts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load news posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openNewsModal = async (post: NewsPost) => {
    // Increment views
    await incrementViews(post.id);
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const incrementViews = async (postId: string) => {
    try {
      // Get current views count first
      const { data: currentPost } = await supabase
        .from("news_posts")
        .select("views")
        .eq("id", postId)
        .single();

      if (currentPost) {
        const { error } = await supabase
          .from("news_posts")
          .update({ views: currentPost.views + 1 })
          .eq("id", postId);

        if (error) {
          console.error("Error incrementing views:", error);
        } else {
          // Update local state to reflect the change
          setPosts(prev => prev.map(post => 
            post.id === postId ? { ...post, views: post.views + 1 } : post
          ));
          setFilteredPosts(prev => prev.map(post => 
            post.id === postId ? { ...post, views: post.views + 1 } : post
          ));
        }
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Nigeria Farm News & Updates
          </h2>
          <p className="text-green-600 max-w-2xl mx-auto">
            Stay informed with the latest developments in Nigerian agriculture, 
            market trends, and farming innovations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="crops">Crops & Cultivation</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
              <SelectItem value="market">Market & Trade</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="livestock">Livestock</SelectItem>
              <SelectItem value="aquaculture">Aquaculture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Posts */}
        {selectedCategory === "all" && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-green-800 mb-6">Featured Stories</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.filter(post => post.featured).slice(0, 2).map((post) => {
                const CategoryIcon = categoryIcons[post.category as keyof typeof categoryIcons] || Leaf;
                
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${categoryColors[post.category as keyof typeof categoryColors] || categoryColors.general}`}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
                      <CardDescription className="text-green-700">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views} views</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {post.content.substring(0, 200)}...
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openNewsModal(post)}
                      >
                        Read Full Story
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-green-800">
            {selectedCategory === "all" ? "Latest News" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const CategoryIcon = categoryIcons[post.category as keyof typeof categoryIcons] || Leaf;
              
              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${categoryColors[post.category as keyof typeof categoryColors] || categoryColors.general}`}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </Badge>
                      {post.featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt || post.content.substring(0, 120) + "..."}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => openNewsModal(post)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No news posts found in this category.</p>
            </div>
          )}
        </div>
      </div>
      
      <NewsModal 
        post={selectedPost} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};