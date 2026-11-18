# 🌿 PlantCare AI

A plant disease detection project built using Deep Learning.

PlantCare AI is a project I developed to make identifying plant diseases a little easier. The idea is simple: instead of manually trying to figure out what's wrong with a plant, users can upload a picture of its leaf and get an AI-based prediction.

Along with the prediction, the application also provides information about the disease, its symptoms and possible ways to manage it.

## What can it do?

- Upload a picture of a plant leaf or use a camera.
- Detect plant diseases using a trained deep learning model.
- Identify diseases across 38 different categories.
- Display the predicted disease along with its confidence score.
- Show information about symptoms, treatment and prevention.
- Access the application through a mobile-friendly interface.

## How it works

The application uses a MobileNetV2 model trained on the PlantVillage dataset.

When a user uploads a leaf image, the backend processes it and passes it to the trained model. The model predicts the most likely disease category, and the result is displayed along with relevant plant care information.

## Technologies Used

- **Python & Flask** – Backend
- **TensorFlow & Keras** – Deep learning model
- **MobileNetV2** – Model architecture
- **HTML, CSS & JavaScript** – Frontend
- **Capacitor** – Android application

## Model Details

| Detail | Value |
|---|---|
| Model | MobileNetV2 |
| Dataset | PlantVillage |
| Classes | 38 |
| Validation Accuracy | 92.66% |

## Project Structure

```text
PlantCare-AI/
│
├── backend/
├── frontend/
├── mobile/
├── models/
├── download_dataset.py
├── prepare_dataset.py
├── train_model.py
└── README.md
```

## Running the Project

Clone the repository:

```bash
git clone https://github.com/dhanvihd/plantCare-AI.git
cd plantCare-AI
```

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install the required Python packages using the project's dependencies.

Start the backend:

```bash
python backend/app.py
```

## What I Learned

Building this project helped me explore deep learning beyond classroom concepts. I got to work with image classification, dataset preparation, model training, Flask integration and converting a web application into an Android app.

It also gave me a better understanding of how an AI model can be connected to an application that people can actually use.

## Developer

**Dhanvi H.D.**

Information Science and Engineering

[GitHub Profile](https://github.com/dhanvihd)

---

*Built as a learning project with the aim of making plant disease identification easier.*
