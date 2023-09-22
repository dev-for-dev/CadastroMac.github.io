document.addEventListener('DOMContentLoaded', function () {
    const scanButton = document.getElementById('scanButton');
    const macList = document.getElementById('macList');
    const copyButton = document.getElementById('copyButton');
    let scannedMACs = [];
    let isScanning = false;

    scanButton.addEventListener('click', function () {
        if (isScanning) return;
        isScanning = true;

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoContainer
            },
            decoder: {
                readers: ['code_128_reader']
            }
        }, function (err) {
            if (err) {
                console.error('Erro ao iniciar Quagga:', err);
                isScanning = false;
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function (result) {
            const mac = result.codeResult.code.slice(0).toUpperCase();
            const existingIndex = scannedMACs.findIndex(item => item === mac);

            if (existingIndex !== -1) {
                scannedMACs[existingIndex] = mac;
            } else {
                scannedMACs.push(mac);
            }

            updateMACList();
            Quagga.stop();
            isScanning = false;
            videoContainer.style.display = 'block';
        });
    });

    addManualButton.addEventListener('click', function() {
        const mac = manualInput.value.trim().toUpperCase();
        if (isValidMAC(mac)) {
            const existingIndex = scannedMACs.findIndex(item => item === mac);
            if (existingIndex !== -1) {
                scannedMACs[existingIndex] = mac;
            } else {
                scannedMACs.push(mac);
            }
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

    copyButton.addEventListener('click', function () {
        const formattedMACs = scannedMACs.map(formatMAC);
        navigator.clipboard.writeText(formattedMACs.join('\n')).then(function () {
            alert('MACs copiados para a área de transferência!');
        }, function (err) {
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
