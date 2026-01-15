# Store Rating App

A full-stack application for rating stores with role-based access control, built with React.js and Express.js.

## Features

### 🔐 Authentication System
- **Role-based access control** with three user types:
  - **System Administrator**: Full platform management
  - **Store Owner**: Manage store ratings and analytics
  - **Normal User**: Browse stores and submit ratings
- **Secure password hashing** with bcrypt
- **JWT-based authentication**
- **Form validations** (frontend & backend)

### 📊 User Roles & Functionalities

#### System Administrator
- Dashboard with platform statistics (total users, stores, ratings)
- Add new stores, normal users, and admin users
- View stores list with name, email, address, overall rating
- View users list with name, email, address, role
- Apply filters and sorting on all listings
- View user details including store ratings for store owners

#### Normal User
- Signup & login with comprehensive validation
- View all registered stores with search and filtering
- Store listings show: name, address, overall rating, user's submitted rating
- Submit or modify ratings (1-5 stars)
- Update password after login

#### Store Owner
- Login & update password
- Dashboard showing list of users who rated their store
- Average store rating analytics
- Rating distribution and customer insights

### 🛠 Technical Implementation

#### Backend (Express.js)
- **Clean MVC structure** with proper separation of concerns
- **REST APIs** with comprehensive validation
- **Role-based middleware** for access control
- **MySQL database** with normalized schema
- **Proper error handling** and logging

#### Frontend (React.js)
- **Component-based architecture** with reusable components
- **Role-based UI rendering** with protected routes
- **Modern UI** using TailwindCSS and Lucide icons
- **Responsive design** for mobile and desktop
- **Real-time updates** and smooth interactions

#### Database Schema
- **Users table**: id, name, email, password, address, role, timestamps
- **Stores table**: id, name, email, address, owner_id, timestamps
- **Ratings table**: id, user_id, store_id, rating, timestamps
- **Proper foreign key relationships** and constraints

## 📋 Form Validations

- **Name**: 20-60 characters (required)
- **Email**: Standard email validation (required, unique)
- **Password**: 8-16 characters, at least one uppercase letter & one special character
- **Address**: Maximum 400 characters (required)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL or MySQL-compatible database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store-rating-app
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Database Setup**
   ```bash
   # Create a MySQL database
   CREATE DATABASE store_rating_db;
   ```

4. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your database credentials
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=store_rating_db
   JWT_SECRET=your-super-secret-jwt-key
   ```

5. **Start the application**
   ```bash
   # Start both client and server concurrently
   npm run dev
   
   # Or start individually:
   # Client: npm start
   # Server: cd server && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🎯 Demo Accounts

The application automatically creates a default admin user:

- **Email**: admin@store.com
- **Password**: Admin123!
- **Role**: System Administrator

You can use this account to create additional users and stores for testing.

## 📱 Usage

### For System Administrators
1. Login with admin credentials
2. Access dashboard to view platform statistics
3. Create users and stores using the dashboard
4. Monitor and manage all platform activities

### For Store Owners
1. Register as a store owner or have admin create your account
2. Login to access your store dashboard
3. View customer ratings and analytics
4. Track store performance over time

### For Normal Users
1. Register with your details (name 20-60 chars, strong password)
2. Browse and search stores
3. Rate stores you've visited
4. View and update your ratings

## 🔧 Development

### Project Structure
```
store-rating-app/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── package.json           # Root package.json
```

### Available Scripts
- `npm run dev` - Start both client and server in development mode
- `npm start` - Start only the React development server
- `npm run server` - Start only the Express server
- `npm run build` - Build the React application for production

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password

#### Users (Admin only)
- `POST /api/users/createUser` - Create new user
- `GET /api/users/getAllUsers` - Get all users with filters
- `GET /api/users/getUserById/:id` - Get user by ID
- `GET /api/users/dashboard/stats` - Get dashboard statistics

#### Stores
- `GET /api/stores/getAllStores` - Get all stores with filters
- `GET /api/stores/getStoreByid/:id` - Get store by ID
- `POST /api/stores/create-store` - Create store (Admin only)
- `GET /api/stores/owner/dashboard` - Store owner dashboard

#### Ratings
- `POST /api/ratings/submitRating` - Submit/update rating
- `GET /api/ratings/getUserRating` - Get user's ratings
- `GET /api/ratings/store/rating/:storeId` - Get store with user rating

## 🎨 UI Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Easy on the eyes (configurable)
- **Real-time Updates**: Instant feedback on user actions
- **Sorting & Filtering**: Advanced search and filter capabilities
- **Interactive Ratings**: Visual star rating system
- **Role-based Navigation**: Dynamic menu based on user role

## 🔒 Security Features

- **Password Hashing**: Secure bcrypt implementation
- **JWT Authentication**: Stateless token-based auth
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Secure cross-origin resource sharing
- **Rate Limiting**: Prevent brute force attacks (configurable)

## 📊 Analytics & Reporting

- **Platform Statistics**: Real-time dashboard metrics
- **User Activity**: Track user engagement
- **Rating Analytics**: Store performance insights
- **Growth Metrics**: Monitor platform growth

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the existing documentation
- Review the demo accounts section for quick testing

---

**Built with ❤️ using React, Express.js, MySQL, and TailwindCSS**
