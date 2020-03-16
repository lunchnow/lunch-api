const adjustHour = (hour) => {
  return hour;
}

const parseValid = (matches) => {
  const hour = matches[1];
  const places = matches[2];

  return { hour: adjustHour(hour), places: places.split(' ') };
};

const perform = (text) => {
  if (text.length === 0) return { valid: true };

  const regexp = /(\d{1,2}:?\d{0,2}) ([A-Za-z0-9 ]+)/
  const matches = text.match(regexp);

  if (matches) {
    return { valid: true, params: parseValid(matches) };
  } else {
    return { valid: false };
  }
};

module.exports = {
  perform: perform
};
