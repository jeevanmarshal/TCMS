# Tuition Centre / Student Management System (TCMS)

Welcome to the **Tuition Centre / Student Management System (TCMS)**! This is a professional full-stack web application built as a step-by-step practice project for full-stack web development.

This project is organized as a **monorepo**, containing both the React frontend and the FastAPI backend in a clean, unified repository.

---

## 🚀 Tech Stack

### Frontend
*   **Core**: React (HTML5, CSS3, JavaScript)
*   **Routing**: React Router DOM (v7)
*   **Styling**: Modern, premium Vanilla CSS with responsive design layouts

### Backend
*   **Framework**: FastAPI (Python) - High performance, easy data validation, automated interactive documentation
*   **Database**: MySQL
*   **ORM**: SQLAlchemy - Object-Relational Mapper for structured, secure SQL interactions
*   **Data Validation**: Pydantic Schemas - Validates request and response formats
*   **Security**: JWT (JSON Web Tokens) stateless authentication & `bcrypt` password hashing

---

## 📁 Repository Structure

```text
Tuition Center Management/ (Root Directory)
├── .gitignore                # Root Git ignore rules (protects credentials)
├── README.md                 # Project documentation and guide
├── backend/                  # Python FastAPI API service
│   ├── app/                  # Application packages
│   │   ├── api/              # Routers (controllers) & token dependencies
│   │   ├── core/             # Configuration, Database engine, and security tools
│   │   ├── crud/             # Database services (CRUD SQL queries)
│   │   ├── models/           # SQLAlchemy database tables (MySQL mapping)
│   │   └── schemas/          # Pydantic schemas (Data serialization & validation)
│   ├── .env                  # Environment configurations (confidential database password)
│   ├── run.py                # Server launcher script
│   └── requirements.txt      # Python backend packages
└── frontend/                 # React frontend client
    ├── public/               # Public assets & index.html
    └── src/                  # React views, routes, components, and layouts
```

---

## 🛠️ Installation & Setup Guide

Ensure you have **Python 3.10+**, **Node.js (npm)**, and **MySQL** running locally before proceeding.

### 1. Database Configuration
1. Open your MySQL client and ensure a local instance is running.
2. In [backend/.env](file:///d:/Projects/Tuition%20Center%20Management/backend/.env), configure your credentials:
    ```env
    DATABASE_URL="mysql+pymysql://<user>:<password>@localhost:3306/tcms_db"
    ```
    *Replace `<user>` and `<password>` with your actual local MySQL settings.*

### 2. Backend Setup
1. Open a terminal in the `backend/` directory:
    ```bash
    cd backend
    ```
2. Initialize a Python virtual environment:
    ```bash
    python -m venv venv
    ```
3. Activate the virtual environment:
    *   **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
    *   **Mac/Linux**: `source venv/bin/activate`
4. Install all python library dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5. Launch the backend development server:
    ```bash
    python run.py
    ```
    *The server will boot automatically on `http://127.0.0.1:8000`.*
    *On startup, the backend automatically connects to MySQL, generates your tables, and seeds a default administrator account.*

### 3. Frontend Setup
1. Open a new terminal in the `frontend/` directory:
    ```bash
    cd frontend
    ```
2. Install all frontend node modules:
    ```bash
    npm install
    ```
3. Launch the local React dev server:
    ```bash
    npm start
    ```
    *Your browser will automatically launch to `http://localhost:3000`.*

---

## 🔑 Default Credentials

The backend auto-seeds a default administrator account on startup so the system is immediately testable:

*   **Administrator Email**: `admin@tcms.com`
*   **Password**: `admin123`

---

## 📊 Visual Interactive Documentation

FastAPI compiles fully interactive API documentation out-of-the-box!
*   With the backend running, visit **`http://localhost:8000/docs`** to view the Swagger UI.
*   Here, you can inspect, test, and execute all authentication and student CRUD endpoints live.

---

## 📝 Features & Best Practices

1.  **Security-First**: Passwords are securely hashed inside the database using industry-standard `bcrypt`.
2.  **Stateless Session Control**: Utilizes secure **JWT (JSON Web Tokens)** stored in the client browser's `localStorage` to authorize protected HTTP requests.
3.  **Route Protection**: Guests are blocked from access. If they try to navigate directly to `/dashboard` or `/students`, the React app redirects them to `/` (Login).
4.  **Complete Student CRUD**: Enables registration, search filtering in real-time, editing current profiles, and deleting records in a sleek side-by-side dashboard UI.
5.  **CORS Security Configuration**: Enabled in the API middleware to handle requests sent from the React origin.
