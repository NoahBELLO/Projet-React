import FormulaireApi from './FormulaireApi';
import FormulaireMiddleware from './FormulaireMiddleware';

function Formulaire({ choixFormulaire }) {
    return (
        <div>
            {choixFormulaire === 'formulaireAPI' && (<FormulaireApi />)}
            {choixFormulaire === 'formulaireMiddleware' && (<FormulaireMiddleware />)}
        </div>
    );
}

export default Formulaire;