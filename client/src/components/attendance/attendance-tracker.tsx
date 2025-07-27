import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  recordedBy: string;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
  };
}

interface AttendanceTrackerProps {
  userRole: string;
  classId?: string;
  studentId?: string;
}

export default function AttendanceTracker({ userRole, classId, studentId }: AttendanceTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newStatus, setNewStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const queryClient = useQueryClient();

  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ['/api/attendance', { studentId, classId, date: format(selectedDate, 'yyyy-MM-dd') }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (studentId) params.set('studentId', studentId);
      if (classId) params.set('classId', classId);
      params.set('date', format(selectedDate, 'yyyy-MM-dd'));
      
      return fetch(`/api/attendance?${params}`, {
        credentials: 'include',
      }).then(res => res.json());
    },
  });

  const recordAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: { studentId: string; classId: string; date: string; status: string }) => {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(attendanceData),
      });
      if (!response.ok) throw new Error('Failed to record attendance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="text-green-500" size={16} />;
      case 'absent': return <XCircle className="text-red-500" size={16} />;
      case 'late': return <Clock className="text-orange-500" size={16} />;
      case 'excused': return <CheckCircle className="text-blue-500" size={16} />;
      default: return <User className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'excused': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRecordAttendance = () => {
    if (studentId && classId) {
      recordAttendanceMutation.mutate({
        studentId,
        classId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: newStatus,
      });
    }
  };

  const getAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter((a: Attendance) => a.status === 'present').length;
    const absent = attendance.filter((a: Attendance) => a.status === 'absent').length;
    const late = attendance.filter((a: Attendance) => a.status === 'late').length;
    const excused = attendance.filter((a: Attendance) => a.status === 'excused').length;
    
    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Tracker</CardTitle>
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Attendance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Quick Record for Teachers */}
          {userRole === 'teacher' && studentId && classId && (
            <div className="flex items-center gap-2">
              <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleRecordAttendance}
                disabled={recordAttendanceMutation.isPending}
                size="sm"
              >
                {recordAttendanceMutation.isPending ? "Recording..." : "Record"}
              </Button>
            </div>
          )}
        </div>

        {/* Statistics */}
        {stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
              <p className="text-sm text-green-600">Present</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
              <p className="text-sm text-red-600">Absent</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-2xl font-bold text-orange-700">{stats.late}</p>
              <p className="text-sm text-orange-600">Late</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
              <p className="text-sm text-blue-600">Excused</p>
            </div>
          </div>
        )}

        {/* Attendance Records */}
        <div className="space-y-3">
          {attendance.length > 0 ? (
            attendance.map((record: Attendance, index: number) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-background hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    {getStatusIcon(record.status)}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">
                      {record.student ? 
                        `${record.student.firstName} ${record.student.lastName}` : 
                        'Unknown Student'
                      }
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(record.status)} border`}>
                    {record.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(record.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No attendance records for this date</p>
              <p className="text-sm text-muted-foreground">
                {userRole === 'teacher' ? "Use the form above to record attendance" : "Records will appear here once marked"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}