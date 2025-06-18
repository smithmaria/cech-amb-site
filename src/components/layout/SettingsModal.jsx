import { MdOutlineAccountBox, MdOutlineAdminPanelSettings } from "react-icons/md";
import ProfileIcon from "../ProfileIcon";

const SettingsModal = ({ isOpen, onClose, currentUser }) => {

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
              src={currentUser.profilePictureURL}
              size="medium"
            />
            <div className="settings-modal-profile-info">
              <h3>{currentUser.firstName} {currentUser.lastName}</h3>
              <p>{currentUser.isAdmin ? 'Administrator' : 'Member'}</p>
            </div>
          </div>
        </div>

        <div className="settings-modal-nav">
          <nav className="settings-modal-nav-list">
            <a
              href="/account"
              className="settings-modal-nav-link settings-modal-nav-link--account"
            >
              <span className="settings-modal-nav-icon">
                <MdOutlineAccountBox size={30}/>
              </span>
              <span className="settings-modal-nav-text">Account Info</span>
            </a>

            {currentUser.isAdmin && (
              <a
                href="/admin"
                className="settings-modal-nav-link settings-modal-nav-link--admin"
              >
                <span className="settings-modal-nav-icon">
                  <MdOutlineAdminPanelSettings size={30} />
                </span>
                <span className="settings-modal-nav-text">Admin Panel</span>
              </a>
            )}
          </nav>
        </div>
      </div>
    </>
  );
 }

 export default SettingsModal;
 