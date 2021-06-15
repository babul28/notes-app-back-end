const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NoteService = require('./services/inMemory/NoteService');

const init = async () => {
  const notesService = new NoteService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '172.31.31.134',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
