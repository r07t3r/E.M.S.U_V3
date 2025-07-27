import { sql, relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "student",
  "teacher", 
  "parent",
  "principal",
  "proprietor"
]);

export const termEnum = pgEnum("term", ["first", "second", "third"]);
export const gradeStatusEnum = pgEnum("grade_status", ["draft", "published"]);
export const feeStatusEnum = pgEnum("fee_status", ["pending", "partial", "paid"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late"]);

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with email/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  address: text("address"),
  phone: varchar("phone"),
  email: varchar("email"),
  proprietorId: varchar("proprietor_id").references(() => users.id),
  principalId: varchar("principal_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Academic sessions
export const academicSessions = pgTable("academic_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // e.g., "2023/2024"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  schoolId: varchar("school_id").references(() => schools.id),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Classes/Grades
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // e.g., "SS3 Science"
  level: varchar("level").notNull(), // e.g., "Senior Secondary"
  schoolId: varchar("school_id").references(() => schools.id),
  classTeacherId: varchar("class_teacher_id").references(() => users.id),
  capacity: integer("capacity").default(40),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  code: varchar("code").notNull(),
  description: text("description"),
  schoolId: varchar("school_id").references(() => schools.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student profiles
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  studentId: varchar("student_id").notNull().unique(), // School-specific ID
  classId: varchar("class_id").references(() => classes.id),
  schoolId: varchar("school_id").references(() => schools.id),
  dateOfBirth: timestamp("date_of_birth"),
  admissionDate: timestamp("admission_date"),
  parentId: varchar("parent_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teacher profiles
export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  teacherId: varchar("teacher_id").notNull().unique(), // School-specific ID
  schoolId: varchar("school_id").references(() => schools.id),
  department: varchar("department"),
  qualification: varchar("qualification"),
  hireDate: timestamp("hire_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teacher-Subject assignments
export const teacherSubjects = pgTable("teacher_subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  classId: varchar("class_id").references(() => classes.id),
  academicSessionId: varchar("academic_session_id").references(() => academicSessions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Grades/Assessments
export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  academicSessionId: varchar("academic_session_id").references(() => academicSessions.id),
  term: termEnum("term").notNull(),
  assessmentType: varchar("assessment_type").notNull(), // "test1", "test2", "assignment", "exam"
  score: decimal("score", { precision: 5, scale: 2 }),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }),
  status: gradeStatusEnum("status").default("draft"),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  classId: varchar("class_id").references(() => classes.id),
  date: timestamp("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  remarks: text("remarks"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  subjectId: varchar("subject_id").references(() => subjects.id),
  classId: varchar("class_id").references(() => classes.id),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  dueDate: timestamp("due_date"),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignment submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").references(() => assignments.id),
  studentId: varchar("student_id").references(() => students.id),
  content: text("content"),
  submittedAt: timestamp("submitted_at"),
  score: decimal("score", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id),
  recipientId: varchar("recipient_id").references(() => users.id),
  subject: varchar("subject"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee structures
export const feeStructures = pgTable("fee_structures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // e.g., "Tuition Fee", "Development Levy"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  classId: varchar("class_id").references(() => classes.id),
  academicSessionId: varchar("academic_session_id").references(() => academicSessions.id),
  term: termEnum("term"),
  isOptional: boolean("is_optional").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee payments
export const feePayments = pgTable("fee_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  feeStructureId: varchar("fee_structure_id").references(() => feeStructures.id),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method"), // "bank_transfer", "card", "cash"
  transactionRef: varchar("transaction_ref"),
  status: feeStatusEnum("status").default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id),
  schoolId: varchar("school_id").references(() => schools.id),
  targetRole: userRoleEnum("target_role"), // null means all roles
  priority: varchar("priority").default("normal"), // "low", "normal", "high"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // "grade", "attendance", "fee", "announcement", "assignment"
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments (for assignments, announcements, etc.)
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").references(() => users.id),
  parentType: varchar("parent_type").notNull(), // "assignment", "announcement", "grade"
  parentId: varchar("parent_id").notNull(),
  content: text("content").notNull(),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Report Cards
export const reportCards = pgTable("report_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  academicSessionId: varchar("academic_session_id").references(() => academicSessions.id),
  term: termEnum("term").notNull(),
  totalScore: decimal("total_score", { precision: 8, scale: 2 }),
  totalPossible: decimal("total_possible", { precision: 8, scale: 2 }),
  average: decimal("average", { precision: 5, scale: 2 }),
  position: integer("position"),
  classSize: integer("class_size"),
  teacherComment: text("teacher_comment"),
  principalComment: text("principal_comment"),
  nextTermBegins: timestamp("next_term_begins"),
  isPublished: boolean("is_published").default(false),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Timetables
export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").references(() => classes.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: varchar("start_time").notNull(), // "09:00"
  endTime: varchar("end_time").notNull(), // "10:00"
  academicSessionId: varchar("academic_session_id").references(() => academicSessions.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Posts/News (for school feed)
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").references(() => users.id),
  schoolId: varchar("school_id").references(() => schools.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("image_url"),
  category: varchar("category").default("general"), // "academic", "sports", "events", "general"
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, { fields: [users.id], references: [students.userId] }),
  teacher: one(teachers, { fields: [users.id], references: [teachers.userId] }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  proprietor: one(users, { fields: [schools.proprietorId], references: [users.id] }),
  principal: one(users, { fields: [schools.principalId], references: [users.id] }),
  classes: many(classes),
  students: many(students),
  teachers: many(teachers),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  class: one(classes, { fields: [students.classId], references: [classes.id] }),
  school: one(schools, { fields: [students.schoolId], references: [schools.id] }),
  parent: one(users, { fields: [students.parentId], references: [users.id] }),
  grades: many(grades),
  attendance: many(attendance),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, { fields: [teachers.userId], references: [users.id] }),
  school: one(schools, { fields: [teachers.schoolId], references: [schools.id] }),
  teacherSubjects: many(teacherSubjects),
  grades: many(grades),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, { fields: [classes.schoolId], references: [schools.id] }),
  classTeacher: one(users, { fields: [classes.classTeacherId], references: [users.id] }),
  students: many(students),
  teacherSubjects: many(teacherSubjects),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, { fields: [grades.studentId], references: [students.id] }),
  subject: one(subjects, { fields: [grades.subjectId], references: [subjects.id] }),
  teacher: one(teachers, { fields: [grades.teacherId], references: [teachers.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  recipient: one(users, { fields: [messages.recipientId], references: [users.id], relationName: "recipient" }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

export const registerSchema = insertUserSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportCardSchema = createInsertSchema(reportCards).omit({
  id: true,
  generatedAt: true,
});

export const insertTimetableSchema = createInsertSchema(timetables).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Student = typeof students.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type FeeStructure = typeof feeStructures.$inferSelect;
export type FeePayment = typeof feePayments.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type ReportCard = typeof reportCards.$inferSelect;
export type Timetable = typeof timetables.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type School = typeof schools.$inferSelect;
export type AcademicSession = typeof academicSessions.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertReportCard = z.infer<typeof insertReportCardSchema>;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
