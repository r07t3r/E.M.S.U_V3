import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  academicSessionId: string;
  isActive: boolean;
  createdAt: string;
  subject?: {
    name: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

interface ClassTimetableProps {
  classId: string;
}

export default function ClassTimetable({ classId }: ClassTimetableProps) {
  const { data: timetable = [], isLoading } = useQuery({
    queryKey: ['/api/timetable', classId],
    queryFn: () => fetch(`/api/timetable/${classId}`, {
      credentials: 'include',
    }).then(res => res.json()),
  });

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  const getTimeSlots = () => {
    const slots = new Set<string>();
    timetable.forEach((entry: TimetableEntry) => {
      slots.add(`${entry.startTime}-${entry.endTime}`);
    });
    return Array.from(slots).sort();
  };

  const getDaysOfWeek = () => {
    const days = new Set<number>();
    timetable.forEach((entry: TimetableEntry) => {
      if (entry.dayOfWeek >= 1 && entry.dayOfWeek <= 5) { // Monday to Friday
        days.add(entry.dayOfWeek);
      }
    });
    return Array.from(days).sort();
  };

  const getEntryForDayAndTime = (dayOfWeek: number, timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split('-');
    return timetable.find((entry: TimetableEntry) => 
      entry.dayOfWeek === dayOfWeek && 
      entry.startTime === startTime && 
      entry.endTime === endTime
    );
  };

  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-cyan-100 text-cyan-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
    ];
    
    const hash = subject.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Class Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeSlots = getTimeSlots();
  const daysOfWeek = getDaysOfWeek();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Class Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timetable.length > 0 ? (
          <div className="space-y-6">
            {/* Grid View */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-6 gap-2 mb-4">
                  <div className="font-medium text-sm p-2 text-center bg-muted rounded">
                    Time
                  </div>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="font-medium text-sm p-2 text-center bg-muted rounded">
                      {getDayName(day)}
                    </div>
                  ))}
                </div>
                
                {timeSlots.map((timeSlot, slotIndex) => (
                  <motion.div
                    key={timeSlot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: slotIndex * 0.1 }}
                    className="grid grid-cols-6 gap-2 mb-2"
                  >
                    <div className="text-sm p-3 text-center bg-background border rounded flex items-center justify-center">
                      <div>
                        <div className="font-medium">{timeSlot.split('-')[0]}</div>
                        <div className="text-xs text-muted-foreground">{timeSlot.split('-')[1]}</div>
                      </div>
                    </div>
                    
                    {daysOfWeek.map((day) => {
                      const entry = getEntryForDayAndTime(day, timeSlot);
                      
                      return (
                        <div key={`${day}-${timeSlot}`} className="text-sm p-3 border rounded min-h-[80px]">
                          {entry ? (
                            <div className="space-y-2">
                              <Badge className={`text-xs ${getSubjectColor(entry.subject?.name || 'Unknown')}`}>
                                {entry.subject?.name || 'Unknown Subject'}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {entry.teacher ? 
                                  `${entry.teacher.firstName} ${entry.teacher.lastName}` : 
                                  'Unknown Teacher'
                                }
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground text-center">
                              Free Period
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* List View for Mobile */}
            <div className="md:hidden space-y-4">
              {daysOfWeek.map((day, dayIndex) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.1 }}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-muted p-3 font-medium">
                    {getDayName(day)}
                  </div>
                  <div className="p-3 space-y-3">
                    {timeSlots.map((timeSlot) => {
                      const entry = getEntryForDayAndTime(day, timeSlot);
                      
                      return (
                        <div key={timeSlot} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{timeSlot}</span>
                          </div>
                          
                          {entry ? (
                            <div className="text-right">
                              <Badge className={`text-xs ${getSubjectColor(entry.subject?.name || 'Unknown')}`}>
                                {entry.subject?.name || 'Unknown'}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {entry.teacher ? 
                                  `${entry.teacher.firstName} ${entry.teacher.lastName}` : 
                                  'Unknown Teacher'
                                }
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Free Period</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground mt-4">No timetable available</p>
            <p className="text-sm text-muted-foreground">
              The class timetable will be displayed here once it's created
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}