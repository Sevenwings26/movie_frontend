# 🎬 Movie Rating Platform (React + Vite)

A single-page application (SPA) built with **React + Vite + TypeScript** that allows users to discover, rate, and review movies.
The app integrates with a Django REST backend for authentication, movie management, and ratings.

---

## 🚀 Features

* 🔐 **JWT Authentication** (Login, Registration, Protected Routes)
* 🎥 **Movie Listings** with filters:

  * Filter by genre
  * Search by title
  * Filter by release year
* ⭐ **Movie Ratings**:

  * View average ratings & review counts
  * Submit, update, or delete your rating (1–5 stars + review text)
  * See all ratings from other users
* 📄 **Movie Details Page** with full description and reviews
* 📱 Responsive layout using **Tailwind CSS**

---

## 🛠 Tech Stack

* **Frontend**: React + Vite + TypeScript
* **UI Framework**: Tailwind CSS
* **Auth & State**: React Context API
* **Routing**: React Router v6
* **API Requests**: Axios
* **Icons/UI Helpers**: Lucide React, Material Tailwind

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sevenwings26/movie_frontend.git
cd movie-rating-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

> ⚠️ All env variables must be prefixed with `VITE_` for Vite to expose them.

### 4️⃣ Run development server

```bash
npm run dev
```

The app will be available at:
👉 `http://localhost:5173/`

---

## 🔑 Authentication

This project uses **JWT (access & refresh tokens)** stored in **localStorage**.

* On login/register → tokens are stored locally
* Auth context decodes token with `jwt-decode` and provides user info
* Protected routes (like movie details with rating form) require login

---

## 📡 API Endpoints (Backend Integration)

Sample endpoints expected from backend (Django REST):

* `POST /auth/register/` → User registration
* `POST /auth/login/` → Login & receive JWT
* `GET /movies/` → List movies with filters
* `GET /movies/:id/` → Get movie details
* `GET /movies/:id/ratings/` → Fetch all ratings for a movie
* `POST /movies/:id/ratings/` → Submit/update rating for movie
* `GET /user/ratings/` → Get ratings submitted by logged-in user
* `DELETE /ratings/:id/` → Delete rating

---

## 🧪 Running Tests (if configured)

```bash
npm run test
```

---

## 📦 Build for Production

```bash
npm run build
```

Then preview production build:

```bash
npm run preview
```

---

## 👨‍💻 Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

