const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const check1 = document.getElementById('check1').checked;
    const check2 = document.getElementById('check2').checked;
    const captchaResponse = grecaptcha.getResponse();

    if (!check1 || !check2) {
        alert("Please check all required checkboxes.");
        return;
    }

    if (captchaResponse.length === 0) {
        alert("Please complete the CAPTCHA.");
        return;
    }

    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ captchaResponse: captchaResponse })
        });

        const data = await response.json();

        if (data.success) {
            window.location.replace('/text_chat');
        } else {
            alert("Verification failed: " + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again.');
    }
});
