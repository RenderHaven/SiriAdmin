# SiriAdmin

**Admin Dashboard for Siri Photography Studio**

SiriAdmin is a full-stack Content Management System (CMS) built to manage Siri Photography's public-facing portfolio website. Admins can manage portfolio images, photography categories, service packages, and incoming client booking inquiries — all from a clean, modern dashboard.

---

## Project Structure

```
SiriAdmin/
├── backend/          # FastAPI + PostgreSQL REST API
├── frontend/         # React + Tailwind CSS Admin Dashboard
└── docs/             # Project documentation (PRD, API Contract, DB Model)
```

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Language | Python 3.12 |
| Database | PostgreSQL |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Image Storage | Cloudinary |
| Migrations | Alembic |
| Config | pydantic-settings |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| State / Data | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |

---

## Features

### Dashboard
- Overview cards — total images, categories, services, and pending booking inquiries
- Recent booking inquiries feed

### Categories
- Create, edit, and delete photography categories
- Toggle active/inactive status per category
- **Drag & drop** to reorder display sequence

### Portfolio Images
- Upload images directly to Cloudinary via multipart form upload
- Assign images to categories with optional captions
- **Drag & drop** to reorder images within a category (auto-saves instantly)
- Delete images (removes from both Cloudinary and database)

### Services
- Create and manage photography service packages
- Set pricing, description, and list of included items
- Toggle active/inactive per service

### Booking Inquiries
- View all client booking requests in a paginated, filterable table
- Filter by status: `NEW`, `REVIEWED`, `RESPONDED`
- Open detailed view with full client info and event details
- Update status and add internal admin notes

### Authentication
- Secure JWT-based login
- Session persisted in localStorage
- Automatic token injection on all API requests
- Auto-redirect to login on session expiry (401 handling)

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL (running locally or remote)
- Cloudinary account (free tier works)

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SiriAdmin
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
# .env
DATABASE_URL=postgresql+psycopg2://your_user:your_password@localhost:5432/siridb

SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGINS=http://localhost:3000,http://localhost:5173

ADMIN_EMAIL=admin@siri.com
ADMIN_PASSWORD=your_strong_password
ADMIN_NAME=Siri Admin
```

#### Seed the Admin User

```bash
python3 -m app.seed
```

#### Start the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`  
Interactive docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

The frontend is pre-configured to connect to `http://localhost:8000/api/v1`. To change this, update:

```ts
// src/api/client.ts
const API_BASE_URL = 'http://localhost:8000/api/v1'
```

#### Start the Dev Server

```bash
npm run dev
```

Dashboard will be available at: `http://localhost:5173`

#### Build for Production

```bash
npm run build
```

Output is in `frontend/dist/`.

---

## Default Admin Credentials

These are seeded by `python3 -m app.seed`:

| Field | Value |
|---|---|
| Email | `admin@siri.com` |
| Password | `admin123` *(set via `ADMIN_PASSWORD` in `.env`)* |

> ⚠️ Change the default password via the `.env` file before deploying to production.

---

## API Overview

Base URL: `/api/v1`

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Admin login, returns JWT |
| `POST` | `/auth/logout` | Logout (client discards token) |
| `GET` | `/dashboard` | Dashboard summary stats |
| `GET/POST` | `/categories` | List / create categories |
| `PUT/DELETE` | `/categories/{id}` | Update / delete category |
| `GET/POST` | `/portfolio/images` | List / upload images |
| `PUT/DELETE` | `/portfolio/images/{id}` | Update / delete image |
| `PATCH` | `/portfolio/images/reorder` | Reorder images within a category |
| `GET/POST` | `/services` | List / create service packages |
| `PUT/DELETE` | `/services/{id}` | Update / delete service |
| `GET` | `/bookings` | List bookings (filterable) |
| `GET` | `/bookings/{id}` | Get booking detail |
| `PATCH` | `/bookings/{id}/status` | Update booking status + add note |

Full API contract: [`docs/api_contract.md`](docs/api_contract.md)

---

## Database Models

- **Admin** — Dashboard user with hashed password and role
- **Category** — Portfolio groupings (Wedding, Birthday, etc.)
- **PortfolioImage** — Images with Cloudinary URL, caption, and display order
- **Service** — Photography packages with pricing
- **Booking** — Client inquiry records with status tracking

Full DB schema: [`docs/DB_Model.svg`](docs/DB_Model.svg)

---

## Drag & Drop Reordering

SiriAdmin uses [@dnd-kit](https://dndkit.com) for drag-and-drop reordering:

- **Categories** — Grab the `⠿` handle on any category row and drag to change the display order. Changes are synced to the server automatically.
- **Portfolio Images** — Filter by a specific category, then grab the `⠿` handle on any image card. Dropping it in a new position auto-saves instantly via `PATCH /portfolio/images/reorder`.

---

## Project Docs

| File | Description |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document |
| [`docs/api_contract.md`](docs/api_contract.md) | Full REST API Contract |
| [`docs/frontend_doc.md`](docs/frontend_doc.md) | Frontend Architecture Guide |
| [`docs/DB_Model.svg`](docs/DB_Model.svg) | Database Entity Relationship Diagram |

---

## License

This project is private and proprietary to **Siri Photography Studio**.
