// Helpers
const axios = require('axios');
const fs = require('fs');
const YAML = require('yaml');
const _ = require('lodash');

const messageFormatter = require('./lib/messageFormatter');

// DB
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// Server
const fastify = require('fastify')({
  logger: true
});

const postInSlack = (lunches) => {
  axios.post(process.env.SLACK_WEBHOOK_URL, { text: messageFormatter.forSlack(lunches) })
    .then(response => console.log(response.status))
    .catch(console.log)

  return new Promise((resolve, reject) => {
    resolve(lunches);
  });
};

const adapter = new FileAsync('./db.json');
low(adapter)
  .then(db => {
    fastify.get('/places', (request, reply) => {
      const places = YAML.parse(fs.readFileSync('./places.yml', 'utf8')).places;
      const dbPlaces = db.get('lunches').map('place').value();

      reply.send({ places: _.uniq(_.concat(places, dbPlaces)) });
    })

    fastify.get('/lunches', (request, reply) => {
      const lunches = db.get('lunches').value();

      postInSlack(lunches).then(lunches => reply.send({ lunches }));
    })

    fastify.post('/lunches', (request, reply) => {
      db.get('lunches')
        .push(request.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(lunch => postInSlack([lunch]))
        .then(lunches => reply.send(lunches[0]))
    })

    return db.defaults({ lunches: [] }).write();
  })
  .then(() => {
    fastify.listen(2700, (err, address) => {
      if (err) throw err;

      fastify.log.info(`Server listening on ${address}`);
    })
  });
