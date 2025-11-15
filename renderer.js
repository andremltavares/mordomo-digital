const scanBtn = document.getElementById('scan-btn');
const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('results');

scanBtn.addEventListener('click', async () => {
    statusDiv.innerText = 'A analisar... (isto pode demorar)...';
    scanBtn.disabled = true;
    resultsDiv.innerText = '';

    try {
        const duplicates = await window.api.scanFolder();

        if (Object.keys(duplicates).length === 0) {
            statusDiv.innerText = 'Nenhum ficheiro duplicado encontrado.';
        } else {
            statusDiv.innerText = 'Ficheiros duplicados encontrados:';
            resultsDiv.innerText = JSON.stringify(duplicates, null, 2);
        }
    } catch (error) {
        statusDiv.innerText = `Erro: ${error.message}`;
        console.error(error);
    }
    scanBtn.disabled = false;
});