
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import numpy as np
import json
import io
from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "plant_disease_model.keras"
CLASS_PATH = BASE_DIR / "models" / "class_names.json"

# Flask app configuration
app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "frontend" / "templates"),
    static_folder=str(BASE_DIR / "frontend" / "static"),
    static_url_path="/static"
)

CORS(app)

# Load trained AI model
print("Loading PlantCare AI model...")

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_PATH, "r") as file:
    class_names = json.load(file)

print("AI model loaded successfully!")
print(f"Total disease categories: {len(class_names)}")


# Dashboard
@app.route("/")
def home():
    return render_template("index.html")


# Health check
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "classes": len(class_names)
    })


# Leaf disease prediction
@app.route("/predict", methods=["POST"])
def predict():

    try:
        if "file" not in request.files:
            return jsonify({
                "success": False,
                "message": "No image uploaded."
            }), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({
                "success": False,
                "message": "Please select an image."
            }), 400

        # Read and process image
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        image = image.resize((160, 160))

        image_array = np.array(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)

        # AI prediction
        predictions = model.predict(image_array, verbose=0)

        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))

        predicted_class = class_names[predicted_index]

        # Extract crop and disease
        parts = predicted_class.split("___")

        crop = parts[0].replace("_", " ")

        disease = (
            parts[1].replace("_", " ")
            if len(parts) > 1
            else "Unknown"
        )

        # Low confidence handling
        if confidence < 0.20:
            return jsonify({
                "success": True,
                "reliable_prediction": False,
                "message": "The AI could not identify this leaf confidently. Please try a clearer image.",
                "confidence": round(confidence * 100, 2)
            })

        return jsonify({
            "success": True,
            "reliable_prediction": True,
            "crop": crop,
            "disease": disease,
            "full_class": predicted_class,
            "confidence": round(confidence * 100, 2),
            "message": "Leaf analysis completed successfully."
        })

    except Exception as e:
        print("Prediction error:", str(e))

        return jsonify({
            "success": False,
            "message": "Unable to analyse this image. Please upload a valid leaf image."
        }), 500


# Run server
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
