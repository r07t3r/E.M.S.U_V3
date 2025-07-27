import { User } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import NotificationList from "@/components/notifications/notification-list";
import MessageList from "@/components/messages/message-list";
import NewsFeed from "@/components/posts/news-feed";
import CommentSection from "@/components/comments/comment-section";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";

interface PrincipalDashboardProps {
  user: User;
  data: any;
}

export default function PrincipalDashboard({ user, data }: PrincipalDashboardProps) {
  const sidebarItems = [
    { icon: "home", label: "Dashboard", href: "/", active: true },
    { icon: "users", label: "Students", href: "/students" },
    { icon: "graduation-cap", label: "Teachers", href: "/teachers" },
    { icon: "book-open", label: "Classes", href: "/classes" },
    { icon: "chart-line", label: "Academic Reports", href: "/reports" },
    { icon: "calendar-check", label: "Attendance", href: "/attendance" },
    { icon: "megaphone", label: "Announcements", href: "/announcements" },
    { icon: "credit-card", label: "Fee Management", href: "/fees" },
    { icon: "settings", label: "School Settings", href: "/settings" },
  ];

  const totalStudents = data.students?.length || 0;
  const totalTeachers = data.teachers?.length || 0;
  const totalClasses = data.classes?.length || 0;
  const schoolPerformance = data.schoolPerformance || 85;

  return (
    <DashboardLayout 
      user={user} 
      sidebarItems={sidebarItems}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
        school: data.school?.name || "School Name"
      }}
    >
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Principal Dashboard 🎓
          </h2>
          <p className="text-muted-foreground">Manage your school's academic and administrative activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Users className="text-primary" size={24} />}
            title="Total Students"
            value={totalStudents.toString()}
            subtitle="Enrolled this term"
            trend="positive"
          />
          <StatsCard
            icon={<GraduationCap className="text-green-600" size={24} />}
            title="Teaching Staff"
            value={totalTeachers.toString()}
            subtitle="Active teachers"
            trend={null}
          />
          <StatsCard
            icon={<BookOpen className="text-blue-600" size={24} />}
            title="Active Classes"
            value={totalClasses.toString()}
            subtitle="This academic session"
            trend={null}
          />
          <StatsCard
            icon={<TrendingUp className="text-orange-600" size={24} />}
            title="School Performance"
            value={`${schoolPerformance}%`}
            subtitle="Overall average"
            trend="positive"
          />
        </div>

        {/* Principal-specific content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Class Overview</h3>
            <div className="space-y-4">
              {data.classes?.length > 0 ? (
                data.classes.map((cls: any) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{cls.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cls.studentCount || 0} students • {cls.classTeacher?.name || 'No teacher assigned'}
                      </p>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No classes configured yet.</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Announcements</h3>
            <div className="space-y-4">
              {data.announcements?.length > 0 ? (
                data.announcements.slice(0, 5).map((announcement: any) => (
                  <div key={announcement.id} className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-primary">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No announcements yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Comprehensive Principal Dashboard Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Main Administrative Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications and Messages Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <NotificationList />
              <MessageList />
            </div>
            
            {/* School News Management */}
            <NewsFeed userRole="principal" />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <CommentSection 
              parentType="school" 
              parentId={data.school?.id || "school"} 
              title="School Comments" 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
