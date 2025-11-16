import os.path
import sys
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# --- CONFIGURAÇÃO ---
# Ficheiro de credenciais que descarregou
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')
# Onde vamos guardar o "bilhete" de acesso (token)
TOKEN_FILE = os.path.join(os.path.dirname(__file__), 'token.json')

# As permissões que a app vai pedir.
# 'readonly' é mais seguro para começar.
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
# --------------------

def get_credentials():
    """
    Faz o login do utilizador e obtém as credenciais.
    Se o utilizador já fez login, reutiliza o token.
    """
    creds = None

    # O ficheiro token.json guarda os tokens de acesso.
    # Ele é criado automaticamente no primeiro login.
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # Se não houver credenciais (ou se expiraram), faz o login.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Inicia o fluxo de login
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES)

            # Abre o browser para o utilizador fazer login
            # O 'run_local_server' trata de tudo automaticamente
            creds = flow.run_local_server(port=0)

        # Guarda as credenciais (o token) para a próxima vez
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    return creds

if __name__ == "__main__":
    try:
        get_credentials()
        # Se chegou aqui, o login foi um sucesso
        # Damos feedback ao Electron
        print("AUTH_SUCCESS") 
    except Exception as e:
        # Se falhou, avisamos o Electron
        print(f"AUTH_ERROR: {e}", file=sys.stderr)
        sys.exit(1)