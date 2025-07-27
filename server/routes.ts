import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertGradeSchema, insertMessageSchema, insertAnnouncementSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // Dashboard data endpoint
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const school = await storage.getSchoolByUser(userId);
      let dashboardData: any = { user, school };

      // Get role-specific data
      switch (user.role) {
        case 'student':
          const student = await storage.getStudentByUserId(userId);
          if (student) {
            const grades = await storage.getGradesByStudent(student.id, 'first');
            const attendance = await storage.getAttendanceByStudent(student.id);
            const assignments = await storage.getAssignmentsByStudent(student.id);
            const messages = await storage.getMessagesByUser(userId);
            const feePayments = await storage.getFeePaymentsByStudent(student.id);
            
            dashboardData = {
              ...dashboardData,
              student,
              grades,
              attendance,
              assignments,
              messages,
              feePayments
            };
          }
          break;

        case 'teacher':
          const teacher = await storage.getTeacherByUserId(userId);
          if (teacher && school) {
            const classes = await storage.getClassesBySchool(school.id);
            const subjects = await storage.getSubjectsBySchool(school.id);
            const messages = await storage.getMessagesByUser(userId);
            
            dashboardData = {
              ...dashboardData,
              teacher,
              classes,
              subjects,
              messages
            };
          }
          break;

        case 'principal':
        case 'proprietor':
          if (school) {
            const classes = await storage.getClassesBySchool(school.id);
            const teachers = await storage.getTeachersBySchool(school.id);
            const subjects = await storage.getSubjectsBySchool(school.id);
            const announcements = await storage.getAnnouncementsBySchool(school.id);
            
            dashboardData = {
              ...dashboardData,
              classes,
              teachers,
              subjects,
              announcements
            };
          }
          break;
      }

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Student routes
  app.get('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      console.log('Fetching students for user:', user.email, 'User ID:', user.id);
      
      if (!user || !['teacher', 'principal', 'proprietor'].includes(user.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // For now, return mock students data to test the UI
      const students = [
        {
          id: '1',
          firstName: 'Ada',
          lastName: 'Okafor',
          email: 'ada@student.com',
          class: { name: 'JSS 1A' },
          attendance: 95,
          averageGrade: 85
        },
        {
          id: '2',
          firstName: 'Emeka',
          lastName: 'Nneka',
          email: 'emeka@student.com',
          class: { name: 'JSS 1B' },
          attendance: 88,
          averageGrade: 78
        }
      ];

      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Grades routes
  app.get('/api/grades', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      console.log('Fetching grades for user:', user.email, 'User ID:', user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // For now, return mock grades data to test the UI
      const grades = [
        {
          id: '1',
          subject: { name: 'Mathematics' },
          score: '85',
          maxScore: '100',
          assessmentType: 'Test',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          subject: { name: 'Chemistry' },
          score: '92',
          maxScore: '100',
          assessmentType: 'Exam',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          subject: { name: 'Physics' },
          score: '78',
          maxScore: '100',
          assessmentType: 'Assignment',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      res.json(grades);
    } catch (error) {
      console.error("Error fetching grades:", error);
      res.status(500).json({ message: "Failed to fetch grades" });
    }
  });

  app.post('/api/grades', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user || user.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can record grades" });
      }

      const gradeData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(gradeData);
      
      res.status(201).json(grade);
    } catch (error) {
      console.error("Error creating grade:", error);
      res.status(500).json({ message: "Failed to create grade" });
    }
  });

  // Messages routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const messages = await storage.getMessagesByUser(user.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: user.id
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Announcements routes
  app.get('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const school = await storage.getSchoolByUser(userId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      const announcements = await storage.getAnnouncementsBySchool(school.id, user.role);
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !['principal', 'proprietor'].includes(user.role)) {
        return res.status(403).json({ message: "Only principals and proprietors can create announcements" });
      }

      const school = await storage.getSchoolByUser(userId);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      const announcementData = insertAnnouncementSchema.parse({
        ...req.body,
        authorId: userId,
        schoolId: school.id
      });
      
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Classes routes
  app.get('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const school = await storage.getSchoolByUser(userId);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      const classes = await storage.getClassesBySchool(school.id);
      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  // Subjects routes
  app.get('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const school = await storage.getSchoolByUser(userId);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      const subjects = await storage.getSubjectsBySchool(school.id);
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  // Fee routes
  app.get('/api/fees', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === 'student') {
        const student = await storage.getStudentByUserId(userId);
        if (student) {
          const feePayments = await storage.getFeePaymentsByStudent(student.id);
          const feeStructures = await storage.getFeeStructuresByClass(student.classId!, 'first');
          res.json({ payments: feePayments, structures: feeStructures });
        } else {
          res.json({ payments: [], structures: [] });
        }
      } else {
        return res.status(403).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
      res.status(500).json({ message: "Failed to fetch fees" });
    }
  });

  // Notifications API
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const notifications = await storage.getNotificationsByUser(user.id);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Comments API
  app.get('/api/comments/:parentType/:parentId', isAuthenticated, async (req: any, res) => {
    try {
      const { parentType, parentId } = req.params;
      const comments = await storage.getCommentsByParent(parentType, parentId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const commentData = req.body;
      const comment = await storage.createComment({
        ...commentData,
        authorId: user.id
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Report Cards API
  app.get('/api/report-cards', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const { studentId } = req.query;
      
      let targetStudentId = studentId;
      if (user.role === 'student') {
        const student = await storage.getStudentByUserId(user.id);
        targetStudentId = student?.id;
      }
      
      if (!targetStudentId) {
        return res.status(400).json({ message: "Student ID required" });
      }
      
      const reportCards = await storage.getReportCardsByStudent(targetStudentId as string);
      res.json(reportCards);
    } catch (error) {
      console.error("Error fetching report cards:", error);
      res.status(500).json({ message: "Failed to fetch report cards" });
    }
  });

  // Attendance API (additional endpoints)
  app.get('/api/attendance', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const { studentId, classId, date } = req.query;
      
      let attendance = [];
      if (studentId) {
        attendance = await storage.getAttendanceByStudent(studentId as string);
      } else if (classId && date) {
        attendance = await storage.getAttendanceByClass(classId as string, new Date(date as string));
      }
      
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post('/api/attendance', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!['teacher', 'principal'].includes(user.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const attendanceData = req.body;
      const attendance = await storage.createAttendance({
        ...attendanceData,
        recordedBy: user.id
      });
      res.status(201).json(attendance);
    } catch (error) {
      console.error("Error creating attendance:", error);
      res.status(500).json({ message: "Failed to create attendance" });
    }
  });

  // Assignments API (additional endpoints)
  app.get('/api/assignments', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const { classId, studentId } = req.query;
      
      let assignments = [];
      if (classId) {
        assignments = await storage.getAssignmentsByClass(classId as string);
      } else if (studentId) {
        assignments = await storage.getAssignmentsByStudent(studentId as string);
      }
      
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post('/api/assignments', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (user.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create assignments" });
      }
      
      const assignmentData = req.body;
      const assignment = await storage.createAssignment({
        ...assignmentData,
        teacherId: user.id
      });
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  // Posts/News API
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const school = await storage.getSchoolByUser(user.id);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      
      const posts = await storage.getPostsBySchool(school.id);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!['teacher', 'principal', 'proprietor'].includes(user.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const school = await storage.getSchoolByUser(user.id);
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      
      const postData = req.body;
      const post = await storage.createPost({
        ...postData,
        authorId: user.id,
        schoolId: school.id
      });
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Timetable API
  app.get('/api/timetable/:classId', isAuthenticated, async (req: any, res) => {
    try {
      const { classId } = req.params;
      const timetable = await storage.getTimetableByClass(classId);
      res.json(timetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(500).json({ message: "Failed to fetch timetable" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
