export default async function pow(req, res, next) {
    if (!req.context) req.context = {};

    const challenge = "test";
    let nonce = 0;
    let hash = "";
    const difficulty = "000";

    console.log("Début de la preuve de travail...");

    const encoder = new TextEncoder();

    const start = performance.now();


    while (true) {
        const input = challenge + nonce;
        const data = encoder.encode(input);
        const buffer = await crypto.subtle.digest("SHA-256", data);

        hash = Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        if (hash.startsWith(difficulty)) break;
        nonce++;
    }

    const end = performance.now();

    // Stocker les infos dans context
    req.context.challenge = challenge;
    req.context.nonce = nonce;
    req.context.powHash = hash;
    req.context.elapsed = (end - start).toFixed(1) + " ms";

    req.url = "/api/challenge";

    req.options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            challenge,
            nonce
        })
    };
    
    console.log("Preuve trouvée :", nonce);
    console.log("Hash :", hash);
    console.log("Temps :", req.context.elapsed);

    next();
}
