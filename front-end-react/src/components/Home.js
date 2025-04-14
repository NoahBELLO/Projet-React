import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container">
            <h1>Bienvenue sur la page d'accueil</h1>
            <p>
                <Link to="/dashboard" className="lien">Aller au dashboard</Link>
            </p>
        </div>
    );
}

export default Home;
