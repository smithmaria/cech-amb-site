import './Events.css';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import EventsTable from '../../components/EventsTable';
import Loading from '../../components/Loading';

const EVENTS_COLLECTION = import.meta.env.VITE_EVENTS_COLLECTION || 'events';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pastEventsFilter, setPastEventsFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, EVENTS_COLLECTION);
        const q = query(eventsRef, orderBy('startTime', 'asc')); 
        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (!filter) return true;
    return event.targetMajors && event.targetMajors.includes(filter);
  });

  const filteredPastEvents = events.filter(event => {
    if (!pastEventsFilter) return true;
    return event.targetMajors && event.targetMajors.includes(pastEventsFilter);
  });

  const now = new Date();
  const futureEvents = filteredEvents.filter(event => 
    event.endTime && event.endTime.toDate() > now
  );
  const pastEvents = filteredPastEvents.filter(event => 
    event.endTime && event.endTime.toDate() <= now
  );

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className='page'>
      <div>
        <div className='events-title'>
          <h1>Events</h1>
          <div>
            Filter:
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className='events-filter'
            >
              <option value="">All Majors</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Education">Education</option>
              <option value="Criminal Justice">Criminal Justice</option>
              <option value="Human Services">Human Services</option>
            </select>
          </div>
        </div>
        <EventsTable 
          events={futureEvents}
        />
      </div>
      
      <div>
        <div className='events-title past-events-title'>
          <h1>Past Events</h1>
          <div>
            Filter:
            <select 
              value={pastEventsFilter} 
              onChange={(e) => setPastEventsFilter(e.target.value)}
              className='events-filter'
            >
              <option value="">All Majors</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Education">Education</option>
              <option value="Criminal Justice">Criminal Justice</option>
              <option value="Human Services">Human Services</option>
            </select>
          </div>
        </div>
        <EventsTable 
          events={pastEvents}
        />
      </div>
    </div>
  );
 }

 export default Events;
