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

## Production build and deployment

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the backend server in production mode:
   ```bash
   NODE_ENV=production npm start
   ```
3. The backend will serve the built React app from `client/dist` and expose the API on `/api`.

### Deployment notes

- Root `package.json` includes a `heroku-postbuild` script that builds the client during deployment.
- Make sure `server/.env` contains `MONGO_URI`, `JWT_SECRET`, and `PORT` in the production environment.
- If deploying to a separate frontend host, use `client/vite.config.js` proxy for local dev and set `base` appropriately for production.

## Notes

- The frontend uses Tailwind CSS, React Router, Axios, and Recharts.
- The backend uses JWT authentication, role-based authorization, Multer CSV upload, and MongoDB.
- Place company branding assets under `client/public` if you want to replace the default visuals.
