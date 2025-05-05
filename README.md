# 💰 Personal Finance Dashboard

A full-stack web application that empowers users to manage their income, expenses, and savings goals through a visually-rich and intuitive interface. This project features powerful data visualizations, budget tracking, financial forecasting, and smart spending recommendations to help users take control of their personal finances.

---

## 🌐 Live Demo

Check out the live version of the project here:
👉 [Personal Finance Dashboard – Live Demo](https://personal-finance-dashboard-sigma.vercel.app)

---

## 📊 Features

### 🔹 Income & Expense Tracking

- Add and categorize transactions (e.g., groceries, utilities, entertainment, salary).
- Create custom budget categories and monitor your progress against set limits.
- View monthly summaries of income and expenses.

### 🔹 Interactive Visual Dashboards

- Pie and bar charts to show where your money goes.
- Monthly trends in spending and savings.
- A financial health summary to indicate overall budgeting performance.

### 🔹 Financial Forecasting

- Uses historical data to project future income and expenses using linear regression.
- Helps predict overspending risks and suggests adjustments.

### 🔹 Smart Recommendations

- Identifies top spending categories.
- Offers actionable tips on reducing expenses and improving savings.

### 🔹 Data Export

- Export financial data to CSV for offline analysis or record-keeping.

---

## 🛠️ Tech Stack

### Frontend

- **React.js** – Fast, component-based UI.
- **Recharts** – Data visualization.
- **Shadcn UI + Tailwind CSS** – Clean and responsive UI styling.

### Backend

- **Node.js + Express.js** – RESTful API for transaction and user data.
- **MongoDB** – NoSQL database for flexible data storage.
- **Mongoose** – Schema modeling for MongoDB.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or hosted, e.g., MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/8180e/personal-finance-dashboard.git
   cd personal-finance-dashboard
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the `backend` directory:

   ```
   MONGODB_URI=your_mongo_connection_string
   PORT=3000
   TOKEN_SECRET=jwt_token_secret
   FRONTEND_URLS=http://localhost:5173
   ```

   Create another `.env` file in the `frontend` directory:

   ```
   VITE_BACKEND_URL=http://localhost:3000
   ```

5. **Run the app:**

   In two separate terminals:

   - Backend:

     ```bash
     cd backend
     npm run dev
     ```

   - Frontend:

     ```bash
     cd frontend
     npm run dev
     ```

---

## 📁 Folder Structure

```
/frontend             # React frontend
/backend              # Express backend
├── src               # Source code of the backend
   ├── config         # Configuration files
   ├── controllers    # Response handlers
   ├── middlewares    # Middlewares
   ├── models         # Mongoose schemas
   ├── repositories   # Data access layers
   ├── routes         # API endpoints
   ├── services       # Business logic
   ├── types          # Utility types
   ├── utils          # Utility functions
   ├── wrappers       # 3rd party library abstractions
```

---

## 🧠 Inspiration

This project was inspired by the need for a simple yet insightful tool that helps individuals better understand and manage their personal finances, especially in a visually engaging way.

---

## 📜 License

This project is open source under the [MIT License](LICENSE).

---

## 🙌 Contributions

Feel free to fork, open issues, or submit pull requests! Contributions are welcome.
