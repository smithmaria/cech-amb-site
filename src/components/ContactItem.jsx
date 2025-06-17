import ProfileIcon from './ProfileIcon';

const ContactItem = ({user, isExec}) => {
  return (
    <div className='contact-item'>
      <ProfileIcon
        src={user.profilePictureURL}
        alt="headshot"
        size="large"
        showBorder={false}
      />
      <div>
        <div className='contact-name'>{`${user.firstName} ${user.lastName}`}</div>
        {isExec ?
          <div>{user.position}</div>
          : null
        }
        <div><i>{user.generalMajor?.join(', ')}</i></div>
        <a href={`mailto:${user.email}`}>{user.email}</a>
      </div>
    </div>
  );
};

export default ContactItem;