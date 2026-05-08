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

import shutil

def download_all():
    print("Starting dataset downloads...")
    dataset_paths = {}
    
    # Create a local datasets folder in the project
    local_datasets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets")
    os.makedirs(local_datasets_dir, exist_ok=True)
    
    for dataset in datasets:
        try:
            print(f"Downloading {dataset}...")
            # Download to kaggle cache
            cache_path = kagglehub.dataset_download(dataset)
            
            # Copy to our local datasets folder
            dataset_name = dataset.split("/")[-1]
            local_target_path = os.path.join(local_datasets_dir, dataset_name)
            
            # Remove if it exists to overwrite
            if os.path.exists(local_target_path):
                shutil.rmtree(local_target_path)
                
            shutil.copytree(cache_path, local_target_path)
            
            print(f"Success! Copied to project: {local_target_path}")
            dataset_paths[dataset] = local_target_path
        except Exception as e:
            print(f"Failed to download {dataset}: {e}")
    
    print("\nAll downloads completed and copied to your project!")
    print("Dataset Paths:")
    for ds, p in dataset_paths.items():
        print(f"{ds}: {p}")
        
if __name__ == "__main__":
    download_all()
