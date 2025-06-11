import './Navbar.css';
import logo from '/CECH-Logo.png';

const Navbar = () => {
	const currentPath = window.location.pathname;

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<img src={logo} alt="Logo" className="navbar-logo" />
				
				<a href="/" className={`navbar-item ${currentPath === '/' ? 'active' : ''}`}>Home</a>
				<a href="/events" className={`navbar-item ${currentPath === '/events' ? 'active' : ''}`}>Events</a>
				<a href="/members" className={`navbar-item ${currentPath === '/members' ? 'active' : ''}`}>Members</a>
				<a href="/apply" className={`navbar-item ${currentPath === '/apply' ? 'active' : ''}`}>Apply</a>
			</div>
		</nav>
	);
}

export default Navbar;
