
import tensorflow as tf
from pathlib import Path
import json

print("🌱 Starting PlantCare AI training...")

# Dataset location
base_path = Path("dataset/tensorflow_data/downloads/extracted")

dataset_folder = next(
    base_path.rglob("Plant_leave_diseases_dataset_without_augmentation")
)

# Disease categories
class_names = sorted([
    folder.name
    for folder in dataset_folder.iterdir()
    if folder.is_dir()
    and folder.name != "Background_without_leaves"
])

NUM_CLASSES = len(class_names)
IMAGE_SIZE = (160, 160)
BATCH_SIZE = 16

print("Number of classes:", NUM_CLASSES)

# Load training data
train_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_folder,
    labels="inferred",
    label_mode="int",
    class_names=class_names,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE
)

# Load validation data
val_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_folder,
    labels="inferred",
    label_mode="int",
    class_names=class_names,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE
)

AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# Data augmentation
augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1)
])

# Load pretrained MobileNetV2
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(160, 160, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze pretrained layers
base_model.trainable = False

# Build complete model
inputs = tf.keras.Input(shape=(160, 160, 3))

x = augmentation(inputs)

x = tf.keras.applications.mobilenet_v2.preprocess_input(x)

x = base_model(x, training=False)

x = tf.keras.layers.GlobalAveragePooling2D()(x)

x = tf.keras.layers.Dense(256, activation="relu")(x)

x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(
    NUM_CLASSES,
    activation="softmax"
)(x)

model = tf.keras.Model(inputs, outputs)

# Compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# Save class names
Path("models").mkdir(exist_ok=True)

with open("models/class_names.json", "w") as f:
    json.dump(class_names, f, indent=4)

# Training callbacks
callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        "models/best_model.keras",
        monitor="val_accuracy",
        save_best_only=True
    ),
    tf.keras.callbacks.EarlyStopping(
        monitor="val_accuracy",
        patience=2,
        restore_best_weights=True
    )
]

# Train model
print("\n🚀 Training started!")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=3,
    callbacks=callbacks
)

# Save final model
model.save("models/plant_disease_model.keras")

print("\n✅ TRAINING COMPLETED!")

print("Final training accuracy:",
      history.history["accuracy"][-1])

print("Final validation accuracy:",
      history.history["val_accuracy"][-1])

print("Model saved successfully!")
