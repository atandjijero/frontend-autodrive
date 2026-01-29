# AutoDrive - Vehicle Rental Platform

## Overview

AutoDrive is a comprehensive vehicle rental platform built with modern web technologies. This application provides a seamless experience for vehicle rentals between businesses, individuals, and agencies, featuring advanced management tools, real-time availability, and automated contract generation.

## Features

### 🔐 Authentication System
- Multi-role user registration and login (Admin, Client, Business, Tourist)
- JWT-based secure authentication
- Password recovery via email
- OTP verification for enhanced security

### 👤 User Management
- Personalized user profiles
- Role-based permissions system
- Comprehensive personal information management
- Emergency contact details

### 🚗 Fleet Management
- Extensive vehicle catalog with high-quality photos
- Detailed vehicle information (make, model, license plate, pricing)
- Real-time availability tracking
- Advanced search and filtering capabilities

### 🏢 Agency Management
- Complete agency creation and management
- Full contact information and geolocation
- Active/inactive agency status
- Bulk data import functionality

### 📋 Reservation and Contract System
- Automated contract generation
- Flexible rental period management
- Automatic pricing calculations
- Deposit and installment payment options
- Customizable special conditions
- Admin validation workflow
- Complete contract history

### ✅ Validation and Approval
- Multi-step approval workflow
- Administrator validation process
- Status notifications (Pending, Approved, Rejected)
- Validation history with timestamps
- Optional rejection reasons

### 📄 PDF Document Generation
- Automatic contract PDF generation
- Integrated agency branding and logos
- Comprehensive contract details
- Secure document downloads

### 💰 Financial Management
- Payment tracking and history
- Deposit calculations
- Total amount management
- Financial dashboards per contract

### 🎯 Promotion System
- Customizable promo codes
- Percentage or fixed amount discounts
- Configurable validity periods
- Automatic application during booking
- Active/inactive promotion management
- Usage statistics

### 📊 Analytics and Dashboards
- Comprehensive admin dashboard
- Real-time statistics
- Active contract management
- Fleet overview
- Performance metrics

### 🌐 Internationalization (i18n)
- Multi-language support: French, English, German
- Dynamic language switching
- Localized user interfaces

### 🎨 Modern User Interface
- Fully responsive design (mobile, tablet, desktop)
- Automatic dark/light theme
- Reusable UI components (shadcn/ui)
- Smooth animations and transitions
- WCAG accessibility compliance

### 🔍 Advanced Search and Filtering
- Vehicle search by multiple criteria
- Advanced filters: make, model, price, availability
- Real-time search suggestions
- Intelligent recommendations

### 📱 Mobile-First Design
- Optimized mobile navigation
- Touch-friendly interfaces
- Cross-device performance
- Responsive layouts

### 🛡️ Security and Compliance
- Sensitive data encryption
- CSRF protection
- Server-side validation
- Comprehensive audit logs
- Secure session management

### 📧 Notifications and Communication
- Integrated notification system
- Automated email alerts
- In-app messaging
- Communication history

### 🔧 Advanced Administration
- Complete admin panel
- User management tools
- Contract moderation
- System configuration
- Logs and monitoring

### 📈 Performance and Optimization
- Component lazy loading
- Image optimization
- Intelligent caching
- Bundle splitting
- Performance monitoring

### 🔗 Integrations
- RESTful API
- Optimized database connections
- External services (payment, geolocation)
- Event webhooks

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build and development
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **React Hook Form** for forms
- **Zod** for validation
- **i18next** for internationalization
- **Axios** for API calls
- **jsPDF** for document generation
- **Framer Motion** for animations

### Backend
- **NestJS 11** with TypeScript
- **Express 5** as HTTP server
- **MongoDB 8.20** as database
- **Mongoose 8.20** as ODM
- **JWT** for authentication
- **Passport** for authentication strategies
- **bcrypt** for password hashing
- **Stripe** for payment processing
- **Nodemailer** for email notifications
- **Swagger** for API documentation

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Prettier** for code formatting
- **Vitest** for unit testing
- **Playwright** for E2E testing

## Installation and Setup

### Prerequisites
- Node.js v18.0 or higher
- npm 9.0+ or yarn 3.0+
- MongoDB 4.4+ (local or MongoDB Atlas cloud)
- Git 2.0+

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone <repository-frontend-url>
   cd frontend-autodrive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=AutoDrive
   VITE_APP_VERSION=1.0.0
   VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open browser: `http://localhost:5173`

### Backend Setup
1. Clone the backend repository:
   ```bash
   git clone <repository-backend-url>
   cd backend-autodrive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/autodrive
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRATION=24h
   STRIPE_SECRET_KEY=sk_test_xxxxx
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_password
   PORT=3000
   NODE_ENV=development
   ```

4. Start backend:
   ```bash
   npm run start:dev
   ```

5. Backend URL: `http://localhost:3000`
6. API Documentation: `http://localhost:3000/api`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting and Formatting
```bash
npm run lint
npm run format
```

### Testing
```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
```

## Project Structure

```
src/
├── api/                    # API client and configurations
├── app/                    # Application pages and routes
│   └── dashboard/          # Dashboard components
├── assets/                 # Static assets
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── forms/              # Form components (auth, reservations, etc.)
│   └── layout/             # Layout components (navbar, sidebar)
├── context/                # React context providers (AuthContext)
├── hooks/                  # Custom React hooks (useAuth, useBlog)
├── layouts/                # Page layout components (DashboardLayout)
├── lib/                    # Utility functions (PDF generation, utils)
├── locales/                # i18n translation files (FR, EN, DE)
├── pages/                  # Page components
│   ├── admin/              # Admin dashboard pages
│   ├── auth/               # Login, signup, password recovery
│   ├── blog/               # Blog and articles
│   ├── client/             # Client reservations
│   ├── entreprise/         # Business account pages
│   ├── reservations/       # Reservation management
│   ├── touriste/           # Tourist booking pages
│   └── vehicules/          # Vehicle catalog and details
└── types/                  # TypeScript type definitions
```

## Data Model

### Core Entities
- **User**: Base user entity with role-based access (Admin, Client, Entreprise, Touriste)
- **Vehicule**: Vehicle details with pricing and availability
- **Reservation**: Booking records with status tracking
- **Contrat**: Automated contract generation and management
- **Paiement**: Payment records and transaction history
- **Agence**: Rental agency information and locations
- **Article**: Blog posts and content
- **Commentaire**: User comments on blog articles
- **Contact**: Contact form submissions
- **Promotion**: Discount codes and promotional offers

### Database
- **MongoDB 8.20** with local development instance at `mongodb://localhost:27017`
- Collections: Users, Vehicles, Reservations, Payments, Agencies, Contracts, Articles, Comments, Contacts, Promotions

## Usage

### For End Users
1. **Registration**: Create an account with appropriate role (Client, Business, Tourist)
2. **Browse Vehicles**: Explore the vehicle catalog with advanced filters
3. **Make Reservations**: Select dates and book vehicles
4. **Payment**: Complete secure payment process
5. **Contract Generation**: Receive automatically generated PDF contracts

### For Administrators
1. **Fleet Management**: Add, edit, and manage vehicles
2. **User Management**: Oversee user accounts and permissions
3. **Contract Validation**: Review and approve rental contracts
4. **Analytics**: Monitor platform performance and metrics
5. **Agency Management**: Manage rental agencies and locations

## API Integration

The frontend communicates with a NestJS backend providing RESTful API endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/forgot-password` - Password recovery request
- `POST /auth/reset-password` - Password reset

### Vehicles
- `GET /vehicles` - List all vehicles with filters
- `GET /vehicles/:id` - Vehicle details
- `GET /vehicles/:id/availability` - Check availability
- `POST /vehicles` (Admin) - Create vehicle
- `PUT /vehicles/:id` (Admin) - Update vehicle
- `DELETE /vehicles/:id` (Admin) - Delete vehicle

### Reservations
- `POST /reservations` - Create new reservation
- `GET /reservations` - List user reservations
- `GET /reservations/:id` - Reservation details
- `GET /reservations/:id/pdf` - Download contract
- `PUT /reservations/:id` - Modify reservation
- `DELETE /reservations/:id` - Cancel reservation

### Payments
- `POST /paiements` - Process payment
- `GET /paiements` - Payment history
- `GET /paiements/:id` - Payment details

### Promotions
- `GET /promotions` - Active promotions
- `POST /promotions/validate` - Validate promo code
- `POST /promotions` (Admin) - Create promotion

### Blog
- `GET /blog` - List articles
- `GET /blog/:slug` - Article details
- `POST /blog/:id/comments` - Add comment
- `POST /blog` (Admin) - Create article
- `PUT /blog/:id` (Admin) - Update article

### Dashboard
- `GET /dashboard` - Admin statistics and metrics

## Role-Based Access Control

The application implements role-based permissions:

### Admin
- Complete platform management
- User account management
- Vehicle fleet administration
- Contract validation and approval
- Promotion and offer management
- System configuration and monitoring

### Client
- Vehicle browsing and searching
- Reservation creation and management
- Contract download and review
- Profile management
- Blog interaction and comments

### Entreprise (Business)
- Multi-vehicle reservation and booking
- Commercial contract creation
- Fleet management dashboard
- Automatic reservation processing after contract approval
- Payment and billing access
- Promotion utilization

### Touriste (Tourist)
- Simplified vehicle rental
- Quick booking interface
- Multilingual interface support
- Short-term rental optimization
- Basic profile management

## Security and Compliance

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication (HS256)
- **Access Tokens**: Expire after 24 hours
- **Refresh Tokens**: Expire after 7 days
- **Password Hashing**: bcrypt with cost factor 12
- **Rate Limiting**: 5 login attempts per 5 minutes per IP

### Data Protection
- **HTTPS Encryption**: TLS 1.2+ for all communications
- **Data Encryption**: AES-256 for sensitive data at rest
- **Input Validation**: Comprehensive client and server-side validation
- **CSRF Protection**: Cross-site request forgery prevention tokens
- **XSS Prevention**: Content escaping and HTML sanitization
- **RGPD Compliance**: Data export, right to be forgotten, audit logging

### Payment Security
- **PCI DSS Compliance**: No direct card data storage
- **Stripe Integration**: Tokenized payment processing
- **Secure Transactions**: Encrypted payment communications

### Audit and Monitoring
- **Comprehensive Logging**: All user actions logged
- **Soft Deletes**: Data retention for audit trails
- **Incident Tracking**: Security incident logging and reporting
- **Monitor Storage**: AWS S3 / CDN for secure file management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, documentation, and resources:
- **Email**: support@autodrive.local
- **Complete Documentation**: [LIVRABLE_AUTODRIVE_FINAL.txt](LIVRABLE_AUTODRIVE_FINAL.txt)
- **User Guide**: [guide_utilisateur.txt](guide_utilisateur.txt)
- **Project Details**: [LIVRABLE_PROJET_AUTODRIVE.md](LIVRABLE_PROJET_AUTODRIVE.md)
- **API Documentation**: Swagger UI at `http://localhost:3000/api`

## Development Status

**Status**: En développement local (In local development)

All features are currently functional in the development environment:
- ✓ Application fully functional locally
- ✓ All features developed and tested
- ✓ Infrastructure documented for production deployment
- ✓ Ready for demonstration and continuous integration

---

*AutoDrive - Your trusted partner for vehicle rentals*
*Built with React 18, NestJS 11, and MongoDB*
