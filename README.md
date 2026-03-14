# s3cNS — SECMUN Secretariat Next-gen System

<p align="center">
  <a href="https://s3cns.vercel.app/"><img src="https://img.shields.io/badge/Live-s3cns.vercel.app-1A2B4A?style=for-the-badge&logo=vercel&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/Version-1.2-2E6DA4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</p>
![s3cNS](https://socialify.git.ci/itsSambuddha/s3cNS/image?font=Jost&language=1&name=1&owner=1&pattern=Circuit+Board&stargazers=1&theme=Auto)
<p align="center">
  <strong>An enterprise-grade, full-stack secretariat management platform built for St. Edmund's College Model United Nations.</strong><br/>
  Designed to replace fragmented manual workflows with a unified, high-performance digital command system.
</p>

---

## Overview

s3cNS (**S**ECMUN **S**ecretariat **N**ext-gen **S**ystem) is a mission-critical operational platform engineered for the modern SECMUN Secretariat. It consolidates delegation management, financial operations, logistics, governance, and institutional publishing into a single, cohesive system — purpose-built to the operational complexity of a student-run Model United Nations.

The platform is not a prototype or internal tool. It is a production-grade application with a full RBAC model, an immutable audit trail, real-time collaboration features, and PWA capabilities — designed to scale across secretariat generations with institutional continuity as a core requirement.

---

## Architecture & Tech Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** (App Router) | Core framework — SSR, Edge API routes, Server Actions |
| **React 19** | UI rendering layer |
| **TypeScript 5** | End-to-end static typing |
| **Tailwind CSS + Shadcn UI** | Design system and component library |
| **Framer Motion** | Cinematic transitions, parallax, and micro-interactions |
| **React Hook Form + Zod** | Form state management and runtime schema validation |

### Backend & Infrastructure

| Technology | Purpose |
| :--- | :--- |
| **Node.js 20+** | Server runtime |
| **MongoDB Atlas + Mongoose** | Primary database with 17+ mission-critical models |
| **Firebase Auth** | Authentication, session management, and RBAC enforcement |
| **Firebase Cloud Messaging** | Push notification delivery |
| **UploadThing** | Secure file and media storage |
| **Resend** | Transactional email delivery |
| **WhatsApp Business API** | Direct communication with delegates and members |
| **Vercel** | Serverless deployment with Edge-optimized routing |

---

## Core Modules

### Authentication & Access Control

s3cNS implements a multi-tiered Role-Based Access Control (RBAC) system with five distinct user classes and nine departmental partitions:

**User Roles:** Admin · Leadership · Teacher · Office Bearer · Member

**USG Offices:**

| Office | Core Scope |
| :--- | :--- |
| Finance | Budget creation, expense approvals, financial reporting |
| Logistics | Asset management, venue coordination, inventory |
| Delegation Affairs | Delegate registration, country allocation, double-delegation sync |
| Public Relations | Outreach, institutional liaison |
| Marketing | Social coordination, branding governance |
| IT · Design | Platform maintenance, UI/UX, technical operations |
| IT · Social Media | Digital engagement, live conference updates |
| Conference Management | Timetable oversight, event execution, attendance |
| Academics | Academic programming, guides, and institutional knowledge |

Fine-grained access is enforced via permission bitmasks (`canManageMembers`, `canApproveUSG`, `canManageFinance`, `canManageEvents`), with privacy controls for notification preferences and automated masking of sensitive data in audit logs.

---

### Delegation Affairs (DA)

- Multi-event engine supporting Intra-SECMUN, Inter-SECMUN, Workshops, and specialized publications (e.g. Edblazon Times)
- Role-specific registration tracks for Delegates, Campus Ambassadors, Journalists, and Video Journalists
- Real-time status tracking for automated Email and WhatsApp dispatches
- End-to-end country and portfolio allocation with committee interest management

### Outbound Conference Management

- Centralized tracking for all external conference delegations, venues, and dates
- Industry-grade **Double Delegation Smart Sync** — synchronises awards, interests, and portfolios for linked delegate pairs
- High-fidelity achievement logging (`BEST_DELEGATE`, `HIGH_COMMENDATION`, `VERBAL_MENTION`, etc.)
- Multi-day attendance tracking with automated percentage calculation
- Integrated fee payment verification and financial compliance tracking

### Finance Operations (FinOps)

- Categorised ledger tracking for Budgets, Expenses, Reimbursements, and Dues
- Departmental budgeting with automated linking to USG offices and specific events
- Multi-tier approval pipeline with automated review flows for leadership and faculty
- Immutable audit trail recording every transaction with creator and payer timestamps

### Logistics & Inventory

- Real-time asset tracking with condition metadata (`GOOD`, `FAIR`, `DAMAGED`, `LOST`)
- Dynamic checkout and return management for secretariat members
- Authorised hardware registry for conference operations
- Interactive timetable engine with class-wise session management

### Institutional Framework

- Digital hosting for the SECMUN Constitution, Mandate, and Governing Laws
- Searchable, filterable institutional census of all members
- Self-service Academy with operational guides, FAQs, and manuals
- Service account vault for institutional credential management and rotation

### Publishing & Engagement

- Full-featured **Gazette** publishing engine with policy, official, and community categories
- Cinematic multimedia galleries with historical records of awards and secretariat milestones
- Gamified recognition system with badges and contribution milestones

---

## API Reference

The platform exposes **30+ specialised API modules**. All endpoints enforce authentication and RBAC middleware validation.

| Module | Endpoint | Description |
| :--- | :--- | :--- |
| Delegation Affairs | `/api/da` | Registration processing and country allocations |
| Outbound Conferences | `/api/outbound-conference` | External delegation and award management |
| Finance | `/api/finance` | Budgeting, proposals, and automated ledger recording |
| Attendance | `/api/attendance` | Multi-tiered tracking (`/mark`, `/report`, `/summary`) |
| Gazette | `/api/gazette` | Conference news content management |
| Achievements | `/api/achievements` | Gamification and recognition engine |
| Notifications | `/api/notifications` | FCM token management and push delivery |

---

## Database Schema

Managed via Mongoose ODM with **17+ mission-critical models**:

| Model | Description |
| :--- | :--- |
| `User` | Profiles with UID, Role, Office, and permission flags |
| `DelegateRegistration` | Nested data structure for individual and double-delegations |
| `OutboundConference` | Venues, dates, delegates, and `DelegateAward` records |
| `FinanceRecord` | High-precision records for every financial transaction |
| `Asset` / `AssetCheckout` | Real-time state management for logistics inventory |
| `Event` / `Committee` | Core conference structural data |

---

## Project Structure

```
s3cns/
├── app/
│   ├── (auth)/             # Authentication flows — Login, Signup, Onboarding
│   ├── (protected)/        # Core platform modules — Dashboard, Finance, DA
│   ├── (public)/           # Public portals — Gallery, News, Gazette
│   ├── (root)/             # Cinematic landing page
│   ├── api/                # 30+ RESTful API modules
│   ├── attendance/         # Real-time attendance tracking
│   ├── constitution/       # Institutional framework documents
│   └── gazette/            # Conference publishing engine
├── components/
│   ├── ui/                 # Atomic UI components (Shadcn)
│   ├── layout/             # Navbars, Sidebars, Footers
│   └── modules/            # Feature-rich modular components (Finance, DA)
├── lib/
│   ├── db/                 # MongoDB models
│   ├── auth/               # Firebase integration and RBAC logic
│   ├── secretariat/        # Business logic for USG offices
│   └── firebase/           # FCM and Firebase Admin SDK
├── hooks/                  # Custom React hooks
├── public/                 # Static assets and PWA manifests
└── types/                  # Centralised TypeScript definitions
```

---

## Security & Performance

**Security**
- Full RBAC middleware on all API routes preventing unauthorised access
- CSRF protection and Secure Cookie management
- Zod-powered schema validation on all API inputs to prevent NoSQL injection
- IP logging and User-Agent auditing for session integrity
- Environment secrets managed exclusively via Vercel — never committed to source

**Performance**
- API response times targeted at < 300ms
- Dynamic imports for heavy modules (Gallery, Gazette) to optimise bundle size
- Image optimisation via `next/image` and UploadThing CDN
- Next.js 16 App Router with Edge-optimised API routes

---

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- MongoDB Atlas cluster
- Firebase project (Auth + Cloud Messaging)
- UploadThing account

### Installation

```bash
# Clone the repository
git clone https://github.com/itsSambuddha/s3cNS.git
cd s3cns

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials — never commit this file
```

### Environment Variables

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...

# Storage & Services
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
RESEND_API_KEY=...
```

```bash
# Start development server
npm run dev
```

---

## Contributing

Contributions are welcome and held to a high standard of quality and consistency.

1. Review existing design tokens in `styles/globals.css` before introducing new styles
2. All new components must be fully typed with TypeScript
3. Follow the established modular structure for feature development
4. Submit a Pull Request with a clear, detailed summary of changes and rationale

---

## License

Licensed under the [MIT License](./LICENSE).

Built for **St. Edmund's College Model United Nations** — Shillong, India.  
Designed and engineered by **Sambuddha Das**.

---

<p align="center">
  <a href="https://s3cns.vercel.app/">s3cns.vercel.app</a> · <a href="https://s3cns.vercel.app/help">Support Desk</a> · <a href="https://s3cns.vercel.app/developer">Developer</a>
</p>
