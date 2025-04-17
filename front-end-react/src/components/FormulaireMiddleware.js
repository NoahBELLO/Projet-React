import React, { useState, useEffect } from 'react';
import MiddlewareManager from './MiddlewareManager';
import Graphique from './Graphique';

const FormulaireMiddleware = () => {
    const [donneesGraphique, setDonneesGraphique] = useState({
        labels: ["Success", "Failed"],
        datasets: [{
            label: 'Statistiques',
            data: [],
            backgroundColor: [
                "rgb(76, 175, 80)",
                "rgb(252, 8, 8)"
            ],
            hoverOffset: 4
        }]
    });
    const [successCount, setSuccessCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [middlewares, setMiddlewares] = useState([]);
    const [result, setResult] = useState(null);
    const [nbRequests, setNbRequests] = useState(10);

    useEffect(() => {
        if (successCount + failedCount > 0) {
            setDonneesGraphique(prev => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: [successCount, 0, 0, failedCount] // 4xx, 5xx non différenciés ici
                }]
            }));
        }
    }, [successCount, failedCount]);

    const testMiddlewares = async () => {
        setSuccessCount(0);
        setFailedCount(0);

        let req = {
            url: "http://217.154.21.85:8447/hello",
            options: {
                method: "GET",
                headers: {},
                mode: "no-cors"
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
            let response;
            const informations = req.options.body ? JSON.parse(req.options.body) : {};
            if (req.url === "/api/challenge") {
                response = await fetch(`/api/challenge`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        challenge: informations.challenge,
                        nonce: informations.nonce
                    })
                });
            }
            else {
                response = await fetch(req.url, {
                    ...req.options,
                    mode: "no-cors"
                });
            }

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

    const launchLoadTest = async (count) => {
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
        const successRate = stats.total ? ((stats.success / stats.total) * 100).toFixed(1) + "%" : "N/A";
        const min = Math.min(...stats.durations).toFixed(1);
        const max = Math.max(...stats.durations).toFixed(1);

        setSuccessCount(stats.success);
        setFailedCount(stats.failed);

        setResult({
            "Envoyées": stats.total,
            success: stats.success,
            failed: stats.failed,
            average,
            "Taux réussite": successRate,
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

            <div className="dashboard-buttons dashboardFormulaire">
                <button onClick={testMiddlewares} className='lien dashboardButton' id='tester'>
                    Tester les middlewares
                </button>

                <div className="buttonLabel">
                    <div className="containerLabel">
                        <label htmlFor="nbReq">Nombre de requêtes :</label>
                        <input type="number" id="nbReq" value={nbRequests} onChange={(e) => setNbRequests(parseInt(e.target.value))} placeholder="10" min="1" />
                    </div>

                    <button onClick={() => launchLoadTest(nbRequests)} className='lien dashboardButton'>
                        Lancer un test de charge ({nbRequests} requêtes)
                    </button>
                </div>
            </div>

            {result && (
                <div className="resultat">
                    <h3>Résultat :</h3>
                    {/* <pre>{JSON.stringify(result, null, 2)}</pre> // ancien affichage*/}
                    <div className="json-readable">
                        {Object.entries(result)
                            .filter(([key]) => !['success', 'failed', 'min', 'max', 'average', 'errors'].includes(key))
                            .map(([key, value]) => (
                                <div key={key} className='result-line'>
                                    <strong className="labelStrong">{key} :</strong>
                                    <span className="valueText">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {(successCount + failedCount > 0) && (
                <div className="graphiqueVisible">
                    <Graphique donnee={donneesGraphique} />
                </div>
            )}
        </div>
    );
};

export default FormulaireMiddleware;