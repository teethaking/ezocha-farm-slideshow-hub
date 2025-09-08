import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

interface NewsModalProps {
  post: NewsPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors = {
  general: "bg-green-100 text-green-800 border-green-200",
  crops: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  sustainability: "bg-emerald-100 text-emerald-800 border-emerald-200",
  market: "bg-blue-100 text-blue-800 border-blue-200",
  technology: "bg-purple-100 text-purple-800 border-purple-200",
  livestock: "bg-orange-100 text-orange-800 border-orange-200",
  aquaculture: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export const NewsModal = ({ post, isOpen, onClose }: NewsModalProps) => {
  if (!post) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${categoryColors[post.category as keyof typeof categoryColors] || categoryColors.general}`}>
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
              {post.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Featured
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight pr-8">
            {post.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Meta */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
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

          <Separator />

          {/* Featured Image */}
          {post.image_url && (
            <div className="w-full h-64 rounded-lg overflow-hidden bg-green-50">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-green max-w-none">
            <div className="text-lg text-muted-foreground mb-4 italic">
              {post.excerpt}
            </div>
            
            <div className="text-base leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>

          <Separator />
          
          {/* Article Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
            <div>
              <p className="font-medium">Published by {post.author_name}</p>
              <p>Ezocha Farms - Fresh insights into Nigerian agriculture</p>
            </div>
            <div className="text-right">
              <p>{formatDate(post.published_at)}</p>
              <p>{post.views} views</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};