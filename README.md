# URL Shortener

A full-stack URL Shortener web application built using React, Node.js, Express, and MongoDB.

Users can generate short URLs and redirect to original websites instantly.

---

# Features

- Generate short URLs
- Redirect to original URLs
- MongoDB database integration
- REST API backend
- React frontend
- Production-ready structure
- Environment variable support
- Responsive UI

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- NanoID

---

# Project Structure

```bash
URL-SHORTNER/
│
├── controllers/
├── models/
├── routes/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── .env
├── .gitignore
├── connect.js
├── index.js
├── package.json
└── README.md
```

---

# Environment Variables

## Backend `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_url
```

---

## Frontend `.env`

```env
VITE_API_URL=http://127.0.0.1:3000
```

---

# Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

---

# Backend Setup

```bash
npm install
npm start
```

Backend runs on:

```bash
http://localhost:3000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoint

## Generate Short URL

```http
POST /url
```

### Request Body

```json
{
  "url": "https://google.com"
}
```

---

# Deployment

## Frontend
- Vercel

## Backend
- Render

## Database
- MongoDB Atlas

---

# Author

Avinash Kumar

---

# License

This project is open source and available under the MIT License.
