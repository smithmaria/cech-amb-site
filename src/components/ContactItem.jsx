import bingo from '../assets/images/bingo.jpg';

const ContactItem = ({user, isExec}) => {
  console.log('member from item');
  console.log(user);
  console.log(user.firstName);

  return (
    <div className='contact-item'>
      <img src={bingo} alt='headshot' />
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