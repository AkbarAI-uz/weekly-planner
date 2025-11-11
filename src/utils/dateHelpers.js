// Date utility functions

export function formatDate(date, format = 'MM/DD/YYYY') {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  const formats = {
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'MMM DD, YYYY': d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    'MMMM DD, YYYY': d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };

  return formats[format] || formats['MM/DD/YYYY'];
}

export function formatTime(date, format = '12h') {
  const d = new Date(date);
  
  if (format === '24h') {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // 12h format
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function getWeekNumber(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

export function getWeekId(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const week = getWeekNumber(d);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function getWeekDateRange(weekId) {
  // Parse "YYYY-Www" format
  const [year, weekStr] = weekId.split('-W');
  const week = parseInt(weekStr);

  // Calculate first day of the week (Monday)
  const jan4 = new Date(year, 0, 4);
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1 + (week - 1) * 7);

  // Calculate last day (Sunday)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday,
    end: sunday,
    startFormatted: formatDate(monday, 'MMM DD'),
    endFormatted: formatDate(sunday, 'MMM DD, YYYY')
  };
}

export function getDayName(dayIndex, format = 'long') {
  const days = {
    long: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    narrow: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  };

  return days[format][dayIndex] || days.long[dayIndex];
}

export function isToday(date) {
  const today = new Date();
  const d = new Date(date);
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
}

export function isThisWeek(date) {
  const weekId = getWeekId(new Date());
  const dateWeekId = getWeekId(date);
  return weekId === dateWeekId;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}

export function differenceInDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function differenceInWeeks(date1, date2) {
  return Math.floor(differenceInDays(date1, date2) / 7);
}

export function getRelativeTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return formatDate(d, 'MMM DD, YYYY');
}

export function parseTimeString(timeStr) {
  // Parse "9:00 AM" or "21:00" format
  const time12hRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
  const match = timeStr.match(time12hRegex);

  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  return { hours, minutes };
}

export function compareTimeStrings(time1, time2) {
  const t1 = parseTimeString(time1);
  const t2 = parseTimeString(time2);

  if (!t1 || !t2) return 0;

  const mins1 = t1.hours * 60 + t1.minutes;
  const mins2 = t2.hours * 60 + t2.minutes;

  return mins1 - mins2;
}