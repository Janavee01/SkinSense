# SkinSense: AI-Powered Skincare Assistant

![Status](https://img.shields.io/badge/status-completed-green)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![Tech](https://img.shields.io/badge/tech-TensorFlow%20%7C%20Pandas-orange)

SkinSense is an intelligent Python application that leverages a machine learning model to analyze a user's skin from an image, classify their skin type, and provide personalized skincare product recommendations from a custom-built product database.

**Note for Recruiters:** This project demonstrates a complete, end-to-end machine learning workflow, including automated data collection via web scraping, data processing, model inference, and the development of a user-facing application.

---

## 🏛️ Project Architecture

The application operates in a sequential, three-stage pipeline:

1.  **Data Collection (Web Scraping):** The process begins with the web scraping scripts. `get_skincare_urls.py` gathers product URLs from a target website, and `scrape_product_data.py` visits each URL to extract key details (Product Name, Brand, Ingredients, and Suitable Skin Types), saving them into `detailsofpdt.csv`.
2.  **Skin Type Classification (Machine Learning):** The core of the application is the `classifier.py` module. It loads a pre-trained Keras/TensorFlow model (`skin_model/`) which analyzes an input image of a user's face and classifies the skin into one of four categories: **Dry, Oily, Combination, or Normal**.
3.  **Personalized Recommendation (Application Logic):** The main script, `assistant.py`, orchestrates the entire process. It takes a user's image path, sends it to the classifier to get the skin type, and then filters the product database (`detailsofpdt.csv`) to find and recommend products specifically suited for that determined skin type.

---

## 🚀 Key Features

* **AI-Powered Skin Analysis:** Utilizes a trained TensorFlow model to accurately classify skin types from a simple photograph.
* **Custom Product Database:** Employs a web scraping pipeline using BeautifulSoup to build and maintain a local database of skincare products.
* **Personalized Recommendations:** Provides users with tailored skincare product suggestions based on their unique skin type.
* **Command-Line Interface:** A straightforward CLI allows users to easily run the assistant by providing a path to their skin image.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Machine Learning** | TensorFlow, Keras, NumPy |
| **Data Handling** | Pandas |
| **Web Scraping** | BeautifulSoup4, Requests |
| **Image Processing**| Pillow (PIL) |
| **Core Language** | Python |

---

## ⚙️ Setup and Usage

To run this project locally, please follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Janavee01/SkinSense.git](https://github.com/Janavee01/SkinSense.git)
    cd SkinSense
    ```

2.  **Create a virtual environment:**
    ```bash
    # For Windows
    python -m venv venv
    venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required dependencies:**
    *(Make sure you have created the `requirements.txt` file as described above)*
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the AI Assistant:**
    Execute the main script and follow the on-screen prompt to provide the path to your image.
    ```bash
    python assistant.py
    ```
    Example:
    ```
    Enter the path to your skin image: C:/Users/YourUser/Pictures/my_skin_photo.jpg
    ```
    The application will then print a list of recommended products.
