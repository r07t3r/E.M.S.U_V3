import { User } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import RecentGrades from "@/components/dashboard/recent-grades";
import Schedule from "@/components/dashboard/schedule";
import ActivityFeed from "@/components/dashboard/activity-feed";
import Announcements from "@/components/dashboard/announcements";
import NotificationList from "@/components/notifications/notification-list";
import MessageList from "@/components/messages/message-list";
import ReportCardViewer from "@/components/reports/report-card-viewer";
import AttendanceTracker from "@/components/attendance/attendance-tracker";
import AssignmentManager from "@/components/assignments/assignment-manager";
import NewsFeed from "@/components/posts/news-feed";
import CommentSection from "@/components/comments/comment-section";
import ClassTimetable from "@/components/timetable/class-timetable";
import { Book, TrendingUp, Clock, Calendar } from "lucide-react";

interface StudentDashboardProps {
  user: User;
  data: any;
}

export default function StudentDashboard({ user, data }: StudentDashboardProps) {
  const sidebarItems = [
    { icon: "home", label: "Dashboard", href: "/", active: true },
    { icon: "users", label: "My Classes", href: "/classes" },
    { icon: "chart-line", label: "Grades", href: "/grades" },
    { icon: "calendar-check", label: "Attendance", href: "/attendance" },
    { icon: "tasks", label: "Assignments", href: "/assignments" },
    { icon: "comments", label: "Messages", href: "/messages" },
    { icon: "credit-card", label: "Fees", href: "/fees" },
  ];

  // Calculate stats from data
  const totalSubjects = data.subjects?.length || 0;
  const averageGrade = data.grades?.length > 0 
    ? (data.grades.reduce((sum: number, grade: any) => sum + parseFloat(grade.score || 0), 0) / data.grades.length).toFixed(1)
    : "0";
  const pendingAssignments = data.assignments?.filter((a: any) => !a.submitted).length || 0;
  const attendanceRate = data.attendance?.length > 0
    ? Math.round((data.attendance.filter((a: any) => a.status === 'present').length / data.attendance.length) * 100)
    : 0;

  return (
    <DashboardLayout 
      user={user} 
      sidebarItems={sidebarItems}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
        class: data.student?.class?.name || "Not Assigned"
      }}
    >
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}! 👋
          </h2>
          <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Book className="text-primary" size={24} />}
            title="Total Subjects"
            value={totalSubjects.toString()}
            subtitle="Active this term"
            trend={null}
          />
          <StatsCard
            icon={<TrendingUp className="text-green-600" size={24} />}
            title="Average Grade"
            value={`${averageGrade}%`}
            subtitle="+5.2% from last term"
            trend="positive"
          />
          <StatsCard
            icon={<Clock className="text-orange-600" size={24} />}
            title="Pending Assignments"
            value={pendingAssignments.toString()}
            subtitle="Due this week"
            trend={null}
          />
          <StatsCard
            icon={<Calendar className="text-primary" size={24} />}
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            subtitle="This term"
            trend="positive"
          />
        </div>

        {/* Main Content Grid with Comprehensive Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
            <RecentGrades grades={data.grades || []} />
            
            {/* Notifications and Messages Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <NotificationList />
              <MessageList />
            </div>
            
            {/* Report Cards */}
            <ReportCardViewer studentId={data.student?.id} />
            
            {/* Attendance Tracking */}
            <AttendanceTracker 
              userRole="student" 
              studentId={data.student?.id} 
              classId={data.student?.classId} 
            />
            
            {/* Assignment Management */}
            <AssignmentManager 
              userRole="student" 
              studentId={data.student?.id} 
              classId={data.student?.classId} 
            />
            
            {/* Class Timetable */}
            {data.student?.classId && (
              <ClassTimetable classId={data.student.classId} />
            )}
            
            {/* Today's Schedule */}
            <Schedule schedule={data.schedule || []} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Announcements announcements={data.announcements || []} />
            <NewsFeed userRole="student" />
            <ActivityFeed activities={data.activities || []} />
            <CommentSection 
              parentType="student" 
              parentId={data.student?.id || "unknown"} 
              title="My Comments" 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
