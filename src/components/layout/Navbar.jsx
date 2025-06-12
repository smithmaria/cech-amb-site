import './Navbar.css';
import logo from '/CECH-Logo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const currentPath = window.location.pathname;
	const navigate = useNavigate();

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<img src={logo} alt="Logo" className="navbar-logo" onClick={() => navigate('/')} />
				
				<a href="/" className={`navbar-item ${currentPath === '/' ? 'active' : ''}`}>Home</a>
				<a href="/events" className={`navbar-item ${currentPath.startsWith('/events') ? 'active' : ''}`}>Events</a>
				<a href="/members" className={`navbar-item ${currentPath.startsWith('/members') ? 'active' : ''}`}>Members</a>
				<a href="/apply" className={`navbar-item ${currentPath === '/apply' ? 'active' : ''}`}>Apply</a>
			</div>
		</nav>
	);
}

export default Navbar;
