const formulaireAPI = () => {
    return (
        <form>
            <h1>Test API</h1>
            <div className="containerLabel">
                <label for="url">URL : </label>
                <input type="text" name="url" placeholder="URL" />
            </div>

            <div className="containerLabel">
                <label for="methode">Méthode : </label>
                <select name="methode" id="methode">
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="put">PUT</option>
                    <option value="delete">DELETE</option>
                </select>
            </div>

            <div className="containerLabel">
                <label for="time">Temps d'attente : </label>
                <input type="text" name="time" placeholder="Time" />
            </div>

            <div className="containerLabel">
                <label for="nombreRequete">Nombre de requêtes : </label>
                <input type="text" name="nombreRequete" placeholder="Nombre requete" />
            </div>

            <button className="lien" type="submit">Lancer le test</button>
        </form>
    )
}

const formulaireMiddleware = () => {
    let loadedFiles = [];
    return (
        <div>
            <h1>Test Middleware</h1>

            <div className="containerLabel">
                <label for="file">Fichier : </label>
                <input type="file" name="file" accept=".js" /* onChange={handleFileChange} */ />
            </div>

            {loadedFiles.length > 0 ? (
                <>
                    <h2>Middlewares chargés :</h2>
                    <ul>
                        {loadedFiles.map((name, index) => (
                            <li key={index}>
                                {name}
                                <button /* onClick={() => removeMiddleware(index)} */ className="link">Supprimer</button>
                            </li>
                        ))}
                    </ul>

                    <button /* onClick={resetMiddlewares} */ className="reinit">Réinitialiser tous</button>
                </>
            ) : (
                <p className="warning">Aucun middleware chargé.</p>
            )}
        </div>
    );
};

function Formulaire({ choixFormulaire }) {
    return (
        <div>
            {choixFormulaire === 'formulaireAPI' && (formulaireAPI())}
            {choixFormulaire === 'formulaireMiddleware' && (formulaireMiddleware())}
        </div>
    );
}

export default Formulaire;