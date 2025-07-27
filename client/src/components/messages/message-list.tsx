import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send, User, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export default function MessageList() {
  const [newMessage, setNewMessage] = useState({
    recipientId: "",
    subject: "",
    content: ""
  });
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/messages'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: typeof newMessage) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setNewMessage({ recipientId: "", subject: "", content: "" });
      setIsComposeOpen(false);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.subject && newMessage.content && newMessage.recipientId) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
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
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient ID</label>
                <Input
                  placeholder="Enter recipient user ID"
                  value={newMessage.recipientId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipientId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Message subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={sendMessageMutation.isPending}>
                  {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.length > 0 ? (
            messages.map((message: Message, index: number) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  message.isRead 
                    ? 'bg-muted/50 border-border/50' 
                    : 'bg-background border-primary/20 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="text-primary" size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-medium text-sm ${
                          message.isRead ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {message.subject}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          From: {message.sender ? 
                            `${message.sender.firstName} ${message.sender.lastName} (${message.sender.role})` : 
                            'Unknown User'
                          }
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mt-2 line-clamp-2 ${
                      message.isRead ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {message.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={message.isRead ? "secondary" : "default"} className="text-xs">
                        {message.isRead ? "Read" : "Unread"}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No messages yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}