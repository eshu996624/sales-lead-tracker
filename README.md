# Qwings School Partnership Management System

Modern SaaS platform for Qwings school partnership operations.

## Structure

- `client/` — React + Tailwind frontend
- `server/` — Node.js + Express backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```
2. Create a `.env` file in `server/` with:
   ```env
   MONGO_URI=mongodb://localhost:27017/qwings
   JWT_SECRET=supersecretjwtkey
   PORT=5000
   ```
3. Run both apps:
   ```bash
   npm run dev
   ```

## Notes

- The frontend uses Tailwind CSS, React Router, Axios, and Recharts.
- The backend uses JWT authentication, role-based authorization, Multer CSV upload, and MongoDB.
- Place company branding assets under `client/public` if you want to replace the default visuals.
