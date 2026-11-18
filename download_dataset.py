
import tensorflow_datasets as tfds

print("Downloading PlantVillage dataset...")

dataset, info = tfds.load(
    "plant_village",
    split="train",
    with_info=True,
    as_supervised=True,
    data_dir="dataset/tensorflow_data"
)

print("\nDataset downloaded successfully!")
print("Total images:", info.splits["train"].num_examples)
print("Number of classes:", info.features["label"].num_classes)

print("\nDisease categories:")

for label in info.features["label"].names:
    print(label)

