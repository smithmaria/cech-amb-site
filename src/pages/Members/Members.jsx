import './Members.css';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ContactItem from '../../components/ContactItem';
import Loading from '../../components/Loading';

const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION || 'users';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [execMembers, setExecMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const membersRef = collection(db, USERS_COLLECTION);

        const membersQuery = query(
          membersRef,
          where('isMember', '==', true),
          where('isExec', '==', false),
          where ('isApproved', '==', true)
        );
        const membersSnapshot = await getDocs(membersQuery);
        const membersData = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const execQuery = query(
          membersRef,
          where('isMember', '==', true),
          where('isExec', '==', true),
          where ('isApproved', '==', true)
        );
        const execSnapshot = await getDocs(execQuery);
        const execData = execSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setMembers(membersData);
        setExecMembers(execData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className='page'>
      <h1>Exec Board</h1>
        {execMembers.length === 0 ? (
              <div>No executive members to show</div>
            ) : (
              <div className='member-list'>
                {execMembers.map(exec => (
                  <ContactItem 
                    user={exec}
                    isExec={true}
                  />
                ))}
              </div>
            )
        }
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
