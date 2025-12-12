# s3cNS - SECMUN Secretariat Management System

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/your-org/s3cns)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-s3cns.vercel.app-blue)](https://s3cns.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

A comprehensive web application for managing St Edmund's College Model United Nations (SECMUN) secretariat activities, built with modern web technologies.

## What is s3cNS?

s3cNS (SECMUN Secretariat Next-gen System) is a unified platform that transforms how SECMUN secretariat operates. It replaces scattered spreadsheets, manual processes, and disconnected systems with a single, mobile-ready application that captures every action with an audit trail and clear ownership.

### Key Features

- **📊 Dashboard Overview**: Real-time insights into events, finances, and approvals
- **💰 Finance Management**: Budget tracking, expense management, and financial reporting
- **👥 Secretariat Directory**: Member management, roles, and training resources
- **📅 Event Management**: SEC-NEXUS events coordination and delegate management
- **🔔 Notifications**: Push notifications and automated alerts
- **📱 PWA Support**: Installable web app for mobile access
- **🔐 Role-Based Access**: Secure authentication with Firebase and granular permissions

## Why s3cNS?

**Before s3cNS:**
- Separate spreadsheets for budgets, events, and member data
- Manual reminders and error-prone approvals
- No shared record of member performance across years

**After s3cNS:**
- Unified dashboard for all operations
- Secretariat-level insights and automated workflows
- Clear audit trails and ownership for every action

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Radix UI
- **Authentication**: Firebase Auth
- **Database**: MongoDB with Mongoose
- **Notifications**: Firebase Cloud Messaging
- **File Upload**: UploadThing
- **Email**: Resend, React Email
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Firebase project with authentication enabled
- Firebase service account key

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

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

The application uses MongoDB. Make sure your database is running and accessible. The app will automatically create collections and indexes on first run.

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

The application provides RESTful APIs for all major operations:

- `/api/auth/*` - Authentication endpoints
- `/api/finance/*` - Budget and expense management
- `/api/secretariat/*` - Member and role management
- `/api/notifications/*` - Notification services
- `/api/events/*` - Event management

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
