# NE Parking Management System

A microservice-based car parking management system that allows users to book parking spaces, check availability, pay fees, and monitor parking duration.

## Features

- User authentication and authorization (Admin and User roles)
- Email verification and password reset
- Parking location management
- Real-time parking space availability
- Car entry and exit tracking
- Automated billing
- Email notifications for tickets and bills
- Comprehensive reporting system

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- SMTP server for email notifications

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/neparking?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_key

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@neparking.com
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ne-parking-management.git
cd ne-parking-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Seed the database with initial data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:4000/api-docs
```

## Default Admin Account

After seeding the database, you can log in with the following admin credentials:
- Email: admin@neparking.com
- Password: admin123

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input sanitization
- CORS protection
- Rate limiting
- Helmet security headers
- SQL injection prevention
- XSS protection

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/verify - Verify user email
- POST /api/auth/login - User login
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password

### Parking Management
- POST /api/parking - Create parking location (Admin only)
- GET /api/parking - Get all parking locations
- GET /api/parking/:code - Get parking by code
- PUT /api/parking/:code - Update parking location (Admin only)
- DELETE /api/parking/:code - Delete parking location (Admin only)

### Parking Entries
- POST /api/entries - Record car entry
- PUT /api/entries/:id/exit - Record car exit
- GET /api/entries - Get parking entries with filtering

### Reports
- GET /api/reports/entries - Get entries report
- GET /api/reports/exits - Get exits report
- GET /api/reports/statistics - Get parking statistics

## License

MIT
