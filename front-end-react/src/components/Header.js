import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <header className="Header">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className="lien">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className="lien">Dashboard</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;