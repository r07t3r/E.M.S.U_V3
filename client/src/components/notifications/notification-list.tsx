import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertCircle, Calendar, BookOpen, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'grade' | 'attendance' | 'fee' | 'announcement' | 'assignment';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export default function NotificationList() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grade': return BookOpen;
      case 'attendance': return Calendar;
      case 'fee': return DollarSign;
      case 'announcement': return Bell;
      case 'assignment': return BookOpen;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'grade': return 'bg-blue-500';
      case 'attendance': return 'bg-orange-500';
      case 'fee': return 'bg-green-500';
      case 'announcement': return 'bg-purple-500';
      case 'assignment': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
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
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <Badge variant="secondary">
          {notifications.filter((n: Notification) => !n.isRead).length} unread
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification: Notification, index: number) => {
              const IconComponent = getTypeIcon(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    notification.isRead 
                      ? 'bg-muted/50 border-border/50' 
                      : 'bg-background border-primary/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      <IconComponent className="text-white" size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-medium text-sm ${
                          notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              className="h-6 w-6 p-0"
                            >
                              <Check size={12} />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No notifications yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}