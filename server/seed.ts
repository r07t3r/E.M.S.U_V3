import { db } from "./db";
import { 
  users, 
  schools, 
  academicSessions, 
  classes, 
  subjects, 
  students, 
  teachers, 
  grades, 
  attendance, 
  assignments, 
  messages, 
  feeStructures, 
  feePayments, 
  announcements,
  teacherSubjects
} from "@shared/schema";

export async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data (in reverse order of dependencies)
    await db.delete(feePayments);
    await db.delete(feeStructures);
    await db.delete(messages);
    await db.delete(assignments);
    await db.delete(attendance);
    await db.delete(grades);
    await db.delete(teacherSubjects);
    await db.delete(students);
    await db.delete(teachers);
    await db.delete(subjects);
    await db.delete(classes);
    await db.delete(academicSessions);
    await db.delete(schools);
    await db.delete(users);

    // Create demo users
    const [proprietor] = await db.insert(users).values({
      id: "proprietor-1",
      email: "proprietor@demo.school",
      firstName: "John",
      lastName: "Okonkwo",
      role: "proprietor",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }).returning();

    const [principal] = await db.insert(users).values({
      id: "principal-1", 
      email: "principal@demo.school",
      firstName: "Mary",
      lastName: "Adebayo",
      role: "principal",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612d4c0?w=150&h=150&fit=crop&crop=face"
    }).returning();

    const [teacher1] = await db.insert(users).values({
      id: "teacher-1",
      email: "teacher1@demo.school", 
      firstName: "Ahmed",
      lastName: "Bello",
      role: "teacher",
      profileImageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    }).returning();

    const [teacher2] = await db.insert(users).values({
      id: "teacher-2",
      email: "teacher2@demo.school",
      firstName: "Ngozi", 
      lastName: "Okafor",
      role: "teacher",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }).returning();

    const [student1] = await db.insert(users).values({
      id: "student-1",
      email: "student1@demo.school",
      firstName: "Sarah",
      lastName: "Johnson", 
      role: "student",
      profileImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
    }).returning();

    const [student2] = await db.insert(users).values({
      id: "student-2",
      email: "student2@demo.school",
      firstName: "David",
      lastName: "Okoro",
      role: "student", 
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }).returning();

    const [parent1] = await db.insert(users).values({
      id: "parent-1",
      email: "parent1@demo.school",
      firstName: "Grace",
      lastName: "Johnson",
      role: "parent",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612d4c0?w=150&h=150&fit=crop&crop=face"
    }).returning();

    // Create school
    const [school] = await db.insert(schools).values({
      id: "school-1",
      name: "Excellence Academy",
      address: "123 Education Street, Lagos, Nigeria",
      phone: "+234-XXX-XXX-XXXX",
      email: "info@excellence-academy.edu.ng",
      proprietorId: proprietor.id,
      principalId: principal.id
    }).returning();

    // Create academic session
    const [academicSession] = await db.insert(academicSessions).values({
      id: "session-1",
      name: "2023/2024",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-07-31"),
      schoolId: school.id,
      isActive: true
    }).returning();

    // Create classes
    const [class1] = await db.insert(classes).values({
      id: "class-1",
      name: "SS3 Science",
      level: "Senior Secondary",
      schoolId: school.id,
      classTeacherId: teacher1.id,
      capacity: 40
    }).returning();

    const [class2] = await db.insert(classes).values({
      id: "class-2", 
      name: "SS2 Arts",
      level: "Senior Secondary",
      schoolId: school.id,
      classTeacherId: teacher2.id,
      capacity: 35
    }).returning();

    // Create subjects
    const [mathSubject] = await db.insert(subjects).values({
      id: "subject-1",
      name: "Mathematics",
      code: "MATH301",
      description: "Advanced Mathematics for SS3",
      schoolId: school.id
    }).returning();

    const [chemSubject] = await db.insert(subjects).values({
      id: "subject-2",
      name: "Chemistry", 
      code: "CHEM301",
      description: "General Chemistry for SS3",
      schoolId: school.id
    }).returning();

    const [physSubject] = await db.insert(subjects).values({
      id: "subject-3",
      name: "Physics",
      code: "PHYS301", 
      description: "General Physics for SS3",
      schoolId: school.id
    }).returning();

    const [engSubject] = await db.insert(subjects).values({
      id: "subject-4",
      name: "English Language",
      code: "ENG301",
      description: "English Language and Literature",
      schoolId: school.id
    }).returning();

    // Create teacher profiles
    const [teacherProfile1] = await db.insert(teachers).values({
      id: "teacher-profile-1",
      userId: teacher1.id,
      teacherId: "TCH001",
      schoolId: school.id,
      department: "Science",
      qualification: "B.Sc Mathematics, M.Ed",
      hireDate: new Date("2020-01-15")
    }).returning();

    const [teacherProfile2] = await db.insert(teachers).values({
      id: "teacher-profile-2", 
      userId: teacher2.id,
      teacherId: "TCH002",
      schoolId: school.id,
      department: "Science",
      qualification: "B.Sc Chemistry, M.Sc Chemistry",
      hireDate: new Date("2019-08-01")
    }).returning();

    // Create student profiles
    const [studentProfile1] = await db.insert(students).values({
      id: "student-profile-1",
      userId: student1.id,
      studentId: "STU2023001",
      classId: class1.id,
      schoolId: school.id,
      dateOfBirth: new Date("2006-03-15"),
      admissionDate: new Date("2023-09-01"),
      parentId: parent1.id
    }).returning();

    const [studentProfile2] = await db.insert(students).values({
      id: "student-profile-2",
      userId: student2.id, 
      studentId: "STU2023002",
      classId: class1.id,
      schoolId: school.id,
      dateOfBirth: new Date("2006-07-22"),
      admissionDate: new Date("2023-09-01")
    }).returning();

    // Create teacher-subject assignments
    await db.insert(teacherSubjects).values([
      {
        teacherId: teacherProfile1.id,
        subjectId: mathSubject.id,
        classId: class1.id,
        academicSessionId: academicSession.id
      },
      {
        teacherId: teacherProfile1.id,
        subjectId: physSubject.id,
        classId: class1.id,
        academicSessionId: academicSession.id
      },
      {
        teacherId: teacherProfile2.id,
        subjectId: chemSubject.id,
        classId: class1.id,
        academicSessionId: academicSession.id
      }
    ]);

    // Create sample grades
    await db.insert(grades).values([
      {
        studentId: studentProfile1.id,
        subjectId: mathSubject.id,
        teacherId: teacherProfile1.id,
        academicSessionId: academicSession.id,
        term: "first",
        assessmentType: "test1",
        score: "18",
        maxScore: "20",
        status: "published",
        gradedAt: new Date("2023-10-15")
      },
      {
        studentId: studentProfile1.id,
        subjectId: mathSubject.id,
        teacherId: teacherProfile1.id,
        academicSessionId: academicSession.id,
        term: "first", 
        assessmentType: "test2",
        score: "16",
        maxScore: "20",
        status: "published",
        gradedAt: new Date("2023-11-15")
      },
      {
        studentId: studentProfile1.id,
        subjectId: chemSubject.id,
        teacherId: teacherProfile2.id,
        academicSessionId: academicSession.id,
        term: "first",
        assessmentType: "test1", 
        score: "19",
        maxScore: "20",
        status: "published",
        gradedAt: new Date("2023-10-20")
      },
      {
        studentId: studentProfile1.id,
        subjectId: physSubject.id,
        teacherId: teacherProfile1.id,
        academicSessionId: academicSession.id,
        term: "first",
        assessmentType: "test1",
        score: "16",
        maxScore: "20", 
        status: "published",
        gradedAt: new Date("2023-10-25")
      }
    ]);

    // Create attendance records
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastWeek.getTime() + i * 24 * 60 * 60 * 1000);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        await db.insert(attendance).values([
          {
            studentId: studentProfile1.id,
            classId: class1.id,
            date: date,
            status: "present",
            recordedBy: teacher1.id
          },
          {
            studentId: studentProfile2.id,
            classId: class1.id, 
            date: date,
            status: i === 2 ? "absent" : "present", // One absence
            recordedBy: teacher1.id
          }
        ]);
      }
    }

    // Create assignments
    await db.insert(assignments).values([
      {
        id: "assignment-1",
        title: "Quadratic Equations Practice",
        description: "Complete exercises 1-10 on quadratic equations",
        subjectId: mathSubject.id,
        classId: class1.id,
        teacherId: teacherProfile1.id,
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        maxScore: "10"
      },
      {
        id: "assignment-2",
        title: "Chemical Bonding Essay",
        description: "Write a 500-word essay on types of chemical bonding",
        subjectId: chemSubject.id,
        classId: class1.id,
        teacherId: teacherProfile2.id,
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        maxScore: "20"
      }
    ]);

    // Create messages
    await db.insert(messages).values([
      {
        senderId: teacher1.id,
        recipientId: student1.id,
        subject: "Math Assignment Graded",
        content: "Hi Sarah, I've reviewed your latest math assignment. You've shown excellent understanding of quadratic equations. Keep up the great work!",
        isRead: false
      },
      {
        senderId: parent1.id,
        recipientId: teacher1.id,
        subject: "Parent-Teacher Meeting",
        content: "Good day Mr. Bello, I would like to schedule a meeting to discuss Sarah's progress in Mathematics.",
        isRead: true
      },
      {
        senderId: principal.id,
        recipientId: student1.id,
        subject: "Academic Excellence",
        content: "Congratulations on your excellent performance this term. You are among the top 5 students in your class.",
        isRead: false
      }
    ]);

    // Create fee structures
    await db.insert(feeStructures).values([
      {
        id: "fee-1",
        name: "Tuition Fee",
        amount: "80000",
        classId: class1.id,
        academicSessionId: academicSession.id,
        term: "first"
      },
      {
        id: "fee-2", 
        name: "Development Levy",
        amount: "30000",
        classId: class1.id,
        academicSessionId: academicSession.id,
        term: "first"
      },
      {
        id: "fee-3",
        name: "Sports & Activities",
        amount: "20000",
        classId: class1.id,
        academicSessionId: academicSession.id,
        term: "first"
      },
      {
        id: "fee-4",
        name: "Laboratory Fee", 
        amount: "20000",
        classId: class1.id,
        academicSessionId: academicSession.id,
        term: "first"
      }
    ]);

    // Create fee payments
    await db.insert(feePayments).values([
      {
        studentId: studentProfile1.id,
        feeStructureId: "fee-1",
        amountPaid: "80000",
        paymentMethod: "bank_transfer",
        status: "paid",
        paidAt: new Date("2023-09-15")
      },
      {
        studentId: studentProfile1.id,
        feeStructureId: "fee-2", 
        amountPaid: "20000",
        paymentMethod: "bank_transfer",
        status: "partial",
        paidAt: new Date("2023-10-01")
      }
    ]);

    // Create announcements
    await db.insert(announcements).values([
      {
        title: "Mid-Term Break Schedule",
        content: "Mid-term break will commence on December 5th and resume on January 8th, 2024.",
        authorId: principal.id,
        schoolId: school.id,
        priority: "normal"
      },
      {
        title: "Fee Payment Reminder", 
        content: "Second term fees are due by December 1st. Please ensure payment is completed on time.",
        authorId: principal.id,
        schoolId: school.id,
        priority: "high"
      },
      {
        title: "Science Fair 2024",
        content: "Registration for Science Fair 2024 is now open. Deadline: December 15th.",
        authorId: principal.id,
        schoolId: school.id,
        priority: "normal"
      }
    ]);

    console.log("Database seeding completed successfully!");
    
    return {
      users: { proprietor, principal, teacher1, teacher2, student1, student2, parent1 },
      school,
      academicSession,
      classes: { class1, class2 },
      subjects: { mathSubject, chemSubject, physSubject, engSubject },
      students: { studentProfile1, studentProfile2 },
      teachers: { teacherProfile1, teacherProfile2 }
    };

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  }).catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
}
