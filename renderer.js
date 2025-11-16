// Apanha os botões e divs
const scanBtn = document.getElementById('scan-btn');
const statusDiv = document.getElementById('status');
const summaryDiv = document.getElementById('summary');
const resultsDiv = document.getElementById('results');
const loginBtn = document.getElementById('login-btn');
const gdriveStatusDiv = document.getElementById('gdrive-status');

// --- NOVO BOTÃO DE SCAN DO DRIVE ---
const scanDriveBtn = document.getElementById('scan-drive-btn');
// ---------------------------------

// Função para formatar bytes (útil)
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Lógica para o botão de SCAN LOCAL
scanBtn.addEventListener('click', async () => {
    statusDiv.innerText = 'A analisar pasta local...';
    scanBtn.disabled = true;
    summaryDiv.innerText = ''; 
    resultsDiv.innerText = '';

    try {
        const analysisData = await window.api.scanFolder(); 
        const summary = analysisData.summary; 
        
        let summaryText = `Ficheiros Totais: ${summary.total_files}\n`;
        summaryText += `Tamanho Total: ${formatBytes(summary.total_size_bytes)}\n\n`;
        summaryText += 'Ficheiros por Categoria:\n';
        
        for (const [category, count] of Object.entries(summary.categories)) {
            if (count > 0) { 
                summaryText += `  - ${category}: ${count}\n`;
            }
        }
        summaryDiv.innerText = summaryText; 

        const duplicates = analysisData.duplicates; 
        if (Object.keys(duplicates).length === 0) {
            resultsDiv.innerText = 'Não foram encontrados duplicados!';
        } else {
            resultsDiv.innerText = JSON.stringify(duplicates, null, 2);
        }
        statusDiv.innerText = 'Análise local completa!';
    } catch (error) {
        statusDiv.innerText = `Erro: ${error.message}`;
        console.error(error);
    }
    scanBtn.disabled = false;
});

// Lógica para o botão de LOGIN DO GOOGLE
loginBtn.addEventListener('click', async () => {
    gdriveStatusDiv.innerText = 'A abrir o browser para login...';
    loginBtn.disabled = true;

    try {
        const result = await window.api.googleLogin();
        
        if (result === 'AUTH_SUCCESS') {
            gdriveStatusDiv.innerText = 'Conectado ao Google Drive!';
            loginBtn.innerText = 'Conectado';
            scanDriveBtn.disabled = false;
        } else {
            gdriveStatusDiv.innerText = `Erro: ${result}`;
            loginBtn.disabled = false;
        }

    } catch (error) {
        gdriveStatusDiv.innerText = `Erro: ${error.message}`;
        console.error(error);
        loginBtn.disabled = false;
    }
});

// --- LÓGICA NOVA PARA O BOTÃO DE SCAN DO DRIVE ---
scanDriveBtn.addEventListener('click', async () => {
    statusDiv.innerText = 'A analisar o Google Drive...';
    scanDriveBtn.disabled = true;
    summaryDiv.innerText = ''; 
    resultsDiv.innerText = '';

    try {
        // Chama a função 'scan:drive'
        const driveData = await window.api.scanDrive();
        
        if (driveData.error) {
            throw new Error(driveData.error);
        }

        // Mostra os 10 ficheiros que o Python encontrou
        summaryDiv.innerText = 'Primeiros 10 ficheiros encontrados no Drive:';
        resultsDiv.innerText = JSON.stringify(driveData.files, null, 2);
        statusDiv.innerText = 'Análise do Drive completa!';

    } catch (error) {
        statusDiv.innerText = `Erro: ${error.message}`;
        console.error(error);
    }

    scanDriveBtn.disabled = false;
});