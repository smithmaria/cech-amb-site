import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import arrow from '../../assets/images/arrow-left.svg';
import calendar from '../../assets/images/calendar.svg';
import clock from '../../assets/images/clock.svg';
import location from '../../assets/images/location-pin.svg';
import { formatEventDate, formatEventTime } from '../../utils/dateUtils';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventDoc);
        
        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() });
        } else {
          console.log('No such event');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <div className='loading-page'>Loading event details...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className='event-details'>
      <div className='return-events' onClick={() => navigate('/events')}>
        <img src={arrow} alt='arrow icon' className='back-arrow' />
        <div>Events List</div>
      </div>
      <div className='event-details-column'>
        <div className='details-column'>
          <h1>{event.title}</h1>
          <div style={{marginBottom: '2.5rem'}}>
            <div className='details-icon'>
              <img src={calendar} alt='calendar icon' />
              <div>
                {formatEventDate(event.startTime)}
              </div>
            </div>
            <div className='details-icon'>
              <img src={clock} alt='calendar icon' />
              <div>{formatEventTime(event.startTime, event.endTime)}</div>
            </div>
            <div className='details-icon'>
              <img src={location} alt='location pin' />
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
              <div>{event.attendeeLimit ? `(${event.attendees ? event.attendees.length : 0}/${event.attendeeLimit})` : null}</div>
            </div>
            <div className='button'>
              Sign Up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
