import os

def search_files(directory, term):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.css')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if term.lower() in line.lower():
                                print(f"{path}:{i+1}: {line.strip()}")
                except Exception as e:
                    pass

search_files('C:/Users/Sunil Kale/.gemini/antigravity/scratch/frontend/src', 'Sunil')
