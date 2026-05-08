import kagglehub
import os

datasets = [
    "parulpandey/indian-cities-database",
    "gunman02/indian-tourism-statistics",
    "kumarperiya/explore-india-a-tourist-destination-dataset",
    "anushkamandekar/indiatourismatlas",
    "PromptCloudHQ/hotels-on-goibibo",
    "himanshutripathi/places-to-explore",
    "sushanthnaidu24/indian-tourism-dataset",
    "muhammadahmadmujahid/ola-dataset",
    "yasserh/uber-fares-dataset",
    "vengateshvengat/rapido-all-data"
]

def download_all():
    print("Starting dataset downloads...")
    dataset_paths = {}
    for dataset in datasets:
        try:
            print(f"Downloading {dataset}...")
            path = kagglehub.dataset_download(dataset)
            print(f"Success! Path: {path}")
            dataset_paths[dataset] = path
        except Exception as e:
            print(f"Failed to download {dataset}: {e}")
    
    print("\nAll downloads completed!")
    print("Dataset Paths:")
    for ds, p in dataset_paths.items():
        print(f"{ds}: {p}")
        
if __name__ == "__main__":
    download_all()
