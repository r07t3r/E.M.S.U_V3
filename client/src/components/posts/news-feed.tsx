import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Newspaper, Plus, Calendar, Eye, Heart, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface Post {
  id: string;
  authorId: string;
  schoolId: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: 'academic' | 'sports' | 'events' | 'general';
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface NewsFeedProps {
  userRole: string;
}

export default function NewsFeed({ userRole }: NewsFeedProps) {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general" as const,
    imageUrl: ""
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setNewPost({ title: "", content: "", category: "general", imageUrl: "" });
      setIsCreateOpen(false);
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      createPostMutation.mutate(newPost);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return '📚';
      case 'sports': return '⚽';
      case 'events': return '🎉';
      case 'general': return '📝';
      default: return '📝';
    }
  };

  const filteredPosts = selectedCategory === "all" 
    ? (posts as Post[])
    : (posts as Post[]).filter((post: Post) => post.category === selectedCategory);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School News Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          School News Feed
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          
          {['teacher', 'principal', 'proprietor'].includes(userRole) && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create News Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Post title"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select value={newPost.category} onValueChange={(value: any) => setNewPost(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Image URL (Optional)</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={newPost.imageUrl}
                      onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Write your post content..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createPostMutation.isPending}>
                      {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: Post, index: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getCategoryIcon(post.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          By {post.author ? 
                            `${post.author.firstName} ${post.author.lastName} (${post.author.role})` : 
                            'Unknown Author'
                          }
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>

                {post.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-foreground leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart size={16} />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare size={16} />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Eye size={16} />
                      <span>Read More</span>
                    </button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Published {new Date(post.publishedAt).toLocaleTimeString()}
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="text-center py-12">
              <Newspaper className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-4">
                {selectedCategory === "all" ? "No posts available yet" : `No ${selectedCategory} posts available`}
              </p>
              <p className="text-sm text-muted-foreground">
                {['teacher', 'principal', 'proprietor'].includes(userRole) ? 
                  "Be the first to share some news with the school community" :
                  "Check back later for updates from teachers and administrators"
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}