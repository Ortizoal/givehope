# GiveHope — Donation Management System

A full-stack donation management platform built with **Laravel 11** (API) + **React 18** (frontend) + **MySQL** + **Stripe**.

## Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Laravel 11, PHP 8.2, Sanctum (token auth) |
| Frontend   | React 18, Vite, Tailwind CSS            |
| Database   | MySQL 8                                 |
| Payments   | Stripe Checkout                         |
| Email      | Laravel Mail → Mailhog (dev)            |
| Dev Env    | Docker Compose                          |

---

## Quick Start

### 1. Clone & configure

```bash
cd donation-system

# Backend env
cp backend/.env.example backend/.env
# Edit backend/.env — set STRIPE_SECRET, STRIPE_WEBHOOK_SECRET

# Frontend env
cp frontend/.env.example frontend/.env
# Edit frontend/.env — set VITE_STRIPE_KEY
```

### 2. Start all services

```bash
docker compose up -d
```

This starts:
- **Laravel API** → http://localhost:8000
- **React Dev Server** → http://localhost:5173
- **MySQL** → localhost:3306
- **Mailhog** (email UI) → http://localhost:8025

### 3. Bootstrap Laravel

```bash
# Run inside the PHP container
docker compose exec php sh

# Inside container:
php artisan key:generate
php artisan migrate --seed
exit
```

### 4. Open the app

| URL | Description |
|-----|-------------|
| http://localhost:5173 | React frontend |
| http://localhost:8000/api | Laravel API |
| http://localhost:8025 | Mailhog email viewer |

---

## Seeded Accounts

| Role  | Email                 | Password |
|-------|-----------------------|----------|
| Admin | admin@donation.org    | password |
| User  | user@donation.org     | password |

---

## Features

### User
- Browse active causes with progress bars
- Register / Login
- Donate via **Stripe Checkout** (card payments)
- View personal donation history
- Receive **confirmation email** after successful donation

### Admin (`/admin`)
- Dashboard with live stats (total raised, donors, active causes)
- **Manage Causes** — create, edit, change status (active/paused/completed)
- **View All Donations** — paginated table with donor info
- **Manage Users** — suspend / activate accounts

---

## API Endpoints

### Public
```
POST /api/auth/register
POST /api/auth/login
GET  /api/causes
GET  /api/causes/{slug}
POST /api/stripe/webhook
```

### Authenticated
```
POST /api/auth/logout
GET  /api/user
POST /api/donations/checkout   → returns Stripe checkout URL
GET  /api/donations/history
```

### Admin only
```
GET    /api/admin/dashboard
GET    /api/admin/causes
POST   /api/admin/causes
PUT    /api/admin/causes/{id}
DELETE /api/admin/causes/{id}
GET    /api/admin/donations
GET    /api/admin/users
PATCH  /api/admin/users/{id}/toggle
```

---

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Copy your **Publishable key** → `frontend/.env` → `VITE_STRIPE_KEY`
3. Copy your **Secret key** → `backend/.env` → `STRIPE_SECRET`
4. Set up a webhook endpoint pointing to `http://your-domain/api/stripe/webhook`
   - Event: `checkout.session.completed`
   - Copy the **Webhook Secret** → `backend/.env` → `STRIPE_WEBHOOK_SECRET`

For local testing use [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

---

## Project Structure

```
donation-system/
├── docker-compose.yml
├── nginx/
│   └── default.conf
├── backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Auth/           (Register, Login, Logout)
│   │   │   ├── CauseController.php
│   │   │   ├── DonationController.php
│   │   │   └── AdminController.php
│   │   ├── Models/             (User, Cause, Donation)
│   │   ├── Mail/               (DonationConfirmation)
│   │   └── Http/Middleware/    (AdminMiddleware)
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
└── frontend/                   # React + Vite + Tailwind
    └── src/
        ├── pages/
        │   ├── admin/          (Dashboard, Causes, Donations, Users)
        │   └── ...             (Home, Causes, Donate, History, Auth)
        ├── components/         (Navbar, Footer, CauseCard, ProgressBar)
        ├── contexts/           (AuthContext)
        └── services/           (api.js)
```
