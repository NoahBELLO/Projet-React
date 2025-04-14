import React, { useState, useEffect } from 'react';
import MiddlewareManager from '../MiddlewareManager';

const FormulaireAPI = () => {
    const [sentCount, setSentCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorQuatreCent, seterrorQuatreCent] = useState(0);
    const [errorCinqCent, seterrorCinqCent] = useState(0);
    const [unknowError, setUnknowError] = useState(0);
    const [winRate, setWinRate] = useState(0);

    useEffect(() => {
        setWinRate(sentCount > 0 ? (successCount / sentCount) * 100 : 0);
    }, [sentCount, successCount]);

    function request_api() {
        const url = document.querySelector('.url input').value;
        const method = document.querySelector('.method select').value;
        const delay = parseInt(document.querySelector('.time input').value);
        const amount = parseInt(document.querySelector('.quantite input').value);

        if (!url || !method || isNaN(delay) || isNaN(amount)) {
            alert("Veuillez remplir tous les champs correctement !");
            return;
        }

        setSentCount(0);
        setSuccessCount(0);
        seterrorQuatreCent(0);
        seterrorCinqCent(0);
        setUnknowError(0);

        const interval = delay / amount;

        for (let i = 0; i < amount; i++) {
            setTimeout(() => {
                setSentCount(prev => prev + 1);

                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                })
                    .then(async response => {
                        console.log(response.status)
                        if (response.status >= 400 && response.status < 500) {
                            seterrorQuatreCent(prev => prev + 1);
                        } else if (response.status >= 500) {
                            seterrorCinqCent(prev => prev + 1);
                        } else {
                            setSuccessCount(prev => prev + 1);
                        }
                        return response.json();
                    })
                    
                    .catch(error => {
            
                        console.error("Erreur réseau :", error);
                        setUnknowError(prev => prev + 1);
                    });
            }, i * interval);
        }
    }

    return (
        <form>
            <h1>Test API</h1>
            <div className="containerLabel url">
                <label htmlFor="url">URL : </label>
                <input type="text" name="url" placeholder="Entrez votre URL" id="url" />
            </div>

            <div className="containerLabel method">
                <label htmlFor="methode">Méthode : </label>
                <select name="methode" id="methode">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>
            </div>

            <div className="containerLabel time">
                <label htmlFor="time">Time : </label>
                <input type="number" name="time" placeholder="Entrez le délai" id="time" />
            </div>

            <div className="containerLabel quantite">
                <label htmlFor="quantite">Quantité : </label>
                <input type="text" name="quantite" placeholder="Nombre requete" id="quantite" />
            </div>

            <button className="lien" type="submit" onClick={request_api}>Lancer le test</button>

            <div className="compteur">
                <p>Envoyées : {sentCount}</p>
                <p>Succès : {successCount}</p>
                <p>Erreurs 4xx: {errorQuatreCent}</p>
                <p>Erreurs 5xx: {errorCinqCent}</p>
                <p>Erreurs inconnues: {unknowError}</p>
                <p>Taux réussite: {winRate.toFixed(2)}%</p>
            </div>
        </form>
    )
}

const FormulaireMiddleware = () => {
    const [middlewares, setMiddlewares] = useState([]);
    const [result, setResult] = useState(null);

    const testMiddlewares = async () => {
        let req = {
            url: "http://217.154.21.85:8447/hello",
            options: {
                method: "GET",
                headers: {}
            },
            context: {}
        };

        // Appliquer les middlewares un par un
        for (const mw of middlewares) {
            await mw(req, null, () => { });
        }

        console.log("Requête après middlewares :", req);

        try {
            // Envoi réel de la requête
            const response = await fetch(req.url, {
                ...req.options,
                mode: "no-cors"
            });


            // Essaie de parser le résultat (texte ou JSON)
            const contentType = response.headers.get('content-type');
            const data = contentType?.includes('application/json')
                ? await response.json()
                : await response.text();

            console.log("Réponse du serveur :", data);

            setResult({
                url: req.url,
                headers: req.options.headers,
                context: req.context,
                response: data
            });

        } catch (err) {
            console.error("Erreur lors de la requête :", err.message);
            setResult({
                url: req.url,
                headers: req.options.headers,
                context: req.context,
                response: `Erreur : ${err.message}`
            });
        }
    };

    const launchLoadTest = async (count = 10) => {
        const stats = {
            total: 0,
            success: 0,
            failed: 0,
            durations: [],
            errors: [],
        };

        for (let i = 0; i < count; i++) {
            let req = {
                url: "http://217.154.21.85:8447/hello",
                options: {
                    method: "GET",
                    headers: {},
                    mode: "no-cors"
                },
                context: {}
            };

            for (const mw of middlewares) {
                await mw(req, null, () => { });
            }

            const start = performance.now();

            try {
                await fetch(req.url, req.options);
                const end = performance.now();
                const duration = end - start;

                stats.success++;
                stats.durations.push(duration);
            } catch (err) {
                stats.failed++;
                stats.errors.push(err.message);
            }

            stats.total++;
        }

        // Calcul des stats
        const sum = stats.durations.reduce((a, b) => a + b, 0);
        const average = stats.durations.length ? (sum / stats.durations.length).toFixed(1) : "N/A";
        const min = Math.min(...stats.durations).toFixed(1);
        const max = Math.max(...stats.durations).toFixed(1);

        setResult({
            total: stats.total,
            success: stats.success,
            failed: stats.failed,
            average,
            min,
            max,
            errors: stats.errors
        });
    };

    return (
        <div>
            <h1>Test Middleware</h1>
            <p>{middlewares.length} middleware(s) chargé(s)</p>

            <MiddlewareManager setMiddlewares={setMiddlewares} />

            <div className="dashboard-buttons">
                <button onClick={testMiddlewares} className='lien'>
                    Tester les middlewares
                </button>
                <button onClick={() => launchLoadTest(10)} className='lien'>
                    Lancer un test de charge (10 requêtes)
                </button>
            </div>

            {result && (
                <div style={{ marginTop: '2rem', background: '#f0f0f0', padding: '1rem', borderRadius: '8px', color: '#000' }}>
                    <h3>Résultat :</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

function Formulaire({ choixFormulaire }) {
    return (
        <div>
            {console.log(choixFormulaire)}
            {choixFormulaire === 'formulaireAPI' && (<FormulaireAPI />)}
            {choixFormulaire === 'formulaireMiddleware' && (<FormulaireMiddleware />)}
        </div>
    );
}

export default Formulaire;