import {
  users,
  students,
  teachers,
  classes,
  subjects,
  grades,
  attendance,
  assignments,
  messages,
  feeStructures,
  feePayments,
  announcements,
  notifications,
  comments,
  reportCards,
  timetables,
  posts,
  schools,
  academicSessions,
  type User,
  type InsertUser,
  type Student,
  type Teacher,
  type Class,
  type Subject,
  type Grade,
  type Attendance,
  type Assignment,
  type Message,
  type FeeStructure,
  type FeePayment,
  type Announcement,
  type Notification,
  type Comment,
  type ReportCard,
  type Timetable,
  type Post,
  type School,
  type AcademicSession,
  type InsertStudent,
  type InsertTeacher,
  type InsertGrade,
  type InsertMessage,
  type InsertAnnouncement,
  type InsertNotification,
  type InsertComment,
  type InsertReportCard,
  type InsertTimetable,
  type InsertPost,
  type InsertAttendance,
  type InsertAssignment,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations for local authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student operations
  getStudentByUserId(userId: string): Promise<Student | undefined>;
  getStudentsByClass(classId: string): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  // Teacher operations
  getTeacherByUserId(userId: string): Promise<Teacher | undefined>;
  getTeachersBySchool(schoolId: string): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Class operations
  getClassesBySchool(schoolId: string): Promise<Class[]>;
  getClassById(id: string): Promise<Class | undefined>;
  
  // Subject operations
  getSubjectsBySchool(schoolId: string): Promise<Subject[]>;
  
  // Grade operations
  getGradesByStudent(studentId: string, term?: string): Promise<Grade[]>;
  getGradesByClass(classId: string, subjectId: string, term: string): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, grade: Partial<InsertGrade>): Promise<Grade>;
  
  // Attendance operations
  getAttendanceByStudent(studentId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]>;
  getAttendanceByClass(classId: string, date: Date): Promise<Attendance[]>;
  
  // Assignment operations
  getAssignmentsByClass(classId: string): Promise<Assignment[]>;
  getAssignmentsByStudent(studentId: string): Promise<Assignment[]>;
  
  // Message operations
  getMessagesByUser(userId: string): Promise<Message[]>;
  getConversation(senderId: string, recipientId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Fee operations
  getFeeStructuresByClass(classId: string, term?: string): Promise<FeeStructure[]>;
  getFeePaymentsByStudent(studentId: string): Promise<FeePayment[]>;
  
  // Announcement operations
  getAnnouncementsBySchool(schoolId: string, role?: string): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Comment operations
  getCommentsByParent(parentType: string, parentId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Report card operations
  getReportCardsByStudent(studentId: string): Promise<ReportCard[]>;
  generateReportCard(studentId: string, term: string, academicSessionId: string): Promise<ReportCard>;
  
  // Timetable operations
  getTimetableByClass(classId: string): Promise<Timetable[]>;
  createTimetableEntry(timetable: InsertTimetable): Promise<Timetable>;
  
  // Post operations
  getPostsBySchool(schoolId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Attendance operations
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance>;
  
  // Assignment operations
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<Assignment>;
  
  // School operations
  getSchoolByUser(userId: string): Promise<School | undefined>;
  
  // Academic session operations
  getActiveAcademicSession(schoolId: string): Promise<AcademicSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations for local authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Student operations
  async getStudentByUserId(userId: string): Promise<Student | undefined> {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.userId, userId));
    return student;
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    return await db
      .select()
      .from(students)
      .where(eq(students.classId, classId))
      .orderBy(asc(students.studentId));
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db
      .insert(students)
      .values(student)
      .returning();
    return newStudent;
  }

  // Teacher operations
  async getTeacherByUserId(userId: string): Promise<Teacher | undefined> {
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.userId, userId));
    return teacher;
  }

  async getTeachersBySchool(schoolId: string): Promise<Teacher[]> {
    return await db
      .select()
      .from(teachers)
      .where(eq(teachers.schoolId, schoolId))
      .orderBy(asc(teachers.teacherId));
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [newTeacher] = await db
      .insert(teachers)
      .values(teacher)
      .returning();
    return newTeacher;
  }

  // Class operations
  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    return await db
      .select()
      .from(classes)
      .where(eq(classes.schoolId, schoolId))
      .orderBy(asc(classes.name));
  }

  async getClassById(id: string): Promise<Class | undefined> {
    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, id));
    return classRecord;
  }

  // Subject operations
  async getSubjectsBySchool(schoolId: string): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(eq(subjects.schoolId, schoolId))
      .orderBy(asc(subjects.name));
  }

  // Grade operations
  async getGradesByStudent(studentId: string, term?: string): Promise<Grade[]> {
    if (term) {
      return await db
        .select()
        .from(grades)
        .where(and(eq(grades.studentId, studentId), eq(grades.term, term as any)))
        .orderBy(desc(grades.createdAt));
    } else {
      return await db
        .select()
        .from(grades)
        .where(eq(grades.studentId, studentId))
        .orderBy(desc(grades.createdAt));
    }
  }

  async getGradesByClass(classId: string, subjectId: string, term: string): Promise<Grade[]> {
    const result = await db
      .select({
        id: grades.id,
        studentId: grades.studentId,
        subjectId: grades.subjectId,
        teacherId: grades.teacherId,
        academicSessionId: grades.academicSessionId,
        term: grades.term,
        score: grades.score,
        maxScore: grades.maxScore,
        assessmentType: grades.assessmentType,
        status: grades.status,
        gradedAt: grades.gradedAt,
        createdAt: grades.createdAt,
      })
      .from(grades)
      .innerJoin(students, eq(grades.studentId, students.id))
      .where(
        and(
          eq(students.classId, classId),
          eq(grades.subjectId, subjectId),
          eq(grades.term, term as any)
        )
      )
      .orderBy(asc(students.studentId));
    return result;
  }

  async createGrade(grade: InsertGrade): Promise<Grade> {
    const [newGrade] = await db
      .insert(grades)
      .values(grade)
      .returning();
    return newGrade;
  }

  async updateGrade(id: string, grade: Partial<InsertGrade>): Promise<Grade> {
    const [updatedGrade] = await db
      .update(grades)
      .set(grade)
      .where(eq(grades.id, id))
      .returning();
    return updatedGrade;
  }

  // Attendance operations
  async getAttendanceByStudent(studentId: string, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    if (startDate && endDate) {
      return await db
        .select()
        .from(attendance)
        .where(eq(attendance.studentId, studentId))
        .orderBy(desc(attendance.date));
    } else {
      return await db
        .select()
        .from(attendance)
        .where(eq(attendance.studentId, studentId))
        .orderBy(desc(attendance.date));
    }
  }

  async getAttendanceByClass(classId: string, date: Date): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.classId, classId),
          eq(attendance.date, date)
        )
      )
      .orderBy(asc(attendance.studentId));
  }

  // Assignment operations
  async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    return await db
      .select()
      .from(assignments)
      .where(eq(assignments.classId, classId))
      .orderBy(desc(assignments.dueDate));
  }

  async getAssignmentsByStudent(studentId: string): Promise<Assignment[]> {
    const result = await db
      .select({
        id: assignments.id,
        title: assignments.title,
        description: assignments.description,
        dueDate: assignments.dueDate,
        maxScore: assignments.maxScore,
        classId: assignments.classId,
        subjectId: assignments.subjectId,
        teacherId: assignments.teacherId,
        createdAt: assignments.createdAt,
      })
      .from(assignments)
      .innerJoin(students, eq(students.id, studentId))
      .where(eq(assignments.classId, students.classId))
      .orderBy(desc(assignments.dueDate));
    return result;
  }

  // Message operations
  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.recipientId, userId))
      .orderBy(desc(messages.createdAt));
  }

  async getConversation(senderId: string, recipientId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.senderId, senderId),
          eq(messages.recipientId, recipientId)
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
  }

  // Fee operations
  async getFeeStructuresByClass(classId: string, term?: string): Promise<FeeStructure[]> {
    if (term) {
      return await db
        .select()
        .from(feeStructures)
        .where(
          and(
            eq(feeStructures.classId, classId),
            eq(feeStructures.term, term as any)
          )
        )
        .orderBy(asc(feeStructures.name));
    } else {
      return await db
        .select()
        .from(feeStructures)
        .where(eq(feeStructures.classId, classId))
        .orderBy(asc(feeStructures.name));
    }
  }

  async getFeePaymentsByStudent(studentId: string): Promise<FeePayment[]> {
    return await db
      .select()
      .from(feePayments)
      .where(eq(feePayments.studentId, studentId))
      .orderBy(desc(feePayments.createdAt));
  }

  // Announcement operations
  async getAnnouncementsBySchool(schoolId: string, role?: string): Promise<Announcement[]> {
    if (role) {
      return await db
        .select()
        .from(announcements)
        .where(
          and(
            eq(announcements.schoolId, schoolId),
            eq(announcements.targetRole, role as any),
            eq(announcements.isActive, true)
          )
        )
        .orderBy(desc(announcements.createdAt));
    } else {
      return await db
        .select()
        .from(announcements)
        .where(
          and(
            eq(announcements.schoolId, schoolId),
            eq(announcements.isActive, true)
          )
        )
        .orderBy(desc(announcements.createdAt));
    }
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  // Notification operations
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Comment operations
  async getCommentsByParent(parentType: string, parentId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.parentType, parentType),
          eq(comments.parentId, parentId),
          eq(comments.isDeleted, false)
        )
      )
      .orderBy(asc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  // Report card operations
  async getReportCardsByStudent(studentId: string): Promise<ReportCard[]> {
    return await db
      .select()
      .from(reportCards)
      .where(eq(reportCards.studentId, studentId))
      .orderBy(desc(reportCards.generatedAt));
  }

  async generateReportCard(studentId: string, term: string, academicSessionId: string): Promise<ReportCard> {
    // This would typically calculate grades and generate report card
    // For now, return a basic implementation
    const [newReportCard] = await db
      .insert(reportCards)
      .values({
        studentId,
        academicSessionId,
        term: term as any,
        totalScore: "0",
        totalPossible: "0",
        average: "0",
        position: 0,
        classSize: 0,
        isPublished: false,
      })
      .returning();
    return newReportCard;
  }

  // Timetable operations
  async getTimetableByClass(classId: string): Promise<Timetable[]> {
    return await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(timetables.classId, classId),
          eq(timetables.isActive, true)
        )
      )
      .orderBy(asc(timetables.dayOfWeek), asc(timetables.startTime));
  }

  async createTimetableEntry(timetable: InsertTimetable): Promise<Timetable> {
    const [newTimetable] = await db
      .insert(timetables)
      .values(timetable)
      .returning();
    return newTimetable;
  }

  // Post operations
  async getPostsBySchool(schoolId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.schoolId, schoolId),
          eq(posts.isPublished, true)
        )
      )
      .orderBy(desc(posts.publishedAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  // Additional Attendance operations
  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db
      .insert(attendance)
      .values(attendance)
      .returning();
    return newAttendance;
  }

  async updateAttendance(id: string, attendanceData: Partial<InsertAttendance>): Promise<Attendance> {
    const [updatedAttendance] = await db
      .update(attendance)
      .set(attendanceData)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance;
  }

  // Additional Assignment operations
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async updateAssignment(id: string, assignmentData: Partial<InsertAssignment>): Promise<Assignment> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set(assignmentData)
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment;
  }

  // School operations
  async getSchoolByUser(userId: string): Promise<School | undefined> {
    // First check if user is proprietor or principal
    const [school] = await db
      .select()
      .from(schools)
      .where(
        eq(schools.proprietorId, userId)
      );
    
    if (school) return school;

    // Check if user is principal
    const [principalSchool] = await db
      .select()
      .from(schools)
      .where(eq(schools.principalId, userId));
    
    if (principalSchool) return principalSchool;

    // Check if user is teacher or student
    const [teacher] = await db
      .select()
      .from(teachers)
      .innerJoin(schools, eq(teachers.schoolId, schools.id))
      .where(eq(teachers.userId, userId));
    
    if (teacher) return teacher.schools;

    const [student] = await db
      .select()
      .from(students)
      .innerJoin(schools, eq(students.schoolId, schools.id))
      .where(eq(students.userId, userId));
    
    if (student) return student.schools;

    return undefined;
  }

  // Academic session operations
  async getActiveAcademicSession(schoolId: string): Promise<AcademicSession | undefined> {
    const [session] = await db
      .select()
      .from(academicSessions)
      .where(
        and(
          eq(academicSessions.schoolId, schoolId),
          eq(academicSessions.isActive, true)
        )
      );
    return session;
  }
}

export const storage = new DatabaseStorage();
