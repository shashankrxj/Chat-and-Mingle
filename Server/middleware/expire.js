function checkSessionValidity(req, res, next) {
    const { captchaVerifiedAt } = req.session;
    const currentTime = Date.now();
    const thirtyMinutesInMillis = 1800000; // 30 minutes in milliseconds

    // If captchaVerifiedAt is defined and within the 30-minute limit, proceed to the next middleware
    if (captchaVerifiedAt && (currentTime - captchaVerifiedAt) <= thirtyMinutesInMillis) {
        next();
    } else {
        // If the session is expired or invalid, send a response with an alert message
        res.send(`
            <script>
                alert('Your session has expired. Please verify the CAPTCHA again.');
                window.location.href = '/';
            </script>
        `);
    }
}

module.exports = checkSessionValidity;
