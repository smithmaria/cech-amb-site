import { MdOutlineAccountBox, MdOutlineAdminPanelSettings, MdLogout } from "react-icons/md";
import ProfileIcon from "../ProfileIcon";
import { logoutUser } from '../../services/userService';
import { Link, useNavigate } from "react-router-dom";

const SettingsModal = ({ isOpen, onClose, currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    navigate(`/`);
    logoutUser();
  };

  return (
    <>
      <div
        className={`settings-modal-backdrop ${
          isOpen ? 'settings-modal-backdrop--open' : 'settings-modal-backdrop--closed'
        }`}
        onClick={onClose}
      />
      
      <div className={`settings-modal-menu ${
        isOpen ? 'settings-modal-menu--open' : ''
      }`}>
        
        <div className="settings-modal-header">
          <h2 className="settings-modal-title">Menu</h2>
          <button
            onClick={onClose}
            className="settings-modal-close-btn"
          >
            <span className="settings-modal-close-icon">✕</span>
          </button>
        </div>

        <div className="settings-modal-profile">
          <div className="settings-modal-profile-content">
            <ProfileIcon 
              src={currentUser?.profilePictureURL}
              size="medium"
            />
            <div className="settings-modal-profile-info">
              <h3>{currentUser?.firstName} {currentUser?.lastName}</h3>
              <p>{currentUser?.isAdmin ? 'Administrator' : 'Member'}</p>
            </div>
          </div>
        </div>

        <div className="settings-modal-nav">
          <nav className="settings-modal-nav-list">
            <Link
              to="/account"
              className="settings-modal-nav-link settings-modal-nav-link--account"
              onClick={onClose}
            >
              <span className="settings-modal-nav-icon">
                <MdOutlineAccountBox size={30}/>
              </span>
              <span className="settings-modal-nav-text">Account Info</span>
            </Link>

            {currentUser?.isAdmin && (
              <Link
                to="/admin"
                className="settings-modal-nav-link settings-modal-nav-link--admin"
                onClick={onClose}
              >
                <span className="settings-modal-nav-icon">
                  <MdOutlineAdminPanelSettings size={30} />
                </span>
                <span className="settings-modal-nav-text">Admin Panel</span>
              </Link>
            )}

            <a className="settings-modal-nav-link settings-modal-nav-link--logout" onClick={handleLogout} >
              <span className="settings-modal-nav-icon">
                <MdLogout size={30} />
              </span>
              <span className="settings-modal-nav-text">Logout</span>
            </a>

          </nav>
        </div>
      </div>
    </>
  );
 }

 export default SettingsModal;
 