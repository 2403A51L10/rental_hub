# RentEase - Rental Marketplace Platform

RentEase is a full-stack rental marketplace built with React, Express, MongoDB, and Docker Compose. It supports `owner`, `renter`, and `admin` roles with separate dashboards and role-based APIs.

## Stack

- Frontend: React + Vite + CSS
- Backend: Node.js + Express + JWT + Multer
- Database: MongoDB + Mongoose
- DevOps: Docker, Docker Compose, GitHub Actions

## Features

- Secure signup/login with hashed passwords and JWT auth
- Owner listing management, booking approvals, reviews, and revenue tracking
- Renter browsing, search/filter, booking requests, booking history, and reviews
- Admin analytics plus listing moderation
- Booking conflict prevention for overlapping dates
- Dockerized frontend, backend, and MongoDB

## Data Model

- `User`: `name`, `email`, `password`, `role`, `phone`, `bio`, `location`, `avatar`
- `Item`: `owner`, `title`, `description`, `category`, `pricePerDay`, `availabilityStart`, `availabilityEnd`, `imageUrl`, `status`
- `Booking`: `item`, `owner`, `renter`, `startDate`, `endDate`, `totalPrice`, `status`
- `Review`: `booking`, `item`, `owner`, `renter`, `rating`, `comment`

## Local Run

1. Copy `backend/.env.example` to `backend/.env` if needed.
2. Start Docker Desktop so the Docker daemon is available.
3. Run `docker compose up --build`.
4. Open `http://localhost:3000`.

## Useful Commands

- Backend dev: `cd backend && npm run dev`
- Seed admin: `cd backend && npm run seed`
- Frontend dev: `cd frontend && npm run dev`
- Frontend build: `cd frontend && npm run build`

## Default Admin

- Email: `admin@rentease.com`
- Password: `Admin123!`
