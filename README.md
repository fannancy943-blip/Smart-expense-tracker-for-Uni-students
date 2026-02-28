<<<<<<< HEAD
# UniTracker - Student Expense Tracking Application

A full-stack web application for students to track expenses, set budgets, and manage savings goals.

## Features

- User authentication with JWT
- Expense tracking by category
- Budget management with alerts
- Savings goals tracking
- Responsive design with Tailwind CSS

## Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL database
- JWT authentication
- express-validator for input validation

**Frontend:**
- React 18
- Vite build tool
- Tailwind CSS
- Axios for API calls

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Development Setup

1. **Clone and install dependencies:**
```bash
npm run install:all
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unitracker
JWT_SECRET=your_jwt_secret
```

3. **Create database and tables:**
```bash
mysql -u root -p < schema.sql
```

4. **Run development servers:**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

Backend will run on http://localhost:5000
Frontend will run on http://localhost:5173

## Production Build

### Using Docker (Recommended)

1. **Create .env file** with production values

2. **Build and run:**
```bash
docker-compose up --build
```

### Manual Build

1. **Build frontend:**
```bash
npm run build:frontend
```

2. **Start backend in production:**
```bash
NODE_ENV=production npm start
```

Backend serves the frontend at http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/budget-settings` - Update budget settings
- `PUT /api/user/change-password` - Change password

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

### Savings Goals
- `GET /api/savings` - Get all savings goals
- `PUT /api/savings/:id` - Update savings goal

## Project Structure

```
unitracker/
├── backend/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server
│   ├── db.js           # MySQL connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── api/        # API service layer
│   │   └── main.jsx
│   └── package.json
├── schema.sql          # Database schema
├── Dockerfile          # Container configuration
└── docker-compose.yml  # Multi-container setup
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL user | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | unitracker |
| JWT_SECRET | JWT signing secret | - |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| FRONTEND_URL | Frontend origin URL | http://localhost:5173 |

## Deployment

### Heroku
1. Add `Procfile` with: `web: npm --prefix backend start`
2. Set environment variables in Heroku dashboard
3. Deploy

### AWS, GCP, Azure
Deploy using Docker containers with the provided Dockerfile.

## Security Considerations

1. ✅ Passwords hashed with bcryptjs
2. ✅ JWT token-based authentication
3. ✅ CORS properly configured
4. ✅ Input validation with express-validator
5. ✅ Environment variables for secrets
6. ⚠️ Use HTTPS in production
7. ⚠️ Implement rate limiting
8. ⚠️ Add CSRF protection if needed

## Future Enhancements

- [ ] Email notifications for budget alerts
- [ ] Recurring expenses
- [ ] Multi-user sharing (family budgets)
- [ ] Data export (CSV/PDF)
- [ ] Mobile app version
- [ ] Advanced analytics and charts
- [ ] Two-factor authentication

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
=======
# Smart-expense-tracker-for-Uni-students
Add budgets, expenses calculate the expenses and give warnings  when the expense exceeds the budget.   
>>>>>>> 665847747cc69b1ec60144a423c4e898046f542a
