# SkinSense: Full-Stack AI Skincare Assistant

SkinSense is a full-stack web application that combines a modern React frontend with a Python and TensorFlow backend. It allows users to get personalized skincare product recommendations by analyzing an image of their skin, captured in real-time via their webcam.

---

## 🏛️ Full-Stack Architecture

The application provides a seamless experience by connecting the frontend and backend through a REST API.

1.  **Image Capture (Frontend):** The user captures an image of their skin using the `react-webcam` component in the React web interface.
2.  **API Request (Frontend):** The captured image is converted to a base64 string and sent to the backend via an `axios` POST request to the `/analyze` endpoint.
3.  **API Server (Backend):** A Flask server receives the request, decodes the image, and saves it temporarily.
4.  **ML Inference (Backend):** The Python script passes the image to a pre-trained Keras/TensorFlow model, which classifies the skin into one of four types (Dry, Oily, Combination, or Normal).
5.  **Data Retrieval (Backend):** Based on the classified skin type, the application filters a Pandas DataFrame (loaded from `detailsofpdt.csv`) to find suitable products.
6.  **API Response (Backend):** The server sends a JSON object containing the skin type and a list of recommended products back to the frontend.
7.  **Display Results (Frontend):** The React application receives the JSON response and dynamically displays the analysis results and product recommendations to the user.

---

## 🖥️ Frontend (React + Vite)

The frontend is a modern, responsive single-page application that provides a rich user interface.

### Key Features

* **Live Webcam Integration:** Uses `react-webcam` for real-time video streaming and image capture directly in the browser.
* **Real-time Analysis:** Provides instant feedback with loading states while the backend processes the image.
* **Dynamic Results Display:** Neatly renders the AI-driven skin analysis and product recommendations.
* **Modern UI:** Built with **shadcn/ui** and styled with **Tailwind CSS** for a clean and responsive design.
* **Client-Side Routing:** Utilizes `react-router-dom` for a seamless single-page application experience.

### Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | React, Vite |
| **Language** | TypeScript |
| **UI Components** | shadcn/ui, Radix UI |
| **Styling** | Tailwind CSS |
| **Camera** | React Webcam |
| **API Client** | Axios |

---

## 🐍 Backend (Python + Flask)

The backend exposes the power of the machine learning model through a simple and robust REST API.

### Key Features

* **REST API:** A Flask-based web server exposes a simple `/analyze` endpoint for frontend communication.
* **AI-Powered Skin Analysis:** Uses a trained TensorFlow model to classify skin types from images.
* **Custom Product Database:** Leverages a Pandas DataFrame created from a web scraping pipeline.
* **Cross-Origin Support:** Includes `Flask-CORS` to securely handle requests from the web frontend.

### Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Web Framework** | Flask |
| **Machine Learning** | TensorFlow, Keras, NumPy |
| **Data Handling** | Pandas |
| **Image Processing**| Pillow (PIL) |

---

## ⚙️ Local Development Setup

To run this full-stack project, you must run both the backend server and the frontend client concurrently.

### 1. Backend Server Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask API server
# The server will start on [http://127.0.0.1:5000](http://127.0.0.1:5000)
python api.py
```
**Keep this terminal running.**

### 2. Frontend Client Setup

Open a **new terminal** for the frontend.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
# This project uses pnpm, but npm or yarn will also work
pnpm install

# Run the React development server
# The app will be available at http://localhost:5173
pnpm run dev
```

You can now open your browser to `http://localhost:5173` to use the application!
