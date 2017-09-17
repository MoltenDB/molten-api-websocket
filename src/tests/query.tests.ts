import test from 'ava';

import { initiateServer } from './lib/initiateServer';

test.beforeEach(async t => {
  Object.assign(t.context, await initiateServer());
});

test.cb('should return an error object if the data is not an object', t => {
  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.code, 400);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, 'blah');
});

test.cb('should return a 400 error object if the query is not known', t => {
  const badQuery = {
    id: 'bad',
    type: 'bad'
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, badQuery.id);
    t.is(message.code, 400);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, badQuery);
});
