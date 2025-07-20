# Task Management MERN App

A simple MERN stack application for user authentication and task management, built as part of a technical assessment.

## Features

- **User Authentication**
  - Sign up with email and password
  - Login with JWT authentication (token stored in localStorage)
  - Protected routes: only logged-in users can manage tasks

- **Task Management**
  - Add, view, edit, and delete tasks (task name, description, due date)
  - Only authenticated users can manage their own tasks
  - Input validation for required fields
  - Responsive, modern UI (custom CSS, easily swappable for Tailwind)

- **API**
  - RESTful endpoints for authentication and task CRUD
  - JWT-protected task APIs
  - Data validation with express-validator

- **Database**
  - MongoDB for user and task storage

## Tech Stack

- **Frontend:** React.js (Create React App)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt
- **Styling:** Custom CSS (can be replaced with Tailwind CSS)
- **Icons:** Material-UI Icons

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/Div-Yas/task_management_mern.git
cd task_management_mern
```

#### 2. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

#### 3. Configure environment variables

**Backend:**
- Create a `.env` file in `/backend` with:
  ```
  MONGO_URI=<your-mongodb-uri>
  JWT_SECRET=<your-secret>
  PORT=5000
  ```
- Example for local MongoDB:
  ```
  MONGO_URI=mongodb://localhost:27017/task_management
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

**Frontend:**
- If needed, update `API_BASE_URL` in `frontend/src/constants.js` to match your backend URL (default: `http://localhost:5000`).

#### 4. Run the application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd ../frontend
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

## Usage

- Register a new account or login.
- Add, edit, or delete your tasks.
- Logout using the icon in the top right.

## Project Structure

```
task_management_mern/
  backend/
    controllers/
    middleware/
    models/
    routes/
    index.js
    ...
  frontend/
    src/
      pages/
      components/
      constants.js
      ...
```

## MongoDB Schemas

**User:**
```js
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Task:**
```js
{
  taskName: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

## Deployment

- **Bonus:** You can deploy the backend (e.g., Heroku, Render) and frontend (e.g., Vercel, Netlify).
- Update `API_BASE_URL` in the frontend to point to your deployed backend.

## Git & Commits

- Each feature/bugfix should be committed separately with a meaningful message.
- Do not commit all changes at once.

## License

MIT

---

**Assessment Submission**

- GitHub repo: [https://github.com/Div-Yas/task_management_mern.git](https://github.com/Div-Yas/task_management_mern.git)
- (Bonus) Deployed app: `<your-deployment-link>`

---

## Credits

- [Figma Design Reference](https://www.figma.com/design/JgvXmcESVZoJRAssBiGsPB/task?node-id=0-1&t=gKtZo6gBGUrMT05L-1)
