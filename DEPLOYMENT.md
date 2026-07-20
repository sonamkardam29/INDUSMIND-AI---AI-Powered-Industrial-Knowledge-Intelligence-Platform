# DEPLOYMENT GUIDE - INDUSMIND AI

This guide details how to deploy INDUSMIND AI to production hosting services:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

---

## 1. MongoDB Atlas Database Setup

1. Create a MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Network Access: Allow access from anywhere (`0.0.0.0/0`) or add Render IP addresses.
3. Database User: Create a user with ReadWrite permissions.
4. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/indusmind_ai?retryWrites=true&w=majority`

---

## 2. Backend Deployment on Render

1. Create a new **Web Service** on Render connecting your repository.
2. Root Directory: `server`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `<Your MongoDB Atlas Connection URI>`
   - `JWT_SECRET`: `<Secure Random 64-char String>`
   - `GEMINI_API_KEY`: `<Your Google Gemini API Key>`
   - `CLIENT_URL`: `https://indusmind-ai.vercel.app`

---

## 3. Frontend Deployment on Vercel

1. Import the repository into Vercel.
2. Framework Preset: **Vite**
3. Root Directory: `client`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: `https://indusmind-backend.onrender.com`
7. Click **Deploy**.

---

## Verification
- Visit `https://indusmind-backend.onrender.com/` → Verify `{"platform":"INDUSMIND AI","status":"Operational"}`.
- Visit `https://indusmind-ai.vercel.app` → Test login, document upload, and RAG copilot querying.
