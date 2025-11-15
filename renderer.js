const scanBtn = document.getElementById('scan-btn');
const statusDiv = document.getElementById('status');
// Apanha o novo <div> que criámos no HTML
const summaryDiv = document.getElementById('summary'); 
const resultsDiv = document.getElementById('results');

scanBtn.addEventListener('click', async () => {
    statusDiv.innerText = 'A analisar... (isto pode demorar)...';
    scanBtn.disabled = true;
    summaryDiv.innerText = ''; // Limpa o resumo antigo
    resultsDiv.innerText = '';

    try {
        // 1. 'analysisData' é o objeto completo que vem do Python
        //    (Ex: { duplicates: {...}, summary: {...} })
        const analysisData = await window.api.scanFolder(); 
        
        // --- 2. Processar o Resumo (A PARTE NOVA) ---
        const summary = analysisData.summary; // Extrai só o resumo
        
        // Função para formatar bytes
        const formatBytes = (bytes, decimals = 2) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        // Construir o texto do resumo
        let summaryText = `Ficheiros Totais: ${summary.total_files}\n`;
        summaryText += `Tamanho Total: ${formatBytes(summary.total_size_bytes)}\n\n`;
        summaryText += 'Ficheiros por Categoria:\n';
        
        for (const [category, count] of Object.entries(summary.categories)) {
            if (count > 0) { // Só mostra categorias que têm ficheiros
                summaryText += `  - ${category}: ${count}\n`;
            }
        }
        // Coloca o texto no <div> do resumo
        summaryDiv.innerText = summaryText; 

        // --- 3. Processar os Duplicados ---
        const duplicates = analysisData.duplicates; // Extrai só os duplicados

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