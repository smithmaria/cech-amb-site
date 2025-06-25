import { formatEventDate, formatEventTime } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const EventsTable = ({ events }) => {
  const navigate = useNavigate();

  const handleRowClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (events.length === 0) {
    return <div className='no-events'>No events to show</div>;
  }

  return (
    <table className='table'>
      <thead>
        <tr className='table-header'>
          <th style={{width: '26%'}}>Title</th>
          <th style={{width: '24%'}}>Date</th>
          <th style={{width: '16%'}}>Time</th>
          <th style={{width: '24%'}}>Location</th>
          <th style={{width: '10%'}}>Signed Up</th>
        </tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr 
            key={event.id}
            className='table-row event-row'
            onClick={() => handleRowClick(event.id)}
          >
            <td>{event.title}</td>
            <td>{formatEventDate(event.startTime)}</td>
            <td>{formatEventTime(event.startTime, event.endTime)}</td>
            <td>{event.location}</td>
            <td>
              {event.attendeeList ? event.attendeeList.length : 0}
              {event.attendeeLimit && `/${event.attendeeLimit}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EventsTable;