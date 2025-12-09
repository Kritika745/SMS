# 📊 Sales Dashboard Application 📈

This project is a full-stack web application designed to visualize and analyze sales data. It provides a user-friendly dashboard with interactive filtering, searching, sorting, and pagination capabilities. The application fetches data from a backend API, displays key sales statistics, and presents the data in a tabular format. It solves the problem of efficiently exploring and understanding large sales datasets.

## 🚀 Key Features

- **Interactive Dashboard:** A dynamic dashboard providing a comprehensive overview of sales data.
- **Filtering:** Allows users to filter sales data based on various criteria such as customer region, gender, product category, and more. 🔍
- **Searching:** Enables users to quickly find specific sales records using a search bar. ⌨️
- **Sorting:** Supports sorting sales data by different columns (e.g., date, quantity, amount). ↕️
- **Pagination:** Handles large datasets by providing pagination for easy navigation. 🔢
- **Sales Statistics:** Displays key sales statistics such as total units sold, total amount, and total discount. 📊
- **Data Visualization:** Presents sales data in a clear and organized tabular format. 🧾
- **Backend API:** Provides a RESTful API for fetching sales data and filter options. 🌐
- **Data Import:** Includes a script for importing sales data from CSV files into the MongoDB database. 📤

## 🛠️ Tech Stack

*   **Frontend:**
    *   **React:** A JavaScript library for building user interfaces.
    *   **Next.js:** A React framework for building server-rendered and statically generated web applications.
    *   **next/navigation:** Used for routing and navigation within the Next.js application.
    *   **next/font/google:** Used for importing and using Google Fonts.
*   **Backend:**
    *   **Node.js:** A JavaScript runtime environment for building server-side applications.
    *   **Express:** A web application framework for Node.js.
    *   **Mongoose:** An object modeling tool for MongoDB.
    *   **MongoDB:** A NoSQL database for storing sales data.
    *   **dotenv:** Loads environment variables from a `.env` file.
    *   **cors:** Middleware for enabling Cross-Origin Resource Sharing (CORS).
*   **Utilities:**
    *   **csvtojson:** A library for converting CSV data to JSON.
    *   **mongodb:** The official MongoDB driver for Node.js.

## 📦 Getting Started

### Prerequisites

*   Node.js (version >= 18)
*   npm or yarn
*   MongoDB installed and running
*   A `.env` file in both the `frontend` and `backend` directories with the necessary environment variables (see `.env.example` if provided).  Specifically, the backend requires `MONGODB_URI` and the frontend requires `NEXT_PUBLIC_API_URL`.

### Installation

**Backend:**

```bash
cd Backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### Running Locally

**Backend:**

```bash
cd Backend
npm run dev
```

This will start the backend server, typically on port 5000.

**Frontend:**

```bash
cd frontend
npm run dev
```

This will start the Next.js development server, typically on port 3000.  Open your browser and navigate to `http://localhost:3000` to view the application.

## 📂 Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── models/
│   │   │   └── Sale.js
│   │   ├── routes/
│   │   │   └── sales.js
│   │   ├── utils/
│   │   │   ├── errorHandler.js
│   │   │   ├── queryBuilder.js
│   │   │   └── validators.js
│   │   ├── index.js
│   ├── scripts/
│   │   └── importCsvSafe.js
│   ├── package.json
│   └── .env (example: MONGODB_URI=mongodb://localhost:27017/sales)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js
│   │   │   └── layout.js
│   │   ├── components/
│   │   │   ├── FilterDropdown.js
│   │   │   ├── Pagination.js
│   │   │   ├── SalesTable.js
│   │   │   ├── SearchBar.js
│   │   │   └── StatCard.js
│   │   ├── hooks/
│   │   │   ├── useSalesData.js
│   │   │   └── useFilterOptions.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── app.css
│   ├── next.config.mjs
│   ├── package.json
│   └── .env (example: NEXT_PUBLIC_API_URL=http://localhost:5000/api)
├── README.md
```

## 📸 Screenshots

(Add screenshots of the application here to showcase its features and UI.)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [your-email@example.com](mailto:your-email@example.com).

## 💖 Thanks Message

Thank you for checking out this project! I hope it's helpful for visualizing and analyzing sales data. Your feedback and contributions are highly appreciated.
