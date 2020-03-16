const getTodaysLunches = (db) => {
  const interval = 1000 * 60 * 60 * 24; // 24 hours
  const startOfDay = Math.floor(Date.now() / interval) * interval;
  const endOfDay = startOfDay + interval - 1;

  return db.get('lunches')
    .filter(lunch => startOfDay <= lunch.id && lunch.id <= endOfDay)
    .value();
};

const prepareParams = (userName, params) => {
  const dateNow = Date.now().toString();
  const commonData = {
    id: dateNow,
    time: params.time,
    username: userName,
    timestamp: dateNow
  };

  return params.places.map(place => ({ ...commonData, place }));
};

const insertLunches = (db, userName, params) => {
  return db.get('lunches')
    .push(...prepareParams(userName, params))
    .write();
};

const insertLunch = (db, params) => {
  const userName = params.username;
  const attributes = { time: params.time, places: [params.place] };

  return insertLunches(db, userName, attributes);
};

module.exports = {
  getTodaysLunches,
  insertLunches,
  insertLunch
};
