import json

# Carico il contenuto del file models.txt
file_name = "models.txt"
with open(file_name, 'r') as f:
    json_data = f.read()

# Decodifica il JSON
data = json.loads(json_data)

filtered_models_info = []

# Itero attraverso tutti gli elementi (modelli principali)
for item in data.get("items", []):
    model_name = item.get("name")
    model_creator = item.get("creator").get("username")
    model_versions = item.get("modelVersions", [])
    filtered_versions = []

    # Itero attraverso le versioni del modello
    for version in model_versions:
        version_files = version.get("files", [])

        # Controllo se esiste almeno un file di tipo "Model"
        is_model_file = False
        for file in version_files:
            if file.get("type") == "Model":
                is_model_file = True
                break

        # Se la versione contiene un file di tipo "Model", la aggiungo ai risultati filtrati
        if is_model_file:
            # Estraiamo i campi rilevanti della versione per la stampa
            filtered_versions.append({
                "name": version.get("name"),
                "base_model": version.get("baseModel"),
                "file_type": "Model", # Aggiunto per conferma
                "file_name": version_files[0].get("name") if version_files else "N/A",
                "download_url": version_files[0].get("downloadUrl") if version_files else "N/A",
                "trigger_words": version_files[0].get("trainedWords") 
            })

    # Aggiungo il modello principale e le sue versioni filtrate solo se ci sono versioni filtrate
    if filtered_versions:
        filtered_models_info.append({
            "model_name": model_name,
            "model_creator": model_creator,
            "model_versions_filtered": filtered_versions
        })

# Stampo i risultati
print("Versioni Modello con files.type = 'Model':")
for model in filtered_models_info:
    print(f"Modello Principale: {model['model_name']}")
    print(f"Creatore: {model['model_creator']}")
    for version in model['model_versions_filtered']:
        print(f"  - Versione: {version['name']}")
        print(f"    - Base Model: {version['base_model']}")
        print(f"    - Tipo File: {version['file_type']}")
        print(f"    - Nome File: {version['file_name']}")
        print(f"    - Download url: {version['download_url']}")
        print(f"    - Trigger: {version['trigger_words']}")