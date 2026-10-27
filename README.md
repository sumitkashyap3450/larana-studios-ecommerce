# 🛍️ LARANA Studios

### Modern Fashion. Effortless Style.

LARANA Studios is a modern fashion e-commerce website designed to provide a clean and engaging online shopping experience. It features a stylish storefront, horizontally sliding clothing products, product search, category filtering, and a shopping cart.

🌐 **Live Demo:** [Visit LARANA Studios](https://larana-studios.onrender.com)

💻 **GitHub Repository:** [View Source Code](https://github.com/sumitkashyap3450/larana-studios-ecommerce)

---

## ✨ Features

* 🛍️ **Fashion Storefront** — A clean, modern shopping interface.
* 👕 **Sliding Product Carousel** — Browse clothing products horizontally.
* 🔍 **Product Search** — Find products easily.
* 🏷️ **Category Filtering** — Explore products by category.
* 🛒 **Shopping Cart** — Add products to your cart.
* 💳 **Checkout Interface** — A checkout experience for the shopping flow.
* 📱 **Responsive Design** — Designed to provide a convenient shopping experience across screen sizes.
* ⚡ **React + Vite** — Fast frontend development and builds.
* 🔗 **REST API** — Express backend for product and order-related operations.

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB

### Deployment

* Render
* GitHub

---

## 📂 Project Structure

```text
larana-studios-ecommerce/
├── client/             # React frontend
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── server/             # Express backend
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/sumitkashyap3450/larana-studios-ecommerce.git
cd larana-studios-ecommerce
```

### 2. Configure the Backend

Open a terminal:

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` as a reference. Add the required environment variables, including your database connection string if MongoDB is enabled.

Start the backend:

```bash
npm start
```

If your `package.json` does not define a `start` script, use the command specified in that file.

### 3. Configure the Frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Create a `.env` file based on `.env.example` and configure the API URL.

For local development:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

---

## ⚙️ Environment Variables

The frontend uses the following variable to locate the backend API:

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

For local development, use `http://localhost:5000`.

For deployment, set `VITE_API_URL` to the public URL of your deployed backend.

The backend may require additional environment variables for database connectivity. Refer to `server/.env.example`.

**Security:** Never commit real `.env` files, passwords, database credentials, or API secrets to GitHub.

---

## ☁️ Deployment

The project is deployed on Render.

* **Frontend:** [LARANA Studios Live Website](https://larana-studios.onrender.com)
* **Backend:** Deployed as a separate service.

The frontend must be configured with the correct backend API URL to communicate with the deployed API.

---

## 🎯 Project Objective

The objective of this project is to build a modern e-commerce storefront while practising full-stack web development, frontend design, API integration, and deployment.

## 👩‍💻 Developer

**LARANA Studios** — A fashion e-commerce project built using modern web technologies.

---

⭐ If you find this project interesting, consider starring the repository!

*This project is intended for learning and demonstration purposes. The checkout interface should not be considered a real payment-processing system unless a payment provider is explicitly integrated.*
