import { formatEventDate, formatEventTime } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const EventsTable = ({ events }) => {

  const navigate = useNavigate();

  const handleRowClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <>
      <div className='events-table'>
        <div className='table-row table-header'>
          <div style={{width: '26%'}}>Title</div>
          <div style={{width: '24%'}}>Date</div>
          <div style={{width: '16%'}}>Time</div>
          <div style={{width: '24%'}}>Location</div>
          <div style={{width: '10%'}}>Signed Up</div>
        </div>
        {events.length === 0 ? ( 
          <div className='no-events'>No events to show</div>
        ) : (
          events.map(event => (
          <div 
            key={event.id}
            className='table-row event-row'
            onClick={() => handleRowClick(event.id)}>
            <div style={{width: '26%'}}>{event.title}</div>
            <div style={{width: '24%'}}>{formatEventDate(event.startTime)}</div>
            <div style={{width: '16%'}}>{formatEventTime(event.startTime, event.endTime)}</div>
            <div style={{width: '24%'}}>{event.location}</div>
            <div style={{width: '10%'}}>
              {event.attendeeList ? event.attendeeList.length : 0}
              {event.attendeeLimit && `/${event.attendeeLimit}`}
            </div>
          </div>          
        )))}
      </div>
    </>
  );
};

export default EventsTable;
