export const formatDate = (date) => {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatRelativeTime = (date, locale = navigator.language) => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const updated = new Date(date);
  const seconds = Math.floor((now - updated) / 1000);

  const ranges = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, value] of Object.entries(ranges)) {
    const delta = Math.floor(seconds / value);
    if (delta !== 0) {
      return rtf.format(-delta, unit); // negative means "ago"
    }
  }

  return rtf.format(0, 'second');
};
