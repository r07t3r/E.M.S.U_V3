# E.M.S.U - Educational Management System United

A comprehensive educational management platform specifically designed for Nigerian primary and secondary schools. The system provides multi-role access control and comprehensive school management features.

## 🎯 Overview

E.M.S.U is a full-stack web application that serves five distinct user roles:
- **Students**: Track grades, attendance, assignments, and fees
- **Teachers**: Manage classes, grade students, and communicate with parents
- **Parents**: Monitor children's academic progress and school communications
- **Principals**: Oversee school-wide operations and generate reports
- **Proprietors**: Manage multiple schools and financial oversight

## 🚀 Features

### Authentication & Security
- Email/password authentication with encrypted password storage
- Role-based access control with session management
- Secure PostgreSQL session storage

### Academic Management
- Student enrollment and profile management
- Class and subject organization
- Grade tracking with multiple assessment types
- Attendance monitoring with detailed records
- Assignment creation and submission tracking

### Communication System
- Internal messaging between roles
- School-wide announcements
- Parent-teacher communication channels

### Financial Management
- Fee structure configuration
- Payment tracking and status monitoring
- Financial reporting for proprietors

### Analytics & Reporting
- Real-time dashboard for each user role
- Academic performance analytics
- Attendance and fee payment reports

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Shadcn/UI** + **Radix UI** for accessible components
- **Tailwind CSS** for responsive styling
- **Framer Motion** for animations

### Backend
- **Node.js** with **Express.js**
- **TypeScript** with ES modules
- **Passport.js** for authentication (Local Strategy)
- **PostgreSQL** with **Neon** serverless hosting
- **Drizzle ORM** for type-safe database operations
- **Connect-PG-Simple** for session storage

### Development Tools
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations
- **TypeScript** for type safety
- **Replit** deployment platform

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (useAuth, etc.)
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Route components
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Express application
│   ├── auth.ts             # Authentication configuration
│   ├── db.ts               # Database connection setup
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations interface
│   └── index.ts            # Server entry point
├── shared/                 # Shared type definitions
│   └── schema.ts           # Database schema and types
├── package.json            # Dependencies and scripts
├── drizzle.config.ts       # Database configuration
├── tailwind.config.ts      # Styling configuration
└── vite.config.ts          # Build configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (provided automatically on Replit)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # These are automatically provided on Replit:
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

3. **Apply database schema:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

### First Time Setup

1. Navigate to the landing page
2. Click "Get Started" to access the authentication page
3. Register a new account by selecting your role (Student, Teacher, Parent, Principal, or Proprietor)
4. Complete registration with your email and password
5. Access your role-specific dashboard

## 🎛 User Roles & Permissions

### Student Dashboard
- View grades across all subjects and terms
- Check attendance records
- Access assignments and submission status
- Monitor fee payment status
- Receive messages from teachers and school

### Teacher Dashboard
- Manage assigned classes and subjects
- Grade student assessments
- Take attendance records
- Create and manage assignments
- Communicate with students and parents

### Parent Dashboard
- Monitor children's academic progress
- View attendance and grade reports
- Receive school communications
- Track fee payment status

### Principal Dashboard
- Oversee all school operations
- Access comprehensive student and teacher data
- Manage school announcements
- Generate academic and administrative reports

### Proprietor Dashboard
- Manage multiple schools
- Financial oversight and reporting
- System-wide analytics
- User management across schools

## 🗄 Database Schema

The system uses a comprehensive PostgreSQL schema with the following key entities:

- **Users**: Authentication and basic profile information
- **Schools**: Multi-school support for proprietors
- **Students/Teachers**: Role-specific profile extensions
- **Classes & Subjects**: Academic structure organization
- **Grades**: Assessment tracking with multiple types
- **Attendance**: Daily attendance monitoring
- **Messages**: Internal communication system
- **Fee Management**: Payment structures and tracking
- **Announcements**: School-wide communications

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - Authenticate user
- `POST /api/logout` - End user session
- `GET /api/user` - Get current user data

### Dashboard Data
- `GET /api/dashboard` - Role-specific dashboard data

*Additional endpoints are available for specific CRUD operations on all entities*

## 🧪 Development Workflow

### Database Changes
```bash
# Apply schema changes to database
npm run db:push

# Generate migrations (if needed)
npm run db:generate
```

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for consistent code style
- Automatic formatting with built-in tools

### Testing Authentication
1. Register new accounts with different roles
2. Test login/logout functionality
3. Verify role-based dashboard access
4. Test data persistence across sessions

## 🚀 Deployment

The application is configured for seamless deployment on Replit:

1. **Automatic Build**: Vite builds the frontend, ESBuild bundles the backend
2. **Database**: PostgreSQL automatically provisioned and connected
3. **Environment**: All necessary environment variables configured
4. **Domain**: Available under `.replit.app` domain

### Manual Deployment Steps
1. Ensure all database migrations are applied
2. Run production build: `npm run build`
3. Application automatically serves on configured port
4. Database sessions and authentication persist across deployments

## 📋 Configuration Files

- **`drizzle.config.ts`**: Database ORM configuration
- **`tailwind.config.ts`**: Styling framework setup
- **`vite.config.ts`**: Build tool configuration with path aliases
- **`tsconfig.json`**: TypeScript compiler options
- **`package.json`**: Dependencies and build scripts

## 🛡 Security Features

- Password hashing with bcrypt-compatible scrypt
- Session-based authentication with secure cookies
- SQL injection prevention through Drizzle ORM
- Role-based access control on all endpoints
- Input validation with Zod schemas

## 📚 Key Dependencies

### Frontend
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI components
- `wouter`: Lightweight routing
- `tailwindcss`: Utility-first CSS framework

### Backend
- `express`: Web application framework
- `passport`: Authentication middleware
- `drizzle-orm`: Type-safe ORM
- `@neondatabase/serverless`: PostgreSQL driver

## 📊 Current Status

✅ **Completed Features:**
- User authentication system with email/password
- Role-based dashboards for all five user types
- Database schema with comprehensive relationships
- Basic CRUD operations for all entities
- Responsive UI with modern design system

🚧 **In Development:**
- See TODO.md for detailed task list and known issues

## 🤝 Contributing

1. Follow TypeScript strict mode requirements
2. Use the established component patterns
3. Maintain role-based access control principles
4. Test across different user roles
5. Update schema migrations when needed

## 📞 Support

For technical issues or feature requests, refer to the TODO.md file for known issues and planned improvements.

---

**E.M.S.U** - Empowering Nigerian schools with modern technology solutions.