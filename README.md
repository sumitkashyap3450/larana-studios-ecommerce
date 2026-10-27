# LARANA Studios — E-commerce Website

A minimal fashion storefront inspired by the reference video, built with React + Vite, Node.js, Express, and MongoDB.

## Features
- Minimal boutique layout with centered LARANA Studios branding
- Dark navigation bar: Home, Collections, About, Blog, Contact
- Fashion collection with clothing product cards
- Category filters and product search
- Product detail modal
- Shopping bag with quantity controls
- Demo checkout form that saves orders through the Express API
- Responsive layout
- Ready for GitHub and deployment

> Portfolio/demo project only. It does not process real card payments. Product images load from Unsplash, so internet access is needed for those images.

## Project structure
```text
larana-studios-ecommerce/
├── client/   # React + Vite frontend
└── server/   # Express API + MongoDB orders
```

## Run locally

### 1. Backend
```bash
cd server
npm install
```
Copy `server/.env.example` to `server/.env` and add your MongoDB Atlas connection string as `MONGODB_URI`. Product browsing works without MongoDB, but order saving needs a database.

```bash
npm run dev
```
API: `http://localhost:5000`

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```
Then:
```bash
npm run dev
```
Open the Vite URL, usually `http://localhost:5173`.

## Push to GitHub
From the project root:
```bash
git init
git add .
git commit -m "Build LARANA Studios ecommerce website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Create an empty repository first and replace the remote URL with your own. Do not upload `.env` files or secrets.

## Deploy backend to Render
- Create a Web Service connected to your GitHub repository.
- Root Directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGODB_URI` = your MongoDB Atlas connection string
  - `CLIENT_URL` = your deployed frontend URL
  - `NODE_ENV` = `production`

## Deploy frontend to Netlify
- Import the GitHub repository.
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` = your Render backend URL, without a trailing slash.
- After deploying the frontend, update `CLIENT_URL` in Render to the exact Netlify URL and redeploy the backend.

## Notes
- Checkout is a demo order flow, not a real payment gateway.
- Product images are external image URLs and may be changed to your own product photography.
