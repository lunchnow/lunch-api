const _ = require('lodash');

const prepareMessage = (lunches) => {
  const places = lunches.reduce((acc, lunch) => {
    const line = `${lunch.username} (${lunch.time})`;
    acc[lunch.place] = acc[lunch.place] ? _.concat(acc[lunch.place], line) : [line];

    return acc;
  }, {});

  const finalMessage = Object.keys(places).reduce((acc, place) => {
    return _.concat(acc, `${place}: ${places[place].join(', ')}`);
  }, []);

  return finalMessage.join("\n");
};

module.exports = {
  forSlack: prepareMessage
}
