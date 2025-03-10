# ✈️ Google Flights Replica

## 🌍 Overview
A **Google Flights Replica** built with **React 18, Vite, and TypeScript**, leveraging the **Air Scraper API from RapidAPI** to fetch real-time flight data. Users can search for flights based on **origin, destination, and date**, view flight details, and access booking links with prices from multiple travel sites.

---

## 🚀 Features
- **🔍 Flight Search**: Search flights by **origin, destination, and date**.
- **📋 Flight Details**: View detailed information about flights.
- **💰 Price Comparison**: Get links to booking sites with prices from various providers.
- **⚡ Optimized Performance**: Built with **Vite** for fast loading.
- **💅 Responsive UI**: Styled with **TailwindCSS** for a seamless experience.
- **🌍 Global State Management**: Managed with **Zustand** for smooth interactions.

---

## 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Calls**: Axios
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Data Source**: Air Scraper API (RapidAPI)

---

## 📂 Project Structure
```
📁 google-flights-replica/
 ├── 📁 src/
 │   ├── 📁 layout/          # Page layout
 │   ├── 📁 components/      # Reusable UI components
 │   ├── 📁 pages/           # Application pages (Home, Search Results, Flight Details)
 │   ├── 📁 store/           # Zustand state management
 │   ├── 📁 utils/           # Helper functions (API calls, formatters)
 │   ├── 📄 App.tsx          # Main app component
 │   ├── 📄 main.tsx         # React entry point
 ├── 📄 index.html           # Main HTML file
 ├── 📄 package.json         # Project dependencies
 ├── 📄 tailwind.config.js   # TailwindCSS configuration
 ├── 📄 tsconfig.json        # TypeScript configuration
 ├── 📄 vite.config.ts       # Vite configuration
```

---

## 📦 Installation Guide

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/MFayizE/google-flights-replica.git
cd google-flights-replica
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory:
```
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

### 4️⃣ Start the Development Server
```sh
npm run dev
```
API will be available at: `http://localhost:5173`

---

## 🚀 Deployment Instructions

### **1️⃣ Build for Production**
```sh
npm run build
```

### 🚀 Happy Coding! 🎉

