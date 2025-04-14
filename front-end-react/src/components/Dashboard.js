import { useState } from "react";
import Formulaire from "./Formulaire";

function Dashboard() {
    const [choixFormulaire, setChoixFormulaire] = useState(null);
    return (
        <div className="container dashboard">
            <div className="dashboard-buttons">
                <button onClick={() => setChoixFormulaire("formulaireAPI")} className="lien">Tester une API</button>
                <p id="choix">OU</p>
                <button onClick={() => setChoixFormulaire("formulaireMiddleware")} className="lien">Tester un Middleware</button>
            </div>

            {choixFormulaire && <Formulaire choixFormulaire={choixFormulaire} />}
        </div>
    );
}

export default Dashboard;