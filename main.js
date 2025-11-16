const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process'); // Para chamar o Python

// 1. CÓDIGO PARA CRIAR A JANELA (Faltava-lhe isto)
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

// 2. CÓDIGO QUE ARRANCA A APP (Faltava-lhe isto)
app.whenReady().then(createWindow);

// 3. OUVINTE PARA O SCAN DE PASTAS (O seu código original)
ipcMain.handle('scan:folder', async () => {
    // 1. Abrir o seletor de pastas
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (canceled || filePaths.length === 0) {
        throw new Error('Nenhuma pasta selecionada');
    }

    const folderPath = filePaths[0];

    // 2. Chamar o script Python 'scan.py'
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


// 4. OUVINTE PARA O LOGIN DO GOOGLE (O seu código novo)
ipcMain.handle('google:login', async () => {
    // Chamar o script Python 'auth.py'
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'backend', 'auth.py')
        ]);

        let output = ''; 
        let errorOutput = ''; 

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString().trim(); // .trim() é importante
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Erro no script Python: ${errorOutput}`));
            }
            // Devolve o output (ex: "AUTH_SUCCESS")
            resolve(output);
        });
    });
});

// OUVINTE: Isto fica à espera que o renderer.js chame 'scan:drive'
ipcMain.handle('scan:drive', async () => {
    // Chamar o script Python 'drive_api.py'
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'backend', 'drive_api.py')
        ]);

        let output = ''; 
        let errorOutput = ''; 

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString(); // Juntar todos os outputs
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Erro no script Python: ${errorOutput}`));
            }
            try {
                // Tenta converter o output em JSON
                const jsonData = JSON.parse(output);
                resolve(jsonData);
            } catch (parseError) {
                reject(new Error(`Erro ao processar o resultado do Python: ${parseError.message} | Output: ${output}`));
            }
        });
    });
});