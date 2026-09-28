<h1 align="center">
  <img src="Frontend/src/assets/finTrack_Logo.png" alt="FinTrack Logo" width="40" style="vertical-align: middle;" />
  AI Powered Personal Finance Analytics Platform
</h1>

A full-stack web application designed to help users manage their finances through intelligent budgeting, transaction tracking, spending analysis, and financial insights.

The platform enables users to record income and expenses, organize transactions into categories, create monthly and category-based budgets, and monitor financial performance through a centralized analytics dashboard.

Instead of functioning as a simple expense tracker, the application transforms financial data into meaningful insights. Users can visualize spending patterns, compare income and expenses, track budget utilization, identify high-spending categories, and understand their overall financial health.

## Implemented Features

- JWT-based signup, login, protected routes, and automatic logout when a session expires
- Transaction, category, monthly budget, and category-budget management
- Dashboard analytics for income, expenses, savings, trends, comparisons, category distribution, and budget performance
- Financial health scoring and profile management
- AI-generated financial insights through Google Gemini, with a rule-based fallback when Gemini is unavailable
- Redux state management with persisted authentication and application data
- Responsive interface with light and dark themes
- PostgreSQL persistence through Prisma ORM and versioned database migrations
- Dockerized deployment that builds the frontend and serves it from the backend container

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Redux Toolkit, React Router, Tailwind CSS, shadcn/ui, Nivo, and Framer Motion
- **Backend:** Node.js, Express, JavaScript, JWT, bcryptjs, and CORS
- **Database:** PostgreSQL with Prisma ORM
- **AI:** Google Gemini with an internal financial rule engine fallback
- **Deployment:** Docker and Docker Hub

## Environment Variables

Create `Backend/.env` for local development. The backend requires:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
GEMINI_API_KEY="replace-with-your-gemini-api-key"
PORT=5000
```

Do not commit `.env` files. They are excluded from Docker build contexts by `.dockerignore`.

## Run Locally

Install dependencies in both application folders, then start the backend and frontend in separate terminals:

```bash
cd Backend
npm install
npx prisma migrate deploy
npm run dev
```

```bash
cd Frontend
npm install
npm run dev
```

The backend listens on `http://localhost:5000` and the Vite development server provides the frontend. The frontend API client currently targets `http://localhost:5000/api`.

## Run with Docker

Build from the repository root so the Dockerfile can access both `Frontend` and `Backend`:

```bash
docker build -t fintrack .
docker run --env-file Backend/.env -p 5000:5000 fintrack
```

The Dockerfile uses a multi-stage build. The first stage builds the Vite frontend, and the second stage installs the backend, generates Prisma Client, copies the frontend build into `public`, and starts `server.js`. Open `http://localhost:5000` after the container starts.

The container does not include PostgreSQL or run migrations automatically. `DATABASE_URL` must point to a PostgreSQL instance reachable from the container, and migrations should be applied with Prisma before using the application.

The published image is available on Docker Hub:

```bash
docker pull suhail2005/fintrack:latest
docker run --env-file Backend/.env -p 5000:5000 suhail2005/fintrack:latest
```

## Workflow

The application follows a structured financial management process:

### 1. User Authentication
Users create an account and securely log in to access their personal financial workspace.

### 2. Category Management
Users create custom categories such as Food, Travel, Shopping, Bills, Entertainment, Salary, Investments, and others to organize financial activities.

### 3. Budget Planning
Users define:
- **Monthly Budgets** - Overall spending limits for each month
- **Category-Based Budgets** - Specific limits per spending category

These budgets act as spending limits and financial goals.

### 4. Transaction Tracking
Users record:
- **Income Transactions** - Salary, freelance, investments, etc.
- **Expense Transactions** - Bills, shopping, food, etc.

Each transaction is linked to a category, amount, date, and description.

### 5. Financial Analysis
The system processes transaction data and calculates:
- **Total Income**
- **Total Expenses** 
- **Net Savings**
- **Budget Utilization**
- **Category Spending Distribution**
- **Monthly Spending Trends**

### 6. Dashboard Insights
The dashboard presents financial analytics through charts, summaries, and performance indicators, helping users make informed financial decisions.

### 7. AI-Powered Recommendations
The platform generates personalized financial insights by analyzing spending behavior, budget adherence, and savings patterns.

## Core Objective

The primary goal of this project is to provide users with a complete financial management ecosystem where budgeting, expense tracking, analytics, and intelligent insights work together to improve financial awareness and decision-making

## 🏗️ System Architecture

![Application Architecture](Frontend/src/assets/architecture-diagram.png)

## 🗄️ Database Architecture & Schema

This application utilizes **PostgreSQL** as its primary relational database management system, with **Prisma ORM** handling data migrations and structural state mapping.

### 📐 Entity Relationship Diagram (ERD)

The diagram below outlines the core entities, data field typings, internal relations, and foreign key bindings tracked within the application schema.

<p align="center">
  <img src="Frontend/src/assets/database-ERD.png" alt="Database Entity Relationship Diagram" width="900">
</p>

---

### 📊 Data Dictionary & Table Index

#### 1. Core User & Meta Tables
*   **`User`**: Manages unique application accounts, metadata, and core auth signatures.
*   **`_prisma_migrations`**: Internal system tracking ledger managed automatically by the Prisma migration engine.

#### 2. Financial Ledger & Structuring
*   **`Transaction`**: High-throughput transaction ledger capturing granular financial inflows and outflows.
*   **`Category`**: Configurable, user-specific classification tags applied to isolate transactions.
*   **`Budget`**: Aggregated overarching balance limitations defined on a per-month scheduling sequence.
*   **`categoryBudget`**: Fine-grained mapping junction to assign dedicated sub-budgets to unique structural categories.
*   **`AIInsight`**: Historical intelligence analytics logs generated dynamically via the Google Gemini LLM API engine.

---

### 📝 Detailed Schema Mapping


| Table Name | Attribute / Column | Data Type | Modifiers / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| **User** | `id` <br> `name` <br> `email` <br> `password` <br> `createdAt` <br> `updatedAt` | text <br> text <br> text <br> text <br> timestamp(3) <br> timestamp(3) | **Primary Key** <br> - <br> Unique <br> - <br> Default: `now()` <br> Auto-update | Unique system identifier. <br> Full display name. <br> Registration email. <br> Hashed credential. <br> Creation metadata. <br> Modification track. |
| **Transaction** | `id` <br> `title` <br> `amount` <br> `type` <br> `description` <br> `date` <br> `createdAt` <br> `userId` <br> `categoryId` | text <br> text <br> numeric(10,2) <br> "TransactionType" <br> text <br> timestamp <br> timestamp(3) <br> text <br> text | **Primary Key** <br> - <br> - <br> Custom Enum <br> Optional <br> - <br> Default: `now()` <br> **Foreign Key** <br> **Foreign Key** | Unique system identifier. <br> Transaction description. <br> Value up to 2 decimals. <br> INCOME / EXPENSE type. <br> Contextual user notes. <br> Actual transaction date. <br> Records sync tracking. <br> Links to `User.id`. <br> Links to `Category.id`. |
| **Category** | `id` <br> `name` <br> `icon` <br> `userId` | text <br> text <br> text <br> text | **Primary Key** <br> - <br> Optional <br> **Foreign Key** | Unique system identifier. <br> Visual display label. <br> Graphical layout reference. <br> Links custom categories. |
| **Budget** | `id` <br> `amount` <br> `month` <br> `userId` <br> `createdAt` | text <br> numeric(10,2) <br> text <br> text <br> timestamp(3) | **Primary Key** <br> - <br> - <br> **Foreign Key** <br> Default: `now()` | Unique system identifier. <br> Spending limit constraint. <br> Tracking period (MM-YYYY). <br> Links to target `User.id`. <br> Records sync tracking. |
| **categoryBudget** | `id` <br> `amount` <br> `userId` <br> `categoryId` <br> `createdAt` <br> `month` | text <br> numeric(10,2) <br> text <br> text <br> timestamp(3) <br> text | **Primary Key** <br> - <br> **Foreign Key** <br> **Foreign Key** <br> Default: `now()` <br> - | Unique system identifier. <br> Target balance cap. <br> Links to `User.id`. <br> Links to `Category.id`. <br> Records sync tracking. <br> Tracking target string. |
| **AIInsight** | `id` <br> `content` <br> `createdAt` <br> `userId` | text <br> text <br> timestamp(3) <br> text | **Primary Key** <br> - <br> Default: `now()` <br> **Foreign Key** | Unique system identifier. <br> LLM generation payload. <br> Insight generation history. <br> Links to target `User.id`. |
