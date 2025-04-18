import React, { useState, useEffect } from 'react';
import Graphique from './Graphique';

const FormulaireApi = () => {
    const [donneesGraphique, setDonneesGraphique] = useState({
        labels: ["Succès", "Erreurs 4xx", "Erreurs 5xx", "Erreurs inconnues"],
        datasets: [{
            label: 'Statistiques',
            data: [],
            backgroundColor: [
                "rgb(76, 175, 80)",
                "rgb(255, 160, 7)",
                "rgb(174, 54, 244)",
                "rgb(252, 8, 8)"
            ],
            hoverOffset: 4
        }]
    });
    const [sentCount, setSentCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorQuatreCent, seterrorQuatreCent] = useState(0);
    const [errorCinqCent, seterrorCinqCent] = useState(0);
    const [unknowError, setUnknowError] = useState(0);
    const [winRate, setWinRate] = useState(0);
    const [methode, setMethode] = useState("GET");
    const [body, setBody] = useState("");

    const estInputActif = !(methode === "GET" || methode === "DELETE");

    //change le taux de succès au fur et a mesure des requêtes
    useEffect(() => {
        setWinRate(sentCount > 0 ? (successCount / sentCount) * 100 : 0);
    }, [sentCount, successCount]);

    //reset le champ body à 0 si le select change pour get et delete
    useEffect(() => {
        if (!estInputActif) { setBody(""); }
    }, [estInputActif]);

    useEffect(() => {
        if (sentCount === 0) return;

        const nouvellesDonnees = [successCount, errorQuatreCent, errorCinqCent, unknowError];
        const total = nouvellesDonnees.reduce((acc, val) => acc + val, 0);

        if (total > 0) {
            setDonneesGraphique(prev => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: nouvellesDonnees
                }]
            }));
        }
    }, [successCount, errorQuatreCent, errorCinqCent, unknowError, sentCount]);

    function request_api() {
        const url = document.querySelector('.url input').value;
        const method = document.querySelector('.method select').value;
        const delay = parseInt(document.querySelector('.time input').value);
        const amount = parseInt(document.querySelector('.quantite input').value);

        if (!url || !method || isNaN(delay) || isNaN(amount)) {
            alert("Veuillez remplir tous les champs correctement !");
        
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
                    },
                    ...(estInputActif && { body: body })
                })
                    .then(async response => {
                        console.log(response.status)
                        if (response.status >= 400 && response.status < 500) {
                            seterrorQuatreCent(prev => prev + 1);
                        } else if (response.status >= 500) {
                            seterrorCinqCent(prev => prev + 1);
                        } else if (response.status === 200) {
                            setSuccessCount(prev => prev + 1);
                        }
                        else {
                            setUnknowError(prev => prev + 1);
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
                <select name="methode"
                    id="methode"
                    value={methode}
                    onChange={(e) => setMethode(e.target.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>
            </div>
            <div className="containerLabel corps">
                <label>Corps de la requête</label>
                <input type="text"
                    name="corps"
                    placeholder="Entrez le corps de la requête"
                    id="corps"
                    disabled={!estInputActif}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
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
                {/* <p>Succès : {successCount}</p>
                <p>Erreurs 4xx: {errorQuatreCent}</p>
                <p>Erreurs 5xx: {errorCinqCent}</p>
                <p>Erreurs inconnues: {unknowError}</p> */}
                <p>Taux réussite: {winRate.toFixed(2)}%</p>
            </div>

            {donneesGraphique.datasets[0].data.length > 0 &&
                donneesGraphique.datasets[0].data.some(value => value > 0) && (
                    <div className="graphiqueVisible">
                        <Graphique donnee={donneesGraphique} />
                    </div>
                )}
        </form>
    )
}

export default FormulaireApi;