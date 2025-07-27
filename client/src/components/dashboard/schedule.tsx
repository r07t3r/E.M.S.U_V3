import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  current?: boolean;
}

interface ScheduleProps {
  schedule: ScheduleItem[];
}

export default function Schedule({ schedule }: ScheduleProps) {
  // Mock schedule data if none provided
  const mockSchedule = [
    { id: '1', time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Adebayo', current: true },
    { id: '2', time: '10:00 AM', subject: 'Chemistry', teacher: 'Mrs. Okafor' },
    { id: '3', time: '11:00 AM', subject: 'Physics', teacher: 'Dr. Emeka' },
  ];

  const displaySchedule = schedule.length > 0 ? schedule : mockSchedule;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displaySchedule.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center space-x-4 p-3 rounded-lg ${
                item.current ? 'bg-primary/10' : 'bg-muted'
              }`}
            >
              <div className="text-center">
                <p className={`text-sm font-medium ${
                  item.current ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.time.split(' ')[0]}
                </p>
                <p className={`text-xs ${
                  item.current ? 'text-primary/70' : 'text-muted-foreground'
                }`}>
                  {item.time.split(' ')[1]}
                </p>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item.subject}</h4>
                <p className="text-sm text-muted-foreground">{item.teacher}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                item.current ? 'bg-primary' : 'bg-muted-foreground'
              }`}></div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10">
          View Full Timetable
        </Button>
      </CardContent>
    </Card>
  );
}
