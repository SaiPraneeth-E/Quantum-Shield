# Quantum-Enhanced Real-Time Phishing Detection System

Full-stack web application for real-time phishing website detection using a **Hybrid Quantum + Machine Learning** pipeline.

## Features

- **User authentication** (JWT, bcrypt) with roles: User & Admin
- **Real-time prediction**: Enter a URL and get Phishing / Legitimate result with confidence
- **User**: Register, Login, Predict, View history
- **Admin**: View users, predictions, analytics (charts), manage user roles
- **MongoDB** for users and predictions
- **Node.js + Express** API gateway and auth
- **Python FastAPI** ML service (scaler → quantum features → final model)

## Project Structure

```
phishing-detection-system/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # Node.js Express (auth, API gateway)
│   └── ml_service/    # Python FastAPI + ML pipeline
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **MongoDB** (local or MongoDB Atlas)
- Trained model files (optional): `phishing_model.pkl`, `quantum_model.pkl`, `scaler.pkl`, `quantum_scaler.pkl` in `backend/ml_service/`

### Windows: If PowerShell blocks npm ("running scripts is disabled")

Use the `.cmd` launcher so scripts are allowed:

```powershell
npm.cmd install
npm.cmd run dev
```

Or use **Command Prompt (cmd)** instead of PowerShell—there `npm` runs as `npm.cmd` by default.

## Quick Start

### 1. Backend (Node.js)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, etc.
npm run dev
```

Runs on **http://localhost:5000**

### 2. ML Service (Python)

```bash
cd backend/ml_service
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
# Place your .pkl files here (optional; fallback heuristic works without them)
uvicorn predict:app --host 0.0.0.0 --port 8000
```

Runs on **http://localhost:8000**

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:3000**. Proxy forwards `/api` to the Node backend.

### 4. Registration & who is admin?

**How to register (normal user)**  
- Open the app → click **Register** (or **Get Started**).  
- Fill in name, email, password → you get an account with role **user**.  
- You can then **Login** and use Dashboard, Predict, History.

**Who is admin?**  
- There is **no “register as admin”** in the UI (for security).  
- An admin is any user whose `role` in the database is set to `admin`.

**How to create / become admin**

**Option A – Seed script (first-time admin)**  
From the `backend/` folder, with MongoDB and backend running:

```bash
# Optional: in backend/.env set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
# Defaults: admin@example.com / admin123 / Admin
node scripts/seedAdmin.js
```

This creates (or updates) one user to `role: admin`. Log in at **Admin Login** with that email and password.

**Option B – Promote an existing user**  
1. Register normally (or use an existing user).  
2. In MongoDB (Compass, shell, or any client), run:

```javascript
db.users.updateOne(
  { email: "the-user@example.com" },
  { $set: { role: "admin" } }
)
```

3. That user can then use **Admin Login** and access Admin Panel & Analytics.

## Environment Variables

**Backend (`.env`):**

| Variable        | Description                    | Default                    |
|----------------|--------------------------------|----------------------------|
| PORT           | Server port                    | 5000                       |
| MONGODB_URI    | MongoDB connection string      | mongodb://localhost:27017/phishing-detection |
| JWT_SECRET     | Secret for JWT signing         | (set in production)        |
| ML_SERVICE_URL | FastAPI ML service URL         | http://localhost:8000      |
| FRONTEND_URL   | CORS origin for frontend       | http://localhost:3000      |
| CONTACT_EMAIL  | Where Connect form submissions are sent | saipraneeth080805@gmail.com |
| GMAIL_USER     | Gmail address for sending Connect emails | (same as CONTACT_EMAIL) |
| GMAIL_APP_PASSWORD | Gmail [App Password](https://support.google.com/accounts/answer/185833) (2FA required) | (required for Connect form) |

**Frontend:**  
Optional: `VITE_API_URL` — backend base URL (e.g. `http://localhost:5000`). If unset, Vite proxy is used when running `npm run dev`.

## API Endpoints

| Method | Endpoint              | Description        |
|--------|------------------------|--------------------|
| POST   | /api/auth/register     | Register user      |
| POST   | /api/auth/login        | Login              |
| GET    | /api/auth/me           | Current user (JWT) |
| POST   | /api/contact           | Connect form (name, mobile, email, description) → sends to CONTACT_EMAIL |
| POST   | /api/predict           | Predict URL (JWT)  |
| GET    | /api/predict/history   | User history (JWT) |
| GET    | /api/admin/users       | List users (Admin) |
| GET    | /api/admin/predictions | List predictions (Admin) |
| GET    | /api/admin/analytics   | Analytics (Admin)  |
| PATCH  | /api/admin/users/:id   | Update user role (Admin) |

**ML Service:**

| Method | Endpoint | Description     |
|--------|----------|-----------------|
| POST   | /predict | Body: `{ "url": "https://..." }` → `{ "prediction", "confidence" }` |
| GET    | /health  | Health check    |

## Model Pipeline

1. **Input**: URL string
2. **Feature extraction**: URL-based features (length, special chars, domain, etc.)
3. **Preprocessing**: `scaler.pkl`
4. **Quantum feature generation**: `quantum_model.pkl` (optional)
5. **Final prediction**: `phishing_model.pkl` → Phishing / Legitimate + confidence

If `.pkl` files are not present in `backend/ml_service/`, the service uses a simple heuristic so the app still runs.

## Deployment

- **Frontend**: Vercel, Netlify (set `VITE_API_URL` to your backend URL)
- **Backend**: Render, Railway, AWS (set env vars and `ML_SERVICE_URL`)
- **Database**: MongoDB Atlas
- **ML Service**: Render, Railway, or Docker (expose port and set `ML_SERVICE_URL` in backend)

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router, Recharts, Axios
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt, Axios
- **ML**: Python, FastAPI, Scikit-learn, NumPy, Qiskit (optional), joblib
