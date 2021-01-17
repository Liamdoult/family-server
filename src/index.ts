import api from './api';
import { defaultPort } from './api';
import { dbClient } from './database';

// start the Express server
// Mongo needs to be started before express to ensure mongo is always running
// when requests are made to the server.
dbClient.connect().then(() => {
  console.log('Mongo Connected at http://localhost:27017');
  api.listen(defaultPort, () => {
    console.log(`Server started at http://localhost:${defaultPort}`);
  });
});
