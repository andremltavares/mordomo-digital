// Apanha os botões e divs
const scanBtn = document.getElementById('scan-btn');
const statusDiv = document.getElementById('status');
const summaryDiv = document.getElementById('summary');
const resultsDiv = document.getElementById('results');

// --- NOVOS ELEMENTOS ---
const loginBtn = document.getElementById('login-btn');
const gdriveStatusDiv = document.getElementById('gdrive-status');
// -----------------------

// Lógica para o botão de SCAN LOCAL
scanBtn.addEventListener('click', async () => {
    statusDiv.innerText = 'A analisar... (isto pode demorar)...';
    scanBtn.disabled = true;
    summaryDiv.innerText = ''; 
    resultsDiv.innerText = '';

    try {
        const analysisData = await window.api.scanFolder(); 
        const summary = analysisData.summary; 
        
        const formatBytes = (bytes, decimals = 2) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

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
        statusDiv.innerText = 'Análise completa!';
    } catch (error) {
        statusDiv.innerText = `Erro: ${error.message}`;
        console.error(error);
    }
    scanBtn.disabled = false;
});


// --- LÓGICA NOVA PARA O BOTÃO DE LOGIN ---
loginBtn.addEventListener('click', async () => {
    gdriveStatusDiv.innerText = 'A abrir o browser para login...';
    loginBtn.disabled = true;

    try {
        // Chama a função 'google:login' que vamos criar no main.js
        const result = await window.api.googleLogin();
        
        if (result === 'AUTH_SUCCESS') {
            gdriveStatusDiv.innerText = 'Conectado ao Google Drive!';
            loginBtn.innerText = 'Conectado';
        } else {
            // Isto não devia acontecer, mas é bom prevenir
            gdriveStatusDiv.innerText = `Erro: ${result}`;
            loginBtn.disabled = false;
        }

    } catch (error) {
        gdriveStatusDiv.innerText = `Erro: ${error.message}`;
        console.error(error);
        loginBtn.disabled = false;
    }
});