import './Members.css';
import headshot from '../../assets/images/maria-headshot.jpg';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ContactItem from '../../components/ContactItem';

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersRef = collection(db, 'users');
        const q = query(membersRef, where('isMember', '==', true));
        const snapshot = await getDocs(q);
        const membersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('users');
        console.log(membersData);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchMembers();
  }, []);

  return (
    <div className='page'>
      <h1>Exec Board</h1>
      <div className='member-list'>
        <div className='contact-item'>
          <img src={headshot} alt='headshot' />
          <div>
            <div className='contact-name'>Maria Smith</div>
            <div><i>President</i></div>
            <a href='mailto:smit9mt@mail.uc.edu'>smit9mt@mail.uc.edu</a>
          </div>
        </div>
      </div>
      <h1 style={{marginTop: '5rem'}}>Members</h1>
      {members.length === 0 ? (
            <div>No members to show</div>
          ) : (
            <div className='member-list'>
              {members.map(member => (
                <ContactItem 
                  user={member}
                  isExec={false}
                />
              ))}
            </div>
          )
        }
    </div>
  );
 }

 export default Members;
