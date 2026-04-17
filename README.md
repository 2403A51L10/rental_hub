# RentEase - Rental Marketplace Platform

RentEase is a full-stack rental marketplace where owners can list items for rent, renters can browse and book items, and admins can moderate listings and monitor activity. The app is built with modern web technologies and supports role-based access for owners, renters, and admins.

GitHub: https://github.com/2403A51L10/rental_hub

## Project Description

RentEase makes it easy to publish rental listings, manage bookings, and review completed rentals. The backend provides secure authentication, booking logic, and admin moderation, while the frontend delivers a responsive React experience with dashboards for each user role.

## Tech Stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express, JWT, Multer
- Database: MongoDB, Mongoose
- Deployment / DevOps: Render, Docker Compose, GitHub Actions

## Features

- Secure signup and login using hashed passwords and JWT
- Owner dashboard for listing creation, updates, and booking approvals
- Renter dashboard for searching listings, booking items, and leaving reviews
- Admin dashboard for analytics, user management, and listing moderation
- Booking conflict checks to prevent overlapping reservations
- Image uploads for listings with local storage support
- Role-based API authorization for secure access control

## Project File Structure

```
Rental Hub/
├── backend/
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── uploads/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── styles/
├── docker-compose.yml
├── render.yaml
└── README.md
