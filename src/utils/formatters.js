// Data formatting utilities

export function formatNumber(num, decimals = 0) {
  return Number(num).toFixed(decimals);
}

export function formatPercentage(value, total, decimals = 0) {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${formatNumber(percentage, decimals)}%`;
}

export function formatCalories(calories) {
  return `${formatNumber(calories)} cal`;
}

export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatTaskCount(completed, total) {
  return `${completed}/${total}`;
}

export function formatWaterGlasses(count, goal = 8) {
  return `${count}/${goal} glasses`;
}

export function truncateText(text, maxLength = 100, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || `${singular}s`);
}

export function formatCount(count, singular, plural) {
  return `${count} ${pluralize(count, singular, plural)}`;
}

export function formatCategoryLabel(category) {
  const labels = {
    work: '💼 Work',
    personal: '👤 Personal',
    health: '🏃 Health',
    general: '📋 General'
  };
  return labels[category] || capitalizeWords(category);
}

export function formatMealTypeLabel(mealType) {
  const labels = {
    breakfast: '🌅 Breakfast',
    lunch: '☀️ Lunch',
    dinner: '🌙 Dinner',
    snack: '🍎 Snack'
  };
  return labels[mealType] || capitalizeWords(mealType);
}

export function formatCompletionStatus(completed, total) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  let emoji = '📊';
  
  if (percentage === 100) emoji = '🎉';
  else if (percentage >= 80) emoji = '⭐';
  else if (percentage >= 60) emoji = '👍';
  else if (percentage >= 40) emoji = '📈';

  return `${emoji} ${percentage}%`;
}

export function formatScore(score) {
  if (score >= 90) return { text: 'Excellent', color: '#48bb78', emoji: '🔥' };
  if (score >= 75) return { text: 'Great', color: '#48bb78', emoji: '⭐' };
  if (score >= 60) return { text: 'Good', color: '#ed8936', emoji: '👍' };
  if (score >= 40) return { text: 'Fair', color: '#f6ad55', emoji: '📈' };
  return { text: 'Needs Improvement', color: '#e53e3e', emoji: '💪' };
}

export function formatWeekId(weekId) {
  const [year, week] = weekId.split('-W');
  return `Week ${parseInt(week)}, ${year}`;
}

export function formatBackupName(filename) {
  // Parse "backup-2024-11-10T12-30-00.json"
  const match = filename.match(/backup-(.+)\.json/);
  if (!match) return filename;

  const dateStr = match[1].replace(/T/, ' ').replace(/-/g, ':');
  return dateStr;
}

export function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export function formatListWithCommas(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(', ');
  return `${rest}, and ${last}`;
}

export function formatRange(min, max, unit = '') {
  if (min === max) return `${min}${unit}`;
  return `${min}-${max}${unit}`;
}