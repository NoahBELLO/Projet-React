function request_api(url, method, time, amount) {
    const interval = time / amount;
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Réponse :", data);
            })
            .catch(error => {
                console.error("Erreur :", error);
            });
        }, i * interval);
    }
}