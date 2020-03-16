const getTodaysLunches = (db) => {
  const interval = 1000 * 60 * 60 * 24; // 24 hours
  const startOfDay = Math.floor(Date.now() / interval) * interval;
  const endOfDay = startOfDay + interval - 1;

  return db.get('lunches')
    .filter(lunch => startOfDay <= lunch.id && lunch.id <= endOfDay)
    .value();
};

module.exports = {
  getTodaysLunches: getTodaysLunches
};
