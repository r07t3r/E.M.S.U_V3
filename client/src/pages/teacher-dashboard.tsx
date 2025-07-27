import { User } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import NotificationList from "@/components/notifications/notification-list";
import MessageList from "@/components/messages/message-list";
import AttendanceTracker from "@/components/attendance/attendance-tracker";
import AssignmentManager from "@/components/assignments/assignment-manager";
import NewsFeed from "@/components/posts/news-feed";
import CommentSection from "@/components/comments/comment-section";
import ClassTimetable from "@/components/timetable/class-timetable";
import { Users, BookOpen, Calendar, MessageSquare } from "lucide-react";

interface TeacherDashboardProps {
  user: User;
  data: any;
}

export default function TeacherDashboard({ user, data }: TeacherDashboardProps) {
  const sidebarItems = [
    { icon: "home", label: "Dashboard", href: "/", active: true },
    { icon: "users", label: "My Classes", href: "/classes" },
    { icon: "book-open", label: "Subjects", href: "/subjects" },
    { icon: "chart-line", label: "Grades", href: "/grades" },
    { icon: "calendar-check", label: "Attendance", href: "/attendance" },
    { icon: "tasks", label: "Assignments", href: "/assignments" },
    { icon: "comments", label: "Messages", href: "/messages" },
    { icon: "file-text", label: "Reports", href: "/reports" },
  ];

  const totalClasses = data.classes?.length || 0;
  const totalStudents = data.classes?.reduce((sum: number, cls: any) => sum + (cls.studentCount || 0), 0) || 0;
  const totalSubjects = data.subjects?.length || 0;
  const unreadMessages = data.messages?.filter((m: any) => !m.isRead).length || 0;

  return (
    <DashboardLayout 
      user={user} 
      sidebarItems={sidebarItems}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
        department: data.teacher?.department || "Not Assigned"
      }}
    >
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}! 👨‍🏫
          </h2>
          <p className="text-muted-foreground">Here's an overview of your teaching activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Users className="text-primary" size={24} />}
            title="Total Classes"
            value={totalClasses.toString()}
            subtitle="This term"
            trend={null}
          />
          <StatsCard
            icon={<Users className="text-green-600" size={24} />}
            title="Total Students"
            value={totalStudents.toString()}
            subtitle="Across all classes"
            trend={null}
          />
          <StatsCard
            icon={<BookOpen className="text-blue-600" size={24} />}
            title="Subjects Teaching"
            value={totalSubjects.toString()}
            subtitle="Active subjects"
            trend={null}
          />
          <StatsCard
            icon={<MessageSquare className="text-orange-600" size={24} />}
            title="Unread Messages"
            value={unreadMessages.toString()}
            subtitle="From students & parents"
            trend={null}
          />
        </div>

        {/* Teacher-specific content would go here */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">My Classes</h3>
            <div className="space-y-4">
              {data.classes?.length > 0 ? (
                data.classes.map((cls: any) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{cls.name}</h4>
                      <p className="text-sm text-muted-foreground">{cls.studentCount || 0} students</p>
                    </div>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No classes assigned yet.</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Messages</h3>
            <div className="space-y-4">
              {data.messages?.length > 0 ? (
                data.messages.slice(0, 5).map((message: any) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">From: {message.sender?.firstName} {message.sender?.lastName}</p>
                    </div>
                    {!message.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No messages yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Comprehensive Teacher Dashboard Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Main Teaching Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications and Messages Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <NotificationList />
              <MessageList />
            </div>
            
            {/* Attendance Management */}
            <AttendanceTracker 
              userRole="teacher" 
              classId={data.teacher?.classes?.[0]?.id} 
            />
            
            {/* Assignment Management */}
            <AssignmentManager 
              userRole="teacher" 
              classId={data.teacher?.classes?.[0]?.id} 
            />
            
            {/* Class Timetable */}
            {data.teacher?.classes?.[0]?.id && (
              <ClassTimetable classId={data.teacher.classes[0].id} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <NewsFeed userRole="teacher" />
            <CommentSection 
              parentType="teacher" 
              parentId={data.teacher?.id || user.id} 
              title="Class Comments" 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
