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
  const endHour = endTime.getHours();
  const endPeriod = endHour >= 12 ? 'pm' : 'am';
  
  const formatHour = (hour) => hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  const startFormatted = formatHour(startHour);
  const endFormatted = formatHour(endHour);
  
  return `${startFormatted}-${endFormatted}${endPeriod}`;
};