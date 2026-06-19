# 🌟 NayePankh Foundation – Volunteer Management & Internship Portal

A full-stack web application for managing volunteers, internships, certificates, and announcements for NayePankh Foundation NGO.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17, Bootstrap 5, TypeScript, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Icons | Bootstrap Icons |

---

## 📁 Project Structure

```
nayepankh/
├── backend/                   # Express.js REST API
│   ├── config/               # DB config
│   ├── controllers/          # Route handlers
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── services/             # Email & recommendation services
│   ├── server.js             # Entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── frontend/                 # Angular 17 SPA
    ├── src/
    │   ├── app/
    │   │   ├── components/   # All Angular components
    │   │   ├── guards/       # Route guards
    │   │   ├── models/       # TypeScript interfaces
    │   │   ├── services/     # HTTP & auth services
    │   │   ├── app.routes.ts
    │   │   ├── app.config.ts
    │   │   └── app.component.ts
    │   ├── environments/
    │   ├── styles.css
    │   └── index.html
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## ⚙️ Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local or Atlas)
- Angular CLI: `npm install -g @angular/cli`

---

## 🔧 Backend Setup

### 1. Navigate to backend directory
```bash
cd nayepankh/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Edit `.env` with your values
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nayepankh
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Gmail SMTP (use App Password, not your regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=NayePankh Foundation <noreply@nayepankh.org>
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App passwords → Generate one for "Mail"

### 5. Start the backend
```bash
# Development
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

### 6. Create Admin Account
```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nayepankh.org",
    "password": "admin123456",
    "phone": "9999999999",
    "secretKey": "NAYEPANKH_ADMIN_2024"
  }'
```

---

## 🎨 Frontend Setup

### 1. Navigate to frontend directory
```bash
cd nayepankh/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API URL (if needed)
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'   // your backend URL
};
```

### 4. Start the Angular development server
```bash
ng serve
# or
npm start
```

Frontend runs at: `http://localhost:4200`

---

## 📋 API Endpoints Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new volunteer |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/auth/create-admin` | Public+SecretKey | Create admin |
| GET | `/api/auth/profile` | Protected | Get current user |
| PUT | `/api/auth/profile` | Protected | Update profile |

### Volunteers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/volunteers` | Admin | Get all volunteers |
| POST | `/api/volunteers` | Volunteer | Create profile |
| GET | `/api/volunteers/me` | Volunteer | Get own profile |
| GET | `/api/volunteers/:id` | Protected | Get by ID |
| PUT | `/api/volunteers/:id` | Owner/Admin | Update |
| DELETE | `/api/volunteers/:id` | Admin | Delete |

### Internships
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/internships` | Protected | Get all |
| POST | `/api/internships` | Admin | Create |
| PUT | `/api/internships/:id` | Admin | Update |
| DELETE | `/api/internships/:id` | Admin | Delete |

### Applications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/applications/apply` | Volunteer | Apply |
| GET | `/api/applications/my` | Volunteer | My applications |
| GET | `/api/applications` | Admin | All applications |
| PUT | `/api/applications/:id/status` | Admin | Update status |

### Certificates
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/certificates/request` | Volunteer | Request certificate |
| GET | `/api/certificates/my` | Volunteer | My certificates |
| GET | `/api/certificates` | Admin | All requests |
| PUT | `/api/certificates/:id/approve` | Admin | Approve |
| PUT | `/api/certificates/:id/reject` | Admin | Reject |

### Announcements
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/announcements` | Protected | Get all |
| POST | `/api/announcements` | Admin | Create |
| PUT | `/api/announcements/:id` | Admin | Update |
| DELETE | `/api/announcements/:id` | Admin | Delete |

### Dashboard & Recommendations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/stats` | Admin | Dashboard statistics |
| POST | `/api/recommendations` | Protected | Get role recommendation |

---

## 🔐 Role-Based Access

### Admin can:
- View all volunteers, filter & search
- Create/edit/delete internships
- Review & update application statuses
- Approve/reject certificate requests
- Create/edit/delete announcements
- View full analytics dashboard with Chart.js graphs

### Volunteer can:
- Register & complete their profile
- Browse & apply for internships
- Track application statuses
- Request certificates
- View announcements
- Get AI-powered role recommendation

---

## 🤖 AI Recommendation System

The keyword-matching recommendation engine maps skills to roles:

| Skills | Recommended Role |
|--------|-----------------|
| Angular, React, CSS | Frontend Volunteer |
| Node.js, Express, MongoDB | Backend Volunteer |
| Angular + Node.js + MongoDB | Full Stack Volunteer |
| Python, TensorFlow, ML | AI Volunteer |
| SQL, Tableau, Power BI | Data Analytics Volunteer |

---

## 📊 Dashboard Charts (Chart.js)

1. **Volunteers by City** – Horizontal bar chart
2. **Skills Distribution** – Doughnut chart
3. **Applications by Category** – Pie chart
4. **Monthly Registrations** – Line chart with area fill

---

## 📧 Email Notifications (Nodemailer)

Emails are sent automatically for:
- ✅ Welcome on registration
- ✅ Internship application submitted
- ✅ Application status updated (Shortlisted/Selected/Rejected)
- ✅ Certificate approved
- ✅ Announcements (optional bulk email)

> Email sending is gracefully skipped if credentials are not configured.

---

## 🌐 MongoDB Collections

| Collection | Purpose |
|-----------|---------|
| `users` | Auth, roles, login |
| `volunteers` | Full volunteer profiles |
| `internships` | Internship listings |
| `applications` | Internship applications |
| `certificates` | Certificate requests |
| `announcements` | News & updates |

---

## 🔒 Security Features

- JWT tokens with 7-day expiry
- bcrypt password hashing (salt rounds: 10)
- Role-based route protection (admin/volunteer)
- HTTP interceptor for automatic token injection
- Input validation on all API endpoints
- CORS configured for frontend origin

---

## 🚀 Deployment

### Backend (Render / Railway / Heroku)
1. Set environment variables in dashboard
2. Set start command: `node server.js`
3. MongoDB: Use MongoDB Atlas free tier

### Frontend (Vercel / Netlify)
1. Update `environment.prod.ts` with production API URL
2. Build: `ng build --configuration=production`
3. Deploy the `dist/nayepankh-frontend/browser` folder

---

## 👥 Demo Credentials

After creating the admin and registering a volunteer:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nayepankh.org | admin123456 |
| Volunteer | (any registered email) | (your password) |

---

## 📞 Support

For issues or questions about NayePankh Foundation portal:
- Email: volunteers@nayepankh.org
- GitHub: github.com/nayepankh

---

**Made with ❤️ for NayePankh Foundation — Giving Wings to Dreams**
