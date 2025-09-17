# Expense Management Frontend

A React.js frontend for the Expense Management System with JWT authentication, Axios for API calls, and Tailwind CSS for styling.

## Features

- **Authentication**: Login and Register with JWT tokens
- **User Dashboard**: Submit expenses with file upload, view personal expenses, and see expense statistics
- **Admin Dashboard**: View all expenses, approve/reject expenses, and mark as paid
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop
- **Role-based UI**: Different views for users and admins

## Tech Stack

- React.js 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:8080

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will run on http://localhost:3000

### Build for Production

```bash
npm run build
```

## API Integration

The frontend integrates with the Spring Boot backend API:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /expenses` - Submit expense (multipart form data)
- `GET /expenses/my` - Get user's expenses
- `GET /expenses` - Get all expenses (admin)
- `PUT /expenses/{id}/status` - Update expense status (admin)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   ├── AdminDashboard.js
│   │   ├── Header.js
│   │   ├── LoginForm.js
│   │   ├── RegisterForm.js
│   │   ├── SubmitExpenseForm.js
│   │   └── UserDashboard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

## Usage

1. **Login/Register**: Create an account or login with existing credentials
2. **User Dashboard**: Submit new expenses with optional file uploads, view your expense history and statistics
3. **Admin Dashboard**: Review all submitted expenses, approve or reject pending expenses, and mark approved expenses as paid

## Layout Changes

In the User Dashboard, the layout has been adjusted as requested:
- **Left**: My Expenses list
- **Middle**: Submit New Expense form
- **Right**: Statistics cards (Total Expenses, Pending, Paid)
