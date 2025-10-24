# CultureForward Assessment Platform

## Overview

CultureForward is a personality assessment web application that helps users discover their career paths through a comprehensive personality test. The platform guides users through an intake form, presents assessment questions, analyzes responses using AI, and delivers personalized career recommendations based on their personality type (DISC framework). The application provides a professional, trust-building experience with clean UI components and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. This choice provides accessible, customizable components with a professional aesthetic that aligns with the trust-focused design requirements.

**State Management**: React hooks for local component state, with TanStack Query (React Query) for server state management and API data fetching. This approach simplifies data synchronization and caching without introducing complex global state management overhead.

**Routing**: Wouter for lightweight client-side routing. A minimal routing solution appropriate for the single-page assessment flow.

**Styling System**: Tailwind CSS with custom design tokens defined in CSS variables. The design system implements a "New York" style variant from shadcn/ui with custom color schemes for light/dark modes. Typography uses Inter font family for professional appearance.

**Form Management**: React Hook Form with Zod for schema validation, providing type-safe form handling with minimal re-renders.

### Backend Architecture

**Runtime**: Node.js with Express.js framework for the REST API server.

**API Design**: RESTful endpoints structured around assessment lifecycle:
- POST `/api/assessments` - Create new assessment
- POST `/api/assessments/:id/responses` - Save user responses
- POST `/api/assessments/:id/analyze` - Trigger AI analysis
- GET `/api/assessments/:id/results` - Retrieve results

**Database ORM**: Drizzle ORM for type-safe database operations with PostgreSQL. Drizzle provides excellent TypeScript integration and a lightweight query builder that's easier to understand than heavier ORMs.

**Database Schema**: Three main tables:
- `assessments` - User intake data (name, email, age, job interests, consent flags)
- `assessment_responses` - Individual question answers with trait scoring
- `assessment_results` - Computed personality profiles with DISC scores and AI analysis

**Session Management**: Express session handling with connect-pg-simple for PostgreSQL-backed sessions.

### Data Flow Architecture

**Assessment Flow**:
1. User completes intake form → Creates assessment record
2. User answers questions → Responses saved incrementally
3. Upon completion → AI analysis triggered
4. Results computed → Personality type determined via trait scoring
5. Results displayed → User receives personalized recommendations

**Trait Scoring System**: DISC model (Dominance, Influence, Steadiness, Conscientiousness) where each answer contributes scores to specific traits. The highest-scoring trait combination determines the personality type.

### AI Integration

**Provider**: OpenAI API (GPT model) accessed through Replit's AI Integrations service, eliminating need for separate API key management.

**Usage**: AI analyzes user responses in context of their personality type to generate personalized insights and recommendations. The analysis enhances static personality profiles with dynamic, user-specific guidance.

**Implementation**: Centralized OpenAI client configuration in `server/openai.ts` that's consumed by analysis endpoints.

### Development Architecture

**Monorepo Structure**: Client and server code in single repository with shared type definitions in `/shared` directory. This enables type safety across the full stack.

**Build Process**: 
- Development: Vite dev server with HMR for frontend, tsx for hot-reloading backend
- Production: Vite builds optimized static assets, esbuild bundles server code

**Type Safety**: Comprehensive TypeScript coverage with path aliases (`@/`, `@shared/`) for clean imports. Zod schemas generate runtime validation from database schema definitions.

### Design System

**Component Strategy**: Composition-based architecture where complex components are built from smaller, reusable primitives. Example: `AssessmentQuestion` composes `Card`, `RadioGroup`, `Button` components.

**Responsive Design**: Mobile-first approach with Tailwind breakpoints. The assessment flow is optimized for both mobile and desktop experiences.

**Accessibility**: Built on Radix UI primitives which provide ARIA compliance, keyboard navigation, and screen reader support out of the box.

**Theme System**: CSS custom properties enable light/dark mode theming. Color tokens use HSL format for easier manipulation and consistent opacity handling.

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL database via `@neondatabase/serverless` with WebSocket support for optimal performance
- **Replit AI Integrations**: OpenAI API access through Replit's service for AI-powered personality analysis

### Frontend Libraries
- **React**: UI rendering and component architecture
- **Vite**: Build tool and development server with HMR
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and data fetching
- **shadcn/ui + Radix UI**: Component library for accessible, customizable UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form state management
- **Zod**: Schema validation for type-safe forms and API data

### Backend Libraries
- **Express**: Web application framework
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-zod**: Generate Zod schemas from Drizzle schemas for validation

### Development Tools
- **TypeScript**: Type safety across the stack
- **esbuild**: Fast production bundling for server code
- **Replit Vite Plugins**: Development tooling for Replit environment (runtime error overlay, dev banner, cartographer)

### UI Enhancement Libraries
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel/slider functionality
- **class-variance-authority**: Type-safe variant creation for components
- **cmdk**: Command menu component
- **lucide-react**: Icon library