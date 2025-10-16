# Meu Humor - Next.js Migration ✅

A modern mental health tracking application built with Next.js, Express.js, PostgreSQL, and Redis. This is a **90% complete** migration of the original React/Vite application to a more scalable architecture.

## 🎉 Status: Ready for Production!

The application is fully functional with authentication, mood tracking, AI-powered health records, and PDF export. See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed progress.

---

## 📚 Documentation

**👉 NEW DEVELOPERS START HERE**: [LEIA-ME-PRIMEIRO.md](./LEIA-ME-PRIMEIRO.md)

Complete documentation is organized in the [`docs/`](./docs) folder:

| Type | Document | Description |
|------|----------|-------------|
| 🎯 **Start Here** | [LEIA-ME-PRIMEIRO.md](./LEIA-ME-PRIMEIRO.md) | Welcome guide with quick links |
| 🚀 **Getting Started** | [Quick Start](./docs/getting-started/QUICK_START.md) | 5-minute setup guide |
| 📖 **Setup Guide** | [Setup Instructions](./docs/getting-started/SETUP_INSTRUCTIONS.md) | Detailed configuration guide |
| 📋 **Commands** | [Commands Reference](./docs/reference/COMANDOS.md) | All available commands |
| 💡 **Examples** | [Usage Examples](./docs/reference/EXEMPLO_USO.md) | Practical workflows & troubleshooting |
| 📁 **Structure** | [Project Structure](./docs/ESTRUTURA_PROJETO.md) | Complete folder organization |
| 🗂️ **Index** | [Documentation Index](./docs/README.md) | Complete documentation structure |

**Quick Links**:
- 🆕 First time? → [LEIA-ME-PRIMEIRO.md](./LEIA-ME-PRIMEIRO.md)
- ⚡ Quick setup? → [docs/getting-started/QUICK_START.md](./docs/getting-started/QUICK_START.md)
- 🔍 Need a command? → [docs/reference/COMANDOS.md](./docs/reference/COMANDOS.md)
- 🐛 Having issues? → [docs/getting-started/SETUP_INSTRUCTIONS.md#troubleshooting](./docs/getting-started/SETUP_INSTRUCTIONS.md#-troubleshooting)

---

## 🏗️ Architecture

### Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS + Shadcn/UI
- NextAuth.js v5 for authentication
- Zustand for state management
- Chart.js for mood visualizations

**Backend:**
- Express.js + TypeScript
- Prisma ORM (PostgreSQL)
- Redis (Upstash) for caching
- JWT for authentication
- Google Gemini AI for content generation

**Deployment:**
- Frontend: Vercel (serverless)
- Backend: Railway/Render or Vercel Functions
- Database: Supabase PostgreSQL
- Cache: Upstash Redis

## ✨ What's Working

- ✅ User authentication (register, login, logout)
- ✅ Daily mood tracking with notes
- ✅ Interactive mood charts (Chart.js)
- ✅ Weekly mood summaries
- ✅ Complete mood history with delete
- ✅ AI-powered health records (Google Gemini)
- ✅ PDF export for health records
- ✅ Plan limits enforcement (free: 2, premium: unlimited)
- ✅ Fully responsive (mobile & desktop)
- ⏳ Onboarding system (backend ready, frontend pending)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Redis instance (Upstash recommended for Vercel)
- Google Gemini API key (for AI features)

**⚡ Fast Setup**: Check [docs/getting-started/SETUP_INSTRUCTIONS.md](./docs/getting-started/SETUP_INSTRUCTIONS.md) for detailed guide!  
**📋 Commands Reference**: [docs/reference/COMANDOS.md](./docs/reference/COMANDOS.md) for all available commands.

### 🎯 Simplified Commands (Recommended)

From the project root, you can now manage both frontend and backend easily:

1. **Install all dependencies (frontend + backend):**
   ```bash
   npm run install:all
   ```

2. **Run both projects simultaneously:**
   ```bash
   npm run dev
   ```
   - Backend will run on `http://localhost:3001`
   - Frontend will run on `http://localhost:3000`

3. **Run projects individually:**
   ```bash
   npm run dev:backend   # Only backend
   npm run dev:frontend  # Only frontend
   ```

**Note**: You still need to configure environment variables (`.env` in backend, `.env.local` in root) before running the projects. See detailed setup below.

---

### Backend Setup (Manual)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/meu_humor"
   REDIS_URL="redis://default:password@host:6379"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd /home/busamar/projetos/meu-humor-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
meu-humor-nextjs/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authenticated routes
│   ├── (public)/            # Public routes
│   ├── api/                 # Next.js API routes
│   └── layout.tsx           # Root layout
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access (if needed)
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── lib/             # Prisma, Redis clients
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express app entry
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json
├── components/               # React components
│   ├── ui/                  # Shadcn/UI components
│   ├── mood/                # Mood-related components
│   ├── onboarding/          # Onboarding flow
│   └── shared/              # Shared components
├── lib/                      # Frontend utilities
│   ├── auth.ts              # NextAuth configuration
│   ├── api-client.ts        # API client
│   └── utils.ts             # Utility functions
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand stores
├── types/                    # TypeScript types
└── public/                   # Static assets
```

## 🔑 Key Features

### ✅ Implemented Features
- **Authentication System**
  - Email/password registration
  - JWT token authentication
  - NextAuth v5 integration
  - Protected routes
  
- **Mood Tracking**
  - Daily mood registration (0-5 scale)
  - Add notes (up to 255 characters)
  - Interactive charts with Chart.js
  - Weekly summaries with insights
  - Complete history with delete
  
- **Health Records**
  - AI-powered generation with Google Gemini
  - Markdown formatted content
  - PDF export with jsPDF
  - Plan limits (free: 2, premium: unlimited)
  - Regenerate capability
  
- **User Interface**
  - Responsive design (mobile-first)
  - Modern UI with Shadcn/UI
  - Smooth animations with Framer Motion
  - Bottom navigation for mobile
  - Dark theme support ready

### ⏳ Pending Features (Backend Ready)
- **Onboarding Flow** (12-step questionnaire)
  - Personal info, demographics, motivation
  - Depression & anxiety screening (PHQ-9, GAD-7)
  - Mental health history, current treatment
  - Sleep quality, social support
  - *Note: Backend APIs are complete, only frontend components needed*

### 📋 Future Enhancements
- Stripe payment integration
- Data export (CSV, JSON)
- Advanced analytics
- Social features
- Daily recommendations AI

## 🗄️ Database Schema

### Main Tables

- **users** - User accounts with auth data
- **mood_entries** - Daily mood tracking records
- **health_records** - AI-generated health reports
- **user_plans** - Subscription management
- **onboarding_user_data** - Onboarding questionnaire data (JSONB)
- **chat_sessions** & **chat_messages** - AI chat history
- **legal_documents** & **user_legal_acceptances** - Terms & Privacy
- **leads** - Professional landing page leads

### Special Considerations

- **Anonymous Users**: Emails are hashed using SHA-256 for privacy
- **BigInt Timestamps**: Mood entries use millisecond timestamps stored as BigInt
- **JSONB Storage**: Onboarding data stored as flexible JSON

## 🔐 Authentication Flow

1. User registers/logs in via Next.js frontend
2. Credentials sent to Express backend `/api/auth/login`
3. Backend verifies credentials, generates JWT token
4. Frontend stores token via NextAuth session
5. Subsequent requests include JWT in Authorization header
6. Backend middleware validates JWT and attaches user data to request

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify` - Verify token

### Mood Entries
- `GET /api/mood-entries` - Get all entries
- `GET /api/mood-entries/date-range` - Get entries by date range
- `GET /api/mood-entries/:id` - Get single entry
- `POST /api/mood-entries` - Create entry
- `PUT /api/mood-entries/:id` - Update entry
- `DELETE /api/mood-entries/:id` - Delete entry

### Mood Patterns
- `GET /api/mood-patterns/daily-average?date=YYYY-MM-DD` - Daily average
- `GET /api/mood-patterns/concerning?days=7` - Check concerning patterns

### Health Records (To Be Implemented)
- `GET /api/health-records` - Get user's health records
- `POST /api/health-records` - Generate new health record
- `PUT /api/health-records/:id` - Regenerate health record
- `GET /api/health-records/can-generate` - Check eligibility

### Onboarding (To Be Implemented)
- `GET /api/onboarding/user-data` - Get onboarding data
- `PUT /api/onboarding/user-data` - Update onboarding data
- `POST /api/onboarding/steps/:stepId/complete` - Mark step complete
- `GET /api/onboarding/status` - Get onboarding status

## 🧪 Development Scripts

### Root (Manages both projects)
```bash
npm run install:all    # Install dependencies for frontend and backend
npm run dev            # Run both frontend and backend simultaneously
npm run dev:frontend   # Run only frontend (Next.js)
npm run dev:backend    # Run only backend (Express)
npm run build          # Build frontend for production
npm run start          # Start frontend production server
npm run lint           # Run ESLint on frontend
```

### Backend (from /backend directory)
```bash
cd backend
npm run dev                # Start dev server with hot reload
npm run build              # Build for production
npm run start              # Start production server
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
```

### Frontend (from root directory)
```bash
npm run dev:frontend   # Start Next.js dev server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
```

## 🚢 Deployment

### Backend (Railway/Render)
1. Connect repository to Railway/Render
2. Set environment variables
3. Deploy command: `cd backend && npm run build && npm start`

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy command: `npm run build`
4. Root directory: `./`

## 🔄 Migration from Old App

See [MIGRATION_PLAN.md](./port-meu-humor-next-js.plan.md) for detailed migration steps.

### Data Migration
1. Export data from old Supabase instance
2. Transform data to match new schema
3. Import to new PostgreSQL database
4. Verify data integrity

## 🤝 Contributing

This is a private migration project. For questions or issues, contact the development team.

## 📝 License

MIT

## 📞 Support

For technical support or questions:

- **Setup Issues**: [docs/getting-started/SETUP_INSTRUCTIONS.md - Troubleshooting](./docs/getting-started/SETUP_INSTRUCTIONS.md#-troubleshooting)
- **Command Reference**: [docs/reference/COMANDOS.md](./docs/reference/COMANDOS.md)
- **Practical Examples**: [docs/reference/EXEMPLO_USO.md](./docs/reference/EXEMPLO_USO.md)
- **Implementation Status**: [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- **Complete Documentation**: [docs/README.md](./docs/README.md)
