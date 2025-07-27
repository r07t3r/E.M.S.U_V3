import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  // Mock announcements if none provided
  const mockAnnouncements = [
    {
      id: '1',
      title: 'Mid-Term Break Schedule',
      content: 'Mid-term break will commence on December 5th and resume on January 8th, 2024.',
      priority: 'normal',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Fee Payment Reminder',
      content: 'Second term fees are due by December 1st. Please ensure payment is completed on time.',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Science Fair 2024',
      content: 'Registration for Science Fair 2024 is now open. Deadline: December 15th.',
      priority: 'normal',
      createdAt: new Date().toISOString(),
    },
  ];

  const displayAnnouncements = announcements.length > 0 ? announcements : mockAnnouncements;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-primary/5 border-primary/20';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-orange-800';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayAnnouncements.map((announcement) => (
            <div key={announcement.id} className={`p-4 rounded-lg border ${getPriorityColor(announcement.priority)}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-medium ${getPriorityTextColor(announcement.priority)}`}>
                  {announcement.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-sm ${getPriorityTextColor(announcement.priority)}/80`}>
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
