import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, Calendar } from "lucide-react";

interface Activity {
  id: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  // Mock activities if none provided
  const mockActivities = [
    {
      id: '1',
      description: 'Assignment submitted: Physics Lab Report',
      time: '2 hours ago',
      type: 'success' as const,
    },
    {
      id: '2',
      description: 'Received grade: Mathematics - 89%',
      time: '1 day ago',
      type: 'info' as const,
    },
    {
      id: '3',
      description: 'New assignment: English Essay due Dec 1',
      time: '2 days ago',
      type: 'warning' as const,
    },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'info':
        return <Star className="text-primary" size={16} />;
      case 'warning':
        return <Calendar className="text-orange-600" size={16} />;
      default:
        return <CheckCircle className="text-green-600" size={16} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'info':
        return 'bg-primary/10';
      case 'warning':
        return 'bg-orange-100';
      default:
        return 'bg-green-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`w-8 h-8 ${getBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
