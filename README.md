# Secure User Authentication and Authorization System

This project is an Express.js application that implements a secure user authentication and authorization system. It includes essential features such as JWT-based authentication, role-based access control, password reset, and various security measures to protect against common vulnerabilities.

---

## Features

- **User Registration & Authentication**
  - Register and log in users with hashed passwords (using bcrypt).
  - Token-based authentication using JSON Web Tokens (JWT).
- **Role-Based Access Control**
  - Role-based authorization for routes (e.g., "user" and "admin").
  - Admins have additional permissions to access admin-specific routes.
- **Secure Routes**
  - Middleware to validate JWT tokens and secure sensitive endpoints.
- **Password Reset**
  - Forgot Password functionality using email-based secure token.
- **Security**
  - Security headers using `helmet`.
  - Protection against XSS attacks with `xss-clean`.
  - CSRF protection using `csurf`.
- **Logging**
  - Basic logging system to record user activities and security events.
- **Testing**
  - Includes routes and Postman collection for easy testing.

---

## Prerequisites

Ensure the following are installed before starting:
- Node.js >= 14.x
- MongoDB
- Postman for API testing

### Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```plaintext
MONGO_URI=mongodb_connection_string
PORT=3000
SALT_ROUNDS=number
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
EMAIL_USER=email_username
EMAIL_PASS=email_password
NODE_ENV=production
BASE_URL=productionURL
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anudeep009/Authorization/
   cd Authorization
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development server (e.g., `http://localhost:3000`).

5. ## Folder Structure

```
Authorization/
│
├── controllers/    # Contains route handlers
├── middlewares/    # Middleware for security, logging, etc.
├── models/         # Database models (e.g., User model)
├── routes/         # API route definitions
├── utils/          # Utility functions like logger
│
├── .env            # Environment variables file
├── package.json    # Project metadata and dependencies
├── README.md       # Project documentation
└── server.js       # Main server file

```

## Author

- **Anudeep Avula**  
- [GitHub Profile](https://github.com/anudeep009/Authorization/)
