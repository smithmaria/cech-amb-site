import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';
import logo from '/CECH-Logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../ProfileIcon';
import AuthModal from '../../pages/LogIn/AuthModal';
import SettingsModal from './SettingsModal';
import { logoutUser } from '../../services/userService';

const Navbar = () => {
	const { currentUser } = useAuth();
	console.log('current user');
	console.log(currentUser);
	console.log(JSON.stringify(currentUser, null, 2));
	console.log('Profile picture URL:', currentUser?.profilePictureURL);
	const currentPath = window.location.pathname;
	const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	console.log();

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<div className='navbar-pages'>
					<img src={logo} alt="Logo" className="navbar-logo" onClick={() => navigate('/')} />
					
					<a href="/" className={`navbar-item ${currentPath === '/' ? 'active' : ''}`}>Home</a>
					<a href="/events" className={`navbar-item ${currentPath.startsWith('/events') ? 'active' : ''}`}>Events</a>
					<a href="/members" className={`navbar-item ${currentPath.startsWith('/members') ? 'active' : ''}`}>Members</a>
					<a href="/apply" className={`navbar-item ${currentPath === '/apply' ? 'active' : ''}`}>Apply</a>
				</div>
				<div className='navbar-login'>
					{currentUser ? 
						<ProfileIcon
						src={currentUser?.profilePictureURL}
						size="medium"
						onClick={logoutUser}
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
