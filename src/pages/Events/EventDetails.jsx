import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import arrow from '../../assets/images/arrow-left.svg';
import { MdCalendarMonth, MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { formatEventDate, formatEventTime } from '../../utils/dateUtils';
import Loading from '../../components/Loading';
import ConfirmAttendance from './ConfirmAttendance';
import ContactItem from '../../components/ContactItem';
import AuthModal from '../LogIn/AuthModal';

const EVENTS_COLLECTION = import.meta.env.VITE_EVENTS_COLLECTION || 'events';
const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION || 'users';

const EventDetails = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  const { currentUser } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const eventDoc = doc(db, EVENTS_COLLECTION, eventId);
      const eventSnap = await getDoc(eventDoc);
      
      if (eventSnap.exists()) {
        const eventData = { id: eventSnap.id, ...eventSnap.data() };
        setEvent(eventData);

        if (eventData.attendeeList && eventData.attendeeList.length > 0) {
          await fetchAttendees(eventData.attendeeList);
        } else {
          setAttendees([]); // Clear attendees if none
        }
      } else {
        console.log('No such event');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchAttendees = async (attendeeIds) => {
    try {
      const attendeePromises = attendeeIds.map(async (userId) => {
        const userDoc = doc(db, USERS_COLLECTION, userId);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          return { id: userSnap.id, ...userSnap.data() };
        }
        return null;
      });

      const attendeeResults = await Promise.all(attendeePromises);
      const validAttendees = attendeeResults.filter(attendee => attendee !== null);
      setAttendees(validAttendees);
    } catch (error) {
      console.error('Error fetching attendees:', error)
    }
  };

  const handleConfirm = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const eventDoc = doc(db, EVENTS_COLLECTION, eventId);

      if (isUserSignedUp) {
        await updateDoc(eventDoc, {
          attendeeList: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(eventDoc, {
          attendeeList: arrayUnion(currentUser.uid)
        });
      }

      await fetchEvent();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error signing up for event:', error);
    }
  };

  const handleShowModal = () => {
    if (currentUser) {
      setShowConfirmModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const isUserSignedUp = event?.attendeeList?.includes(currentUser?.uid);
  const isEventFull = !isUserSignedUp && event.attendeeLimit && event.attendeeList?.length >= event.attendeeLimit;

  return (
    <>
      <div className='event-details'>
        <div className='return-events'>
          <img src={arrow} alt='arrow icon' className='back-arrow' onClick={() => navigate('/events')} />
          <div onClick={() => navigate('/events')}>Events List</div>
        </div>
        <div className='event-details-column'>
          <div className='details-column'>
            <h1>{event.title}</h1>
            <div style={{marginBottom: '2.5rem'}}>
              <div className='details-icon'>
                <MdCalendarMonth size={30}/>
                <div>
                  {formatEventDate(event.startTime)}
                </div>
              </div>
              <div className='details-icon'>
                <MdAccessTime size={30} />
                <div>{formatEventTime(event.startTime, event.endTime)}</div>
              </div>
              <div className='details-icon'>
                <MdOutlineLocationOn size={30} />
                <div>{event.location}</div>
              </div>
            </div>
            <div>
              {event.description}
            </div>
          </div>

          <div className='attendees-column'>
            <div className='attendees-header'>
              <div className='attendees-title'>
                <h1>Attendees</h1>
                <div>{event.attendeeLimit ? `(${event.attendeeList ? event.attendeeList.length : 0}/${event.attendeeLimit})` : null}</div>
              </div>
              <div className={`button ${isEventFull ? 'disabled' : ''}`} onClick={handleShowModal}>
                {isEventFull ? 'Event Full' : isUserSignedUp ? 'Remove RSVP' : 'Sign Up'}
              </div>
            </div>

            <div className='attendees-list'>
              {attendees.length === 0 ? (
                <div>No attendees yet...</div>
              ) : (
                attendees.map(attendee => (
                  <ContactItem 
                    key={attendee.id}
                    user={attendee}
                    isExec={false}
                  />
                ))
              )}
            </div>

            <ConfirmAttendance
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={handleConfirm}
              isUserSignedUp={isUserSignedUp}
            />
          </div>
        </div>
      </div>

      <AuthModal 
					isOpen={showAuthModal} 
					onClose={() => setShowAuthModal(false)} 
			/>
    </>
);
};

export default EventDetails;
