import os.path
import sys
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build # Importante para construir o serviço

# --- CONFIGURAÇÃO ---
# O token que o auth.py criou
TOKEN_FILE = os.path.join(os.path.dirname(__file__), 'token.json')
# As permissões que pedimos
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
# --------------------

def get_drive_service():
    """Carrega o token e constrói o 'serviço' do Google Drive."""
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # Se o token não existir ou tiver expirado (não deve acontecer agora)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Se não houver token, não podemos fazer nada.
            # (Numa app real, chamaríamos o auth.py, mas aqui falhamos)
            raise Exception("Token não encontrado. Por favor, faça o login primeiro.")
    
    # Constrói o "serviço" que nos permite falar com a API
    service = build('drive', 'v3', credentials=creds)
    return service

def list_files():
    """Pede ao Google Drive a lista de ficheiros."""
    try:
        service = get_drive_service()

        # Chama a API do Drive (files().list())
        # pageSize=10: Pede os primeiros 10 ficheiros
        # fields: Pede só o nome e o ID (para ser mais rápido)
        results = service.files().list(
            pageSize=10, fields="files(id, name)").execute()
        
        items = results.get('files', [])

        if not items:
            return {"message": "Nenhum ficheiro encontrado."}
        
        return {"files": items} # Devolve a lista de ficheiros

    except Exception as e:
        # Se falhar (ex: token expirou), devolve o erro
        return {"error": str(e)}

if __name__ == "__main__":
    # Quando executamos o script diretamente
    file_list = list_files()
    # Imprime o resultado em JSON para o terminal
    print(json.dumps(file_list, indent=2))