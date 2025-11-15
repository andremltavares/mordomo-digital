import sys
import os
import hashlib
import json

# Função para calcular o hash de um ficheiro
def hash_file(path):
    """Calcular o hash MD5 de um ficheiro."""   
    hasher = hashlib.md5()
    try:
        with open(path, 'rb') as f:
            # Ler o ficheiro em blocos para não sobrecarregar a memória
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()
    except (IOError, OSError, PermissionError):
        # Ignora ficheiros que não podemos ler (ex: bloqueados pelo sistema)
        return None
    

# Função principal que varre a pasta
def find_duplicates(folder_path):
    """Encontra duplicados numa pasta e subpastas."""
    hashes = {} # Dicionário: {hash: [lista_de_ficheiros]}
    
    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            path = os.path.join(dirpath, filename)
            file_hash = hash_file(path)
            
            if file_hash:
                if file_hash not in hashes:
                    hashes[file_hash] = []
                hashes[file_hash].append(path)
    
    # Filtra apenas os hashes que aparecem em mais do que um ficheiro
    results = {hash_val: paths for hash_val, paths in hashes.items() if len(paths) > 1}
    return results

if __name__ == "__main__":
    # O caminho da pasta é nos dado como primeiro argumento
    path_to_scan = sys.argv[1]

    if os.path.isdir(path_to_scan):
        duplicates = find_duplicates(path_to_scan)
        # Imprime os resultados em formato JSON para o Electron conseguir apanhar
        print(json.dumps(duplicates, indent=2))
