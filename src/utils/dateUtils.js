export const formatEventDate = (startTimeTimestamp) => {
  if (!startTimeTimestamp) return 'TBD';
  return startTimeTimestamp.toDate().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatEventTime = (startTimeTimestamp, endTimeTimestamp) => {
  if (!startTimeTimestamp || !endTimeTimestamp) return 'TBD';
  
  const startTime = startTimeTimestamp.toDate();
  const endTime = endTimeTimestamp.toDate();
  
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();
  const endPeriod = endHour >= 12 ? 'pm' : 'am';
  
  const formatHour = (hour) => hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const formatTime = (hour, minutes) => {
    const formattedHour = formatHour(hour);
    return minutes === 0 ? formattedHour : `${formattedHour}:${minutes.toString().padStart(2, '0')}`;
  };
  
  const startFormatted = formatTime(startHour, startMinutes);
  const endFormatted = formatTime(endHour, endMinutes);
  
  return `${startFormatted}-${endFormatted}${endPeriod}`;
 };
 