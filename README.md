# Argent Bank - Front-End

![Argent Bank Logo](public/argentBankLogo.png)

React web application for Argent Bank's user authentication system - OpenClassrooms Project 13.

---

## 📋 Project Overview

Argent Bank is a new banking startup that needs help setting up its web application. This project is divided into two phases:

- **Phase 1** - User authentication: login, logout, profile management
- **Phase 2** - Transactions API documentation (Swagger YAML)

This repository contains the **front-end** application (Phase 1).

The back-end repository is available here: [Project-10-Bank-API](https://github.com/TiagoLima-7/Project-10-Bank-API)

---

## 🚀 Tech Stack

| Technology                                     | Version | Usage               |
| ---------------------------------------------- | ------- | ------------------- |
| [React](https://react.dev/)                    | 18+     | UI library          |
| [Vite](https://vitejs.dev/)                    | 5+      | Build tool          |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2+      | State management    |
| [React Router DOM](https://reactrouter.com/)   | 6+      | Client-side routing |
| [Axios](https://axios-http.com/)               | 1+      | HTTP requests       |
| [Playwright](https://playwright.dev/)          | 1+      | E2E testing         |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com/)
- The back-end server must be running on `http://localhost:3001`

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/TiagoLima-7/OCR-ArgentBank.git
cd OCR-ArgentBank
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the project :

```properties
VITE_API_URL=http://localhost:3001/api/v1
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔗 Back-End Setup

This app requires the back-end API to be running. Follow these steps :

### 1. Clone the back-end repository

```bash
git clone https://github.com/TiagoLima-7/Project-10-Bank-API.git
cd Project-10-Bank-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the back-end project :

```properties
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/argentBankDB?appName=Cluster0
```

### 4. Start the server

```bash
npm run dev:server
```

### 5. Populate the database (first time only)

```bash
npm run populate-db
```

The API will be available at `http://localhost:3001`

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation bar (dynamic based on auth state)
│   ├── Footer.jsx          # Footer
│   ├── AccountCard.jsx     # Reusable bank account card component
│   └── PrivateRoute.jsx    # Route protection component
├── layouts/
│   └── MainLayout.jsx      # Shared layout (Header + Outlet + Footer)
├── pages/
│   ├── Home.jsx            # Home page
│   ├── SignIn.jsx          # Login page
│   ├── Profile.jsx         # User profile page (protected)
│   └── NotFound.jsx        # 404 page
├── redux/
│   ├── store.js            # Redux store configuration
│   └── slices/
│       └── authSlice.js    # Authentication state + thunks
├── services/
│   └── apiService.js       # Axios API calls
├── App.jsx                 # Router + routes definition
├── main.jsx                # App entry point + Redux Provider
└── index.css               # Global styles
```

---

## 🔐 Authentication Flow

```
1. User fills in the SignIn form (email + password)
2. loginThunk dispatched → POST /api/v1/user/login
3. Token received → saved in Redux store (in-memory only)
4. fetchUserProfile dispatched → GET /api/v1/user/profile
5. User data saved in Redux
6. Redirect to /profile
```

The token is stored **only in the Redux store** (JavaScript memory). This means:

- ✅ Token is not accessible via browser DevTools storage tabs
- ✅ Automatic logout when the browser tab or window is closed
- ✅ Automatic logout on page refresh (F5)
- ⚠️ User must log in again after every page refresh

This is a deliberate security choice. The next improvement would be **httpOnly cookies** server-side, which would combine security with persistence.

---

## 📄 Available Pages

| Route      | Description   | Access                                              |
| ---------- | ------------- | --------------------------------------------------- |
| `/`        | Home page     | Public                                              |
| `/sign-in` | Login page    | Public (redirects to /profile if already logged in) |
| `/profile` | User profile  | Private (redirects to /sign-in if not logged in)    |
| `/*`       | 404 Not Found | Public                                              |

---

## ✅ Phase 1 Features

- [x] Responsive web app built with React + Vite
- [x] Redux Toolkit state management for the entire app
- [x] User can visit the home page
- [x] User can log in to the system
- [x] User can log out of the system
- [x] User can only view profile after successful login (PrivateRoute)
- [x] User can edit their first and last name
- [x] Token stored in Redux store only (in-memory, no localStorage/sessionStorage)
- [x] Auto logout on browser tab/window close or page refresh
- [x] Redirect to /profile if already logged in
- [x] 404 page for unknown routes
- [x] Environment variables for API URL
- [x] Reusable AccountCard component
- [x] 20 E2E tests with Playwright (100% passing)

---

## 📑 Phase 2 - Transactions API Documentation

The Swagger YAML file documenting the proposed transaction endpoints is available in the back-end repository : `transactions-api.yaml`

You can visualize it at [editor.swagger.io](https://editor.swagger.io)

### Proposed Endpoints

| Method  | Route                                                     | Description                                   | Auth required |
| ------- | --------------------------------------------------------- | --------------------------------------------- | ------------- |
| `GET`   | `/user/accounts`                                          | Get all user accounts                         | ✅            |
| `GET`   | `/user/accounts/{accountId}/transactions`                 | Get transactions with flexible date filtering | ✅            |
| `GET`   | `/user/accounts/{accountId}/transactions/{transactionId}` | Get transaction details                       | ✅            |
| `PATCH` | `/user/accounts/{accountId}/transactions/{transactionId}` | Update category and/or notes                  | ✅            |

### Transaction Date Filtering

The `GET /transactions` endpoint supports two mutually exclusive filtering modes:

**Mode 1 - Rolling window (default):**

```
GET /user/accounts/{accountId}/transactions?days=30
```

Returns transactions from the last N days. Defaults to 30 days if no parameter is provided.

**Mode 2 - Date range:**

```
GET /user/accounts/{accountId}/transactions?startDate=2026-01-01&endDate=2026-02-05
```

Returns transactions between two specific dates (format: `YYYY-MM-DD`). Both parameters must be provided together. If `startDate`/`endDate` are provided alongside `days`, the date range takes priority.

### Category Enum

Transaction categories are fixed and must be selected from the following list:

`Food` · `Shopping` · `Travel` · `Healthcare` · `Entertainment` · `Education` · `Bills` · `Other`

---

## 🧪 Testing

### Run E2E tests

Make sure the back-end server is running first, then:

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run tests on Chromium only
npx playwright test --project=chromium

# Show HTML report
npx playwright show-report
```

### Test coverage

| Category         | Tests                                     |
| ---------------- | ----------------------------------------- |
| Home page        | Title, hero, 3 features                   |
| Navigation       | Sign In link visible and functional       |
| 404 page         | Unknown URL → 404 page with back link     |
| Authentication   | Valid login, invalid login, error message |
| Protected routes | /profile without login → /sign-in         |
| Profile          | User name, 3 account cards, header        |
| Edit Name        | Form visible, cancel closes form          |
| Logout           | Redirect to home, Sign In visible         |
| Redirect         | /sign-in while logged in → /profile       |

---

## 👤 Test Accounts

| Name         | Email            | Password    |
| ------------ | ---------------- | ----------- |
| Tony Stark   | tony@stark.com   | password123 |
| Steve Rogers | steve@rogers.com | password456 |

---

## 🧪 Available Scripts

| Command               | Description              |
| --------------------- | ------------------------ |
| `npm run dev`         | Start development server |
| `npm run build`       | Build for production     |
| `npm run preview`     | Preview production build |
| `npm run lint`        | Run ESLint               |
| `npx playwright test` | Run E2E tests            |

---

## 👨‍💻 Author

**Tiago Lima**
OpenClassrooms - Développeur d'application JavaScript React
Project 13 - Use an API for a user bank account with React
