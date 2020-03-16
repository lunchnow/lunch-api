const adjustHour = (hour) => {
  if (hour.includes(':')) return hour;

  if (hour.length === 2) {
    return hour + ':00';
  } else if (hour.length === 3) {
    return hour[0] + ':' + hour.slice(1);
  } else {
    return hour.slice(0, 2) + ':' + hour.slice(2);
  }
}

const parseValid = (matches) => {
  const hour = matches[1];
  const places = matches[2];

  return { time: adjustHour(hour), places: places.split(', ') };
};

const perform = (text) => {
  if (text.length === 0) return { valid: true };

  const regexp = /(\d{2,4}|\d{1,2}:\d{2}) ([A-Za-z0-9\, ]+)/
  const matches = text.match(regexp);

  if (matches) {
    return { valid: true, params: parseValid(matches) };
  } else {
    return { valid: false };
  }
};

module.exports = {
  perform
};
