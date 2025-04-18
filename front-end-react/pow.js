export default async function pow(req, res, next) {
    const timestamp = Date.now().toString();
    const fingerprint = btoa(navigator.userAgent + navigator.language + window.screen.width + window.screen.height); // ou généré dynamiquement

    if (!fingerprint || !timestamp) {
        return res.status(400).json({ error: "Missing PoW headers" });
    }

    const difficulty = 3; // ou récupéré dynamiquement
    const prefix = '0'.repeat(difficulty);
    let nonce = 0;
    let hash = '';

    while (true) {
        const data = fingerprint + timestamp + nonce;
        const buffer = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hash.startsWith(prefix)) {
            break;
        }
        nonce++;
    }
    req.url = "https://pdf.valentinduflot.fr/";
    req.method = "GET";
    req.headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'x-timestamp': timestamp,
        'x-fingerprint': fingerprint,
        'x-pow-solution': hash,
        'x-pow-nonce': nonce,
    }

    next();
}