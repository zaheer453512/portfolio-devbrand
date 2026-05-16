# DevBrand — Premium Portfolio & Developer Brand Website

A full-stack premium portfolio website with admin dashboard, review system, Cloudinary media storage, MongoDB database, and modern animated UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Media | Cloudinary |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## Project Structure

```
portfolio/
├── frontend/          # Next.js application
│   ├── app/           # App Router pages
│   │   ├── page.tsx   # Main portfolio page
│   │   └── admin/     # Admin panel pages
│   ├── components/    # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatsAppFloat.tsx
│   │   └── sections/  # Page sections
│   └── lib/api.ts     # API utilities
│
└── backend/           # Node.js/Express API
    ├── server.js
    ├── routes/        # API routes
    ├── models/        # MongoDB models
    ├── middleware/    # Auth middleware
    └── config/        # DB & Cloudinary
```

---

## Quick Setup Guide

### Step 1: Clone & Install

```bash
# Backend
cd portfolio/backend
npm install
cp .env.example .env   # Fill in your values

# Frontend
cd portfolio/frontend
npm install
cp .env.example .env.local   # Fill in your values
```

---

### Step 2: MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add to backend `.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio
```

---

### Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com) and create account
2. Go to Dashboard → copy credentials
3. Add to backend `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Step 4: Configure Environment Variables

**Backend `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=SecurePassword123!
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP=923001234567
NEXT_PUBLIC_EMAIL=your@email.com
```

---

### Step 5: Run Locally

```bash
# Terminal 1 — Backend
cd portfolio/backend
npm run dev

# Terminal 2 — Frontend
cd portfolio/frontend
npm run dev
```

- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **API**: http://localhost:5000/api/health

---

## Admin Login

First login uses the credentials from your `.env`:
```
Email:    ADMIN_EMAIL value
Password: ADMIN_PASSWORD value
```

A new admin account is created automatically on first login.

---

## Deployment

### Backend → Railway

1. Push backend code to GitHub
2. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo → Set root directory to `backend`
4. Add all environment variables in Railway dashboard
5. Deploy → copy your Railway URL

### Frontend → Vercel

1. Push frontend code to GitHub
2. Go to [Vercel](https://vercel.com) → New Project → Import from GitHub
3. Set root directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Railway URL + `/api`
   - `NEXT_PUBLIC_WHATSAPP` = your WhatsApp number
   - `NEXT_PUBLIC_EMAIL` = your email
5. Deploy

---

## API Endpoints

### Public
```
GET    /api/health
GET    /api/projects
GET    /api/projects/:id
GET    /api/reviews
POST   /api/reviews          (submit review with optional video)
GET    /api/content
GET    /api/content/:key
```

### Admin (requires Bearer token)
```
POST   /api/auth/login
GET    /api/auth/verify
PUT    /api/auth/change-password

GET    /api/projects/admin/all
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/reviews/admin/all
PATCH  /api/reviews/:id/status
PATCH  /api/reviews/:id/feature
PUT    /api/reviews/:id
DELETE /api/reviews/:id

POST   /api/media/image
POST   /api/media/video
DELETE /api/media/:publicId
GET    /api/media/list/:folder

PUT    /api/content/:key
DELETE /api/content/:key
```

---

## Admin Panel Features

| Feature | Description |
|---|---|
| Dashboard | Stats overview, recent reviews, quick actions |
| Projects | Add/Edit/Delete projects with images |
| Reviews | Approve/Reject/Edit/Pin/Feature reviews |
| Media | Upload images & videos to Cloudinary |
| Content | Edit all text content dynamically |
| Security | Change admin password |

---

## Customization

### Change Colors
Edit `frontend/app/globals.css`:
```css
:root {
  --primary: #00FF94;  /* Change accent color */
}
```

### Change Your Info
1. Login to Admin → Content → fill all fields
2. Or edit `components/sections/HeroSection.tsx` directly

### Add Skills
Edit `components/sections/SkillsSection.tsx`

### Add Services
Edit `components/sections/ServicesSection.tsx`

---

## Future Additions (Scalable)

The architecture supports:
- Blog system (add Blog model + routes)
- Booking/calendar system
- AI chatbot integration
- Analytics dashboard
- Client portal

---

## License

MIT — Free to use for personal and commercial projects.
