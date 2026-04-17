# RentEase - Rental Marketplace Platform

RentEase is a full-stack rental marketplace built with React, Express, and MongoDB. It supports `owner`, `renter`, and `admin` roles with separate dashboards and role-based APIs.

## Stack

- Frontend: React + Vite + CSS
- Backend: Node.js + Express + JWT + Multer
- Database: MongoDB + Mongoose
- DevOps: GitHub Actions

## Features

- Secure signup/login with hashed passwords and JWT auth
- Owner listing management, booking approvals, reviews, and revenue tracking
- Renter browsing, search/filter, booking requests, booking history, and reviews
- Admin analytics plus listing moderation
- Booking conflict prevention for overlapping dates
- Role-based dashboards for admins, owners, and renters

## Data Model

- `User`: `name`, `email`, `password`, `role`, `phone`, `bio`, `location`, `avatar`
- `Item`: `owner`, `title`, `description`, `category`, `pricePerHour`, `availabilityStart`, `availabilityEnd`, `imageUrl`, `status`
- `Booking`: `item`, `owner`, `renter`, `startDate`, `endDate`, `totalPrice`, `status`
- `Review`: `booking`, `item`, `owner`, `renter`, `rating`, `comment`

## Local Run

1. Install Node.js 20+.
2. Copy `backend/.env.example` to `backend/.env`.
3. In `backend/.env`, set `MONGO_URI` to your MongoDB Atlas connection string.
4. In MongoDB Atlas, make sure your database user password is correct and your current IP is allowed in `Network Access`.
5. Run the backend:
   `cd backend`
   `npm install`
   `npm run dev`
6. In a second terminal, run the frontend:
   `cd frontend`
   `npm install`
   `npm run dev`
7. Open `http://127.0.0.1:5173`.

## MongoDB Atlas Setup

1. Create a free cluster in MongoDB Atlas.
2. Create a database user with a username and password.
3. In `Network Access`, allow your current IP address.
4. In Atlas, click `Connect` -> `Drivers` and copy the Node.js connection string.
5. Replace the placeholders in `backend/.env`:
   `MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/rentease?retryWrites=true&w=majority&appName=Cluster0`
6. If your password contains special characters like `@`, `#`, or `/`, URL-encode them in the connection string.
7. Start the backend with `npm run dev`.

Once Atlas is connected, your logins and items will be stored in Atlas instead of depending on your local MongoDB data.

## Useful Commands

- Backend dev: `cd backend && npm run dev`
- Seed admin: `cd backend && npm run seed`
- Frontend dev: `cd frontend && npm run dev`
- Frontend build: `cd frontend && npm run build`

## Deploy To Render

This repo includes a root `render.yaml` Blueprint for deploying:

- `rentease-backend` as a Render web service
- `rentease-frontend` as a Render static site

### 1. Push the repo to GitHub

Render deploys from your Git repository, so make sure this project is pushed first.

### 2. Create a MongoDB database

Use MongoDB Atlas or another hosted MongoDB provider and copy the connection string.

### 3. Create the Blueprint in Render

1. In Render, click `New` -> `Blueprint`.
2. Connect your GitHub repository.
3. Render will detect `render.yaml` and propose both services.

### 4. Fill in the required environment variables

For `rentease-backend`:

- `MONGO_URI`: your hosted MongoDB connection string
- `JWT_SECRET`: any long random secret
- `ADMIN_PASSWORD`: password for the default admin account
- Optional: `ENABLE_LISTING_MODERATION=true`

For `rentease-frontend`:

- `VITE_API_URL`: your backend URL plus `/api`
- Example: `https://rentease-backend.onrender.com/api`

### 5. Deploy

Deploy the backend first, copy its public URL, then set `VITE_API_URL` for the frontend and deploy the static site.

### 6. Seed the admin user

After the backend is live, open the Render shell for the backend service and run:

`npm run seed`

If `ADMIN_EMAIL` is not set, the default admin login is:

- Email: `admin@rentease.com`
- Password: the value you set for `ADMIN_PASSWORD`

### Important note about uploads

The backend stores uploaded images in a local `uploads/` folder. On Render, that storage is ephemeral by default, so uploaded files can disappear after a restart or redeploy. For production, use one of these:

- A persistent disk on the backend service
- Cloud object storage such as Cloudinary, S3, or Uploadcare

## Default Admin

- Email: `admin@rentease.com`
- Password: `Admin123!`
