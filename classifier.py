import tensorflow as tf
from tensorflow.keras.layers import TFSMLayer
from tensorflow.keras.applications.efficientnet_v2 import preprocess_input
from PIL import Image
import numpy as np

# Load model using TFSMLayer
model = TFSMLayer("skin_model", call_endpoint="serving_default")

# Class labels from README
class_labels = [
    "Acne",
    "Inflammation"
    "Dryness",
    "Oily Skin",
    "Hyperpigmentation"
]

# Load and preprocess image
def load_image(path):
    img = Image.open(path).convert("RGB").resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)  # shape: (1, 224, 224, 3)
    img_array = preprocess_input(img_array.astype("float32"))
    return img_array

# Predict
image_path = "image.webp"  # Make sure this file exists in your folder
img = load_image(image_path)
pred = model(img)
predicted_index = np.argmax(pred)
predicted_label = class_labels[predicted_index]

print("Predicted class:", predicted_label)

