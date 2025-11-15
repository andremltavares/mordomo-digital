const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process'); // Para chamar o Python

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Anexa o script 'preload.js' à janela
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

//fica à espera que o renderer.js chame 'scan:folder'
ipcMain.handle('scan:folder', async () => {
    // 1. Abrir o seletor de pastas
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (canceled || filePaths.length === 0) {
        throw new Error('Nenhuma pasta selecionada');
    }

    const folderPath = filePaths[0];

    // 2. Chamar o script Python (num processo-filho)
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'backend', 'scan.py'),
            folderPath
        ]);

        let output = ''; 
        let errorOutput = ''; 

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Erro no script Python: ${errorOutput}`));
            }
            try {
                const jsonData = JSON.parse(output);
                resolve(jsonData);
            } catch (parseError) {
                reject(new Error(`Erro ao processar o resultado do Python: ${parseError.message} | Output: ${output}`));
            }
        });
    });
});