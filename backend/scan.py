import sys
import os
import hashlib
import json

# Definição de categorias
CATEGORIES = {
    'Imagens': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
    'Documentos': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.odt'],
    'Vídeos': ['.mp4', '.mkv', '.avi', '.mov', '.wmv'],
    'Música': ['.mp3', '.wav', '.aac', '.flac'],
    'Comprimidos': ['.zip', '.rar', '.7z', '.gz'],
    'Executáveis': ['.exe', '.msi', '.dmg', '.app'],
}

def hash_file(path):
    """Calcula o hash MD5 de um ficheiro."""
    hasher = hashlib.md5()
    try:
        with open(path, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()
    except (IOError, OSError, PermissionError):
        return None

def analyze_folder(folder_path):
    """Analisa uma pasta, encontra duplicados e categoriza ficheiros."""
    hashes = {}
    
    # Novas estatísticas que vamos colecionar
    summary = {
        'total_files': 0,
        'total_size_bytes': 0,
        'categories': {
            'Imagens': 0, 'Documentos': 0, 'Vídeos': 0, 
            'Música': 0, 'Comprimidos': 0, 'Executáveis': 0, 'Outros': 0
        }
    }
    
    # Mapeamento reverso (extensão -> categoria) para ser mais rápido
    ext_to_cat = {ext: cat for cat, exts in CATEGORIES.items() for ext in exts}

    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            path = os.path.join(dirpath, filename)
            
            try:
                # 1. Atualizar estatísticas gerais
                file_size = os.path.getsize(path)
                summary['total_files'] += 1
                summary['total_size_bytes'] += file_size

                # 2. Categorizar
                ext = os.path.splitext(filename)[1].lower()
                category = ext_to_cat.get(ext, 'Outros')
                summary['categories'][category] += 1
                
                # 3. Encontrar duplicados (como antes)
                file_hash = hash_file(path)
                if file_hash:
                    if file_hash not in hashes:
                        hashes[file_hash] = []
                    hashes[file_hash].append(path)
            
            except (OSError, PermissionError):
                # Ignora ficheiros que não podemos aceder (como atalhos do sistema)
                continue
    
    # Filtrar duplicados
    duplicates = {hash_val: paths for hash_val, paths in hashes.items() if len(paths) > 1}
    
    # Devolver um único objeto com tudo
    return {'duplicates': duplicates, 'summary': summary}

if __name__ == "__main__":
    path_to_scan = sys.argv[1] 
    if os.path.isdir(path_to_scan):
        analysis_data = analyze_folder(path_to_scan)
        # Imprime o novo objeto JSON
        print(json.dumps(analysis_data, indent=2))