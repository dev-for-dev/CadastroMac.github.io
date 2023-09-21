document.addEventListener('DOMContentLoaded', function() {
    const scanButton = document.getElementById('scanButton');
    const manualInput = document.getElementById('manualInput');
    const addManualButton = document.getElementById('addManualButton');
    const macList = document.getElementById('macList');
    const copyButton = document.getElementById('copyButton');
    let scannedMACs = [];
    const loginForm = document.getElementById('loginForm');
    const mainContainer = document.querySelector('.container');
    const loginContainer = document.querySelector('.login-container');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // Adicione lógica para verificar o nome de usuário e senha aqui (por exemplo, comparando com credenciais hardcoded)
        if (username === 'admin' && password === 'admin') {
            // Exibir a tela principal se o login for bem-sucedido
            loginContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    });

    scanButton.addEventListener('click', function() {
        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                target: document.querySelector('#scanButton') 
            },
            decoder : {
                readers : ['ean_reader']
            }
        }, function(err) {
            if (err) {
                console.error('Erro ao iniciar Quagga:', err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function(result) {
            const mac = result.codeResult.code.slice(1).toUpperCase();
            scannedMACs.push(mac);
            updateMACList();
            Quagga.stop();
        });
    });

    addManualButton.addEventListener('click', function() {
        const mac = manualInput.value.trim().toUpperCase();
        if (isValidMAC(mac)) {
            scannedMACs.push(mac);
            updateMACList();
            manualInput.value = '';
        } else {
            alert('Por favor, digite um MAC válido.');
        }
    });

    function isValidMAC(mac) {
        const hexRegex = /^[0-9A-Fa-f]+$/;
        return mac.length === 12 && hexRegex.test(mac);
    }

    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(scannedMACs.join('\n')).then(function() {
            alert('MACs copiados para a área de transferência!');
        }, function(err) {
            console.error('Erro ao copiar MACs:', err);
        });
    });

    function updateMACList() {
        macList.innerHTML = '';
        for (let mac of scannedMACs) {
            const macElement = document.createElement('div');
            macElement.innerText = formatMAC(mac);
            macList.appendChild(macElement);
        }
    }

    function formatMAC(mac) {
        return mac.match(/.{2}/g).join(':');
    }
});
