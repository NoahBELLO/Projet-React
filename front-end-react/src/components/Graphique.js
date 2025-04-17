import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Graphique({ donnee }) {
    return (
        <div className="graphique">
            <Pie data={donnee} />
        </div>
    );
}

export default Graphique;