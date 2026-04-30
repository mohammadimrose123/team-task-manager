# Team Task Manager 🚀

A high-performance, real-time full-stack web application for managing team projects and tasks with beautiful responsive design and role-based access.

## 🌟 Key Features

- **Authentication System**: Secure JWT-based login and signup with glassmorphic UI.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full control over projects, tasks, and team management.
  - **Member**: Can track assigned tasks and update progress.
- **Task Management**: Title, description, assignment, due dates, **Priority (Low/Medium/High)**, and status tracking.
- **Real-Time Engine**: Powered by **Socket.io** for instant UI updates across all clients (no refresh needed).
- **Interactive Dashboard**: Real-time charts (Chart.js) visualizing task statuses, total workload, and overdue items.
- **Responsive Design**: Premium dark-mode/glassmorphism aesthetics built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Socket.io-client, Chart.js.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Socket.io.
- **Database**: MongoDB Atlas (with local in-memory fallback for offline/blocked development).

## 🧪 Demo Accounts (Pre-seeded)

The application automatically seeds itself with these accounts for testing:
- **Admin**: `admin@test.com` / `admin123`
- **Member**: `member@test.com` / `member123`

---

## 🚀 One-Click Deployment (Railway)

The app is pre-configured for a unified single-service deployment on Railway.

### 1. Repository Setup
Push the entire project to your GitHub repository.

### 2. Railway Configuration
- Create a new Project on [Railway.app](https://railway.app/).
- Select **Deploy from GitHub repo**.
- Add the following **Variables**:
  - `NODE_ENV`: `production`
  - `MONGODB_URI`: (Your MongoDB Atlas connection string)
  - `JWT_SECRET`: (Any random string)
  - `PORT`: `5000` (Optional, Railway will assign one)

### 3. Build Command
Railway will detect the root `package.json`. It will automatically run:
```bash
npm run railway-build
```
This will build the frontend and serve it directly from the backend.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Start Backend & Frontend
Run both in separate terminals:
- **Backend**: `cd backend && npm run dev`
- **Frontend**: `cd frontend && npm run dev`

### 3. Database Fallback
If you are behind a firewall or have DNS issues connecting to MongoDB Atlas, the backend will **automatically** start a local in-memory database for you!

## 📜 License
MIT
