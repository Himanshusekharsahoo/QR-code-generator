document.querySelector("#generate-qr-btn").addEventListener('click', handleGenerateQrButtonClick);
document.querySelector("#share-qr-btn").addEventListener('click', handleShareQrButtonClick);

function handleGenerateQrButtonClick() {
    const input = document.querySelector("#input").value.trim();
    if (!input) {
        showError("Please enter a link before generating a QR code.");
        return;
    }
    const qr = document.querySelector('#qr');
    new QRious({
        element: qr,
        value: input,
        size: 200 
    });
    qr.style.display = "block";
    hideError();
}

async function handleShareQrButtonClick() {
    const input = document.querySelector("#input").value.trim();
    const qrCanvas = document.querySelector('#qr');
    
    if (!input || qrCanvas.style.display === "none") {
        showError("Write the Link First!!");
        return;
    }
    
    try {
        const blob = await new Promise(resolve => qrCanvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'qrcode.png', { type: blob.type });
        
        if (navigator.share) {
            await navigator.share({
                title: 'QR Code',
                text: 'Check out this QR code!',
                files: [file]
            });
            console.log('Share was successful.');
        } else {
            showError('Web Share API not supported in this browser.');
        }
    } catch (error) {
        console.error('Error sharing QR code', error);
        showError("An error occurred while sharing the QR code.");
    }
}

function showError(message) {
    let errorElement = document.getElementById('errorMessage');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.style.color = 'red';
        errorElement.style.marginTop = '10px';
        document.querySelector('#qr').insertAdjacentElement('afterend', errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.style.display = 'Write the Link First!!';
    }
}

// Ripple effect functions
const ripple = el => {
    let d = el.dataset.ripple.split('-'),
        s = 'rgba(3,149,229,0.4)',
        e = 'rgba(3,149,229,1)';
    d[2] = Number(d[2]) + 4;
    el.dataset.ripple = d.join('-');
    el.style.backgroundImage = `radial-gradient(circle at ${d[0]}px ${d[1]}px, ${s} 0%, ${s} ${d[2]}%, ${e} ${d[2] + 0.1}%)`;
    
    window.requestAnimationFrame(() => {
        if (el.dataset.ripple && d[2] < 100) ripple(el);
    });
};

const start = ev => {
    ev.target.dataset.ripple = `${ev.offsetX}-${ev.offsetY}-0`;
    ripple(ev.target);
};

const stop = ev => {
    let el = document.querySelector('[data-ripple]');
    if (el) {
        delete el.dataset.ripple;
        el.style.backgroundImage = 'none';
    }
};

// Event listeners for ripple effect
document.querySelectorAll('.highlight').forEach(el => el.addEventListener('mousedown', start));
document.addEventListener('mouseup', stop);