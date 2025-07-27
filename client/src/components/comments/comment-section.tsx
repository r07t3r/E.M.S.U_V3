import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, User } from "lucide-react";
import { motion } from "framer-motion";

interface Comment {
  id: string;
  authorId: string;
  parentType: string;
  parentId: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface CommentSectionProps {
  parentType: string;
  parentId: string;
  title?: string;
}

export default function CommentSection({ parentType, parentId, title }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['/api/comments', parentType, parentId],
    queryFn: () => fetch(`/api/comments/${parentType}/${parentId}`, {
      credentials: 'include',
    }).then(res => res.json()),
  });

  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { parentType: string; parentId: string; content: string }) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(commentData),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments', parentType, parentId] });
      setNewComment("");
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate({
        parentType,
        parentId,
        content: newComment.trim()
      });
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      case 'principal': return 'bg-purple-500';
      case 'proprietor': return 'bg-red-500';
      case 'parent': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title || "Comments"} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!newComment.trim() || addCommentMutation.isPending}
              size="sm"
              className="gap-2"
            >
              <Send size={16} />
              {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment: Comment, index: number) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className={`text-white ${getRoleColor(comment.author?.role)}`}>
                    {getInitials(comment.author?.firstName, comment.author?.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">
                      {comment.author ? 
                        `${comment.author.firstName} ${comment.author.lastName}` : 
                        'Unknown User'
                      }
                    </h4>
                    {comment.author?.role && (
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${getRoleColor(comment.author.role)}`}>
                        {comment.author.role}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed">
                    {comment.content}
                  </p>
                  
                  {comment.updatedAt !== comment.createdAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Edited {new Date(comment.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No comments yet</p>
              <p className="text-sm text-muted-foreground">
                Be the first to share your thoughts
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}