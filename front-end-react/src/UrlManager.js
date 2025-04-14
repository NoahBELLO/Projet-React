import React, { useState, useEffect } from 'react';

function UrlManager() {
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
                        // On pourrait améliorer la classification en examinant error ou en traitant le status avant erreur
                        setUnknowError(prev => prev + 1);
                    });
            }, i * interval);
        }
    }

    return (
        <>
            <div className="url">
                <label>URL:</label>
                <input placeholder="Entrez votre url" />
            </div>
            <div className="method">
                <select>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>
            </div>
            <div className="time">
                <label>Time:</label>
                <input type="number" placeholder="Entrez le délai" />
            </div>
            <div className="quantite">
                <label>Quantité:</label>
                <input type="number" placeholder="Entrez la quantité" />
            </div>
            <button className="test" onClick={request_api}>Tester</button>
            <div className="compteur">
                <p>Envoyées : {sentCount}</p>
                <p>Succès : {successCount}</p>
                <p>Erreurs 4xx: {errorQuatreCent}</p>
                <p>Erreurs 5xx: {errorCinqCent}</p>
                <p>Erreurs inconnues: {unknowError}</p>
                <p>Taux réussite: {winRate.toFixed(2)}%</p>
            </div>
        </>
    );
}

export default UrlManager;
