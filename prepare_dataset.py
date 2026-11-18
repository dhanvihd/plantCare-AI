
import tensorflow as tf
from pathlib import Path

print("Preparing PlantCare AI dataset...")

# Locate the extracted dataset
base_path = Path("dataset/tensorflow_data/downloads/extracted")

dataset_folder = None

for folder in base_path.rglob("Plant_leave_diseases_dataset_without_augmentation"):
    dataset_folder = folder
    break

if dataset_folder is None:
    raise FileNotFoundError("Plant disease dataset not found!")

print("Dataset location:", dataset_folder)

# Get all disease categories
# Exclude background images
class_names = sorted([
    folder.name
    for folder in dataset_folder.iterdir()
    if folder.is_dir()
    and folder.name != "Background_without_leaves"
])

print("\nNumber of classes:", len(class_names))

# Load training images
train_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_folder,
    labels="inferred",
    label_mode="int",
    class_names=class_names,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(224, 224),
    batch_size=32
)

# Load validation images
val_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_folder,
    labels="inferred",
    label_mode="int",
    class_names=class_names,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(224, 224),
    batch_size=32
)

# Improve loading performance
AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

# Check one batch
for images, labels in train_ds.take(1):
    print("\nImage batch shape:", images.shape)
    print("Label batch shape:", labels.shape)

print("\nTraining dataset prepared successfully!")
print("Number of disease classes:", len(class_names))
