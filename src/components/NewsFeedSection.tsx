import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Eye, Leaf, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const NewsFeedSection = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  const fetchNewsPosts = async () => {
    try {
      setIsLoading(true);
      
      const { data: postsData, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) throw error;

      const allPosts = postsData || [];
      setPosts(allPosts);
      setFeaturedPosts(allPosts.filter(post => post.featured));
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load news feed",
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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'crops': 'bg-green-100 text-green-800',
      'livestock': 'bg-blue-100 text-blue-800',
      'technology': 'bg-purple-100 text-purple-800',
      'sustainability': 'bg-emerald-100 text-emerald-800',
      'market': 'bg-orange-100 text-orange-800',
      'aquaculture': 'bg-cyan-100 text-cyan-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['general'];
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading farm news...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-green-800">Farm News & Updates</h2>
          </div>
          <p className="text-green-600 max-w-2xl mx-auto">
            Stay updated with the latest developments in Nigerian agriculture, farming techniques, and market insights
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Featured Stories
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Leaf className="h-16 w-16 text-green-400" />
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </Badge>
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                      </div>
                      <span>{post.author_name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator className="mb-12" />

        {/* All Posts */}
        <div>
          <h3 className="text-xl font-semibold text-green-800 mb-6">Latest Updates</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </Badge>
                    {post.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </span>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {posts.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};