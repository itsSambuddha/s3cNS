# s3cNS - SECMUN Secretariat Next-gen System

[![Version](https://img.shields.io/badge/version-1.1-blue.svg)](https://github.com/your-org/s3cns)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-s3cns.vercel.app-blue)](https://s3cns.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

A comprehensive full-stack web application for managing St Edmund's College Model United Nations (SECMUN) secretariat operations, built with modern web technologies and designed as a Progressive Web App (PWA).

## What is s3cNS?

s3cNS *(SECMUN Secretariat Next-gen System)* is a unified platform that modernizes and streamlines SECMUN secretariat operations by replacing disparate manual processes, spreadsheets, and disconnected systems with a single, mobile-ready web application. The system provides real-time insights, automated workflows, and comprehensive audit trails for all SECMUN conference activities.

![s3cNS](https://socialify.git.ci/itsSambuddha/s3cNS/image?font=Jost&language=1&name=1&owner=1&pattern=Circuit+Board&stargazers=1&theme=Auto)

### Key Features

- **🔐 Authentication & RBAC**: Firebase-based authentication with role-based access control for 5 user roles
- **📊 Real-time Dashboard**: Comprehensive analytics with KPIs, pending approvals, and personalized views
- **💰 Finance Management**: Budget creation, expense tracking, payment processing, and financial reporting
- **👥 Delegation Affairs**: Multi-step delegate registration, document management, and country allocation
- **📅 Event Management**: Conference setup, committee management, and interactive scheduling
- **🔔 Multi-channel Communication**: Push notifications, email, and WhatsApp messaging
- **📱 PWA Support**: Installable web app with offline functionality
- **📄 Document Management**: Position papers, resolutions, and gazette publishing
- **🎯 Real-time Collaboration**: Live committee sessions, attendance tracking, and resolution voting

## Why s3cNS?

**Before s3cNS:**
- Scattered spreadsheets for budgets, events, and member data
- Manual processes with error-prone approvals
- No centralized audit trails or ownership tracking
- Limited real-time insights and collaboration

**After s3cNS:**
- Unified platform for all SECMUN operations
- Automated workflows with comprehensive audit trails
- Real-time insights and mobile-ready access
- Secure, role-based access with granular permissions

## Tech Stack

- **Frontend**: Next.js 14+, React 18+, TypeScript 5+
- **Backend**: Node.js 18+, Next.js API Routes, Express.js
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Authentication**: Firebase Auth with RBAC
- **Database**: MongoDB 7.0+ with Mongoose ODM
- **Notifications**: Firebase Cloud Messaging, Resend, WhatsApp Business API
- **File Storage**: UploadThing
- **Payments**: Razorpay/Stripe integration
- **Deployment**: Vercel serverless platform

## User Classes

s3cNS supports five distinct user classes with role-based access control:

### 1. Secretariat Members (Admins)
- **Role**: System administrators with full access
- **Characteristics**: Technical proficiency, responsible for system configuration and oversight
- **Experience**: Familiar with MUN operations and digital tools

### 2. Delegation Affairs Team
- **Role**: Manage delegate lifecycle from registration to participation
- **Characteristics**: Detail-oriented, handle large volumes of delegate data
- **Experience**: Customer service and administrative experience

### 3. Finance Team
- **Role**: Oversee budget management and financial operations
- **Characteristics**: Financial acumen, attention to detail
- **Experience**: Accounting or financial management experience

### 4. Committee Chairs
- **Role**: Lead committee sessions and evaluate delegate performance
- **Characteristics**: Subject matter expertise in committee topics
- **Experience**: MUN chairing experience

### 5. Delegates/Participants
- **Role**: Conference participants submitting position papers and participating in debates
- **Characteristics**: Students aged 16-22, varying technical proficiency
- **Experience**: Basic computer literacy, some MUN experience

## Operating Environment

### Hardware Requirements
- **Client**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server**: Vercel serverless functions or Node.js compatible hosting
- **Database**: MongoDB Atlas or compatible MongoDB instance

### Software Requirements
- **Frontend**: Next.js 14+, React 18+, TypeScript 5+
- **Backend**: Node.js 18+, Express.js
- **Database**: MongoDB 7.0+
- **Authentication**: Firebase Auth
- **Notifications**: Firebase Cloud Messaging, Nodemailer, WhatsApp Business API

### Network Requirements
- HTTPS encryption for all communications
- Reliable internet connectivity for real-time features
- Support for WebSocket connections for live updates

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (Atlas recommended)
- Firebase project with authentication enabled
- Firebase service account key
- Payment gateway accounts (Razorpay/Stripe)
- Email service provider (Resend) API keys
- WhatsApp Business API access
- File storage service (UploadThing) credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/s3cns.git
   cd s3cns
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your configuration:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Random secret for NextAuth
   - `FIREBASE_API_KEY`: Firebase project API key
   - `FIREBASE_AUTH_DOMAIN`: Firebase auth domain
   - `FIREBASE_PROJECT_ID`: Firebase project ID
   - `FIREBASE_PRIVATE_KEY`: Firebase service account private key
   - `FIREBASE_CLIENT_EMAIL`: Firebase service account email
   - `UPLOADTHING_SECRET`: UploadThing API secret
   - `UPLOADTHING_APP_ID`: UploadThing app ID
   - `RESEND_API_KEY`: Resend email API key
   - `RAZORPAY_KEY_ID`: Razorpay/Stripe API keys
   - `WHATSAPP_API_KEY`: WhatsApp Business API credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

The application uses MongoDB with Mongoose ODM. The system automatically creates collections and indexes on first run. Key collections include:

- **Users**: User profiles, roles, and permissions
- **Events**: Conference and committee management
- **DelegateRegistrations**: Registration and allocation data
- **FinanceRecords**: Budgets, expenses, and payments
- **Notifications**: Communication logs and preferences

## Usage

### For Secretariat Members

1. **Sign In**: Use your SECMUN account credentials
2. **Complete Onboarding**: Set up your profile and role
3. **Access Dashboard**: View your personalized overview
4. **Navigate Modules**: Access finance, events, directory, etc.

### Key Workflows

- **Budget Management**: Create budgets, track expenses, submit proposals
- **Event Coordination**: Manage SEC-NEXUS events and delegate information
- **Member Directory**: View and update secretariat member profiles
- **Notifications**: Receive updates and send announcements

## Project Structure

```
s3cns/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected routes
│   ├── (root)/            # Landing page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── modules/          # Feature-specific components
├── lib/                   # Utility libraries
│   ├── auth/             # Authentication logic
│   ├── db/               # Database models and connections
│   ├── firebase/         # Firebase configuration
│   └── services/         # Business logic services
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## API Reference

The application provides comprehensive RESTful APIs for all major operations:

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Session validation

### User Management Endpoints
- `GET /api/users` - List users with filtering
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user

### Finance Endpoints
- `GET /api/finance/budgets` - List budgets
- `POST /api/finance/budgets` - Create budget
- `GET /api/finance/expenses` - List expenses
- `POST /api/finance/expenses` - Submit expense
- `PUT /api/finance/expenses/:id/approve` - Approve expense

### Delegation Affairs Endpoints
- `GET /api/da/registrations` - List delegate registrations
- `POST /api/da/registrations` - Submit registration
- `PUT /api/da/registrations/:id/approve` - Approve registration
- `POST /api/da/allocations` - Allocate countries/committees

### Event Management Endpoints
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `GET /api/events/:id/committees` - Get event committees

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Send notification
- `PUT /api/notifications/:id/read` - Mark as read

## Performance Requirements

- **Response Time**: API calls < 500ms, page loads < 2s
- **Throughput**: Handle 1000+ concurrent users during conferences
- **Availability**: 99.5% uptime SLA
- **Scalability**: Horizontal scaling support via Vercel platform

## Security Requirements

- **Authentication**: Firebase Auth with multi-factor authentication support
- **Authorization**: Granular permissions based on user roles and offices
- **Data Protection**: Encryption of sensitive data (financial info, personal details)
- **Compliance**: GDPR compliance for EU user data
- **Audit Trail**: Comprehensive logging of all system activities

## Deployment Architecture

### Development Environment
- Local development with Next.js dev server
- MongoDB local instance or MongoDB Atlas
- Firebase emulator for authentication and functions

### Production Environment
- **Frontend/Backend**: Vercel serverless deployment
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth production project
- **File Storage**: UploadThing production environment
- **Email**: Resend production account
- **Notifications**: Firebase Cloud Messaging production
- **Payments**: Razorpay/Stripe production accounts

### CI/CD Pipeline
- GitHub Actions for automated testing and deployment
- ESLint and TypeScript checking
- Automated deployment to Vercel on main branch pushes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Jest** for testing (framework configured)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Setting up your development environment
- Code style and standards
- Submitting pull requests
- Reporting issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check the `/docs` directory for detailed guides
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions for questions

## Acknowledgments

- Built for St Edmund's College Model United Nations
- Powered by Next.js and the amazing open-source community
- Special thanks to all SECMUN secretariat members for their feedback

---

**Ready to streamline SECMUN operations?** Sign in to s3cNS and experience the future of secretariat management.

## Demo

https://s3cns.vercel.app/ 
##### ***Click on the Link Above to get a Demo of the platform*** 

