// Helpers
const axios = require('axios');

// DB
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// Server
const fastify = require('fastify')({
  logger: true
});

const postInSlack = (lunches) => {
  let msg = [];
  lunches.forEach(lunch => {
    msg.push(`${lunch.username} chce iść do ${lunch.place} o godzinie ${lunch.time}`);
  });

  axios.post(webhookUrl, { text: msg.join("\n") })
    .then(response => console.log(response.body))
    .catch(console.log)

  return new Promise((resolve, reject) => {
    resolve(lunches);
  });
};

const adapter = new FileAsync('db.json');
low(adapter)
  .then(db => {
    fastify.get('/places', (request, reply) => {
      const places = db.get('lunches').map('place').uniq().value();

      reply.send({ places });
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
