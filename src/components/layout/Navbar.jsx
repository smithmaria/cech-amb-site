import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';
import logo from '/CECH-Logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../ProfileIcon';
import AuthModal from '../../pages/LogIn/AuthModal';
import SettingsModal from './SettingsModal';

const Navbar = () => {
	const { currentUser } = useAuth();
	const currentPath = window.location.pathname;
	const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<div className='navbar-pages'>
					<img src={logo} alt="Logo" className="navbar-logo" onClick={() => navigate('/')} />
					
					<Link to="/" className={`navbar-item ${currentPath === '/' ? 'active' : ''}`}>Home</Link>
					<Link to="/events" className={`navbar-item ${currentPath.startsWith('/events') ? 'active' : ''}`}>Events</Link>
					<Link to="/members" className={`navbar-item ${currentPath.startsWith('/members') ? 'active' : ''}`}>Members</Link>
					<Link to="/apply" className={`navbar-item ${currentPath === '/apply' ? 'active' : ''}`}>Apply</Link>
				</div>
				<div className='navbar-login'>
					{currentUser ? 
						<ProfileIcon
						src={currentUser?.profilePictureURL}
						size="medium"
						onClick={() => setShowSettings(true)}
						className="navbar-profile-icon"
					/>
						: (
							<button className='button' onClick={() => setShowAuthModal(true)}>Sign In</button>
						)
					}
				</div>
				<SettingsModal 
					isOpen={showSettings}
					onClose={() => setShowSettings(false)}
					currentUser={currentUser}
				/>
				<AuthModal 
					isOpen={showAuthModal} 
					onClose={() => setShowAuthModal(false)} 
				/>
			</div>
		</nav>
	);
}

export default Navbar;
