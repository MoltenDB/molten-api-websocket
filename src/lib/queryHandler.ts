
const queries = ['collection', 'create', 'read', 'update', 'delete'];

/**
 * Handles query messages
 */
const createQueryHandler = (mdb: MDB.MDBInstace,
    options: MDB.MoltenSocketOptions, socket: SocketIO.Socket) => {
  const sendError = (error) => {
    socket.emit(`${options.eventBaseName}result`, {
      id: data.id,
      code: 500,
      error: error.message
    });
  };

  return (data: MDB.API.WebSocket.QueryData): void => {
    if (data.type && queries.indexOf(data.type) !== -1) {
      //TODO Permission checking

      if (typeof data.collection !== 'string') {
        socket.emit(`${options.eventBaseName}result`, {
          id: data.id,
          code: 400,
          error: 'Collection not given'
        });
        return;
      }

      // Check the table exists
      mdb.collection(data.collection).then((collection) => {
        if (!collection) {
          socket.emit(`${options.eventBaseName}result`, {
            id: data.id,
            code: 404,
            error: 'Collection not found'
          });
          return;
        }

        let resultPromise;

        switch(data.type) {
          case 'collection':
            socket.emit(`${options.eventBaseName}result`, {
              id: data.id,
              collectionOptions: collection.options()
            });
            return;
          case 'create':
            if (!data.data) {
              socket.emit(`${options.eventBaseName}result`, {
                id: data.id,
                code: 400,
                error: 'Require data to save'
              });
              return;
            }

            resultPromise = collection.create(data.data);
            break;
          case 'read':
            resultPromise = collection.read(data.filter, data.options).then(results => {
              let response = {
                id: data.id,
                code: 200,
                results: results.raw(),
                length: results.length
              };

              if (data.includeCollection) {
                response.collectionOptions = collection.options()
              }

              socket.emit(`${options.eventBaseName}result`, response);
            }, sendError);
            return;
          case 'update':
            if (!data.data) {
              socket.emit(`${options.eventBaseName}result`, {
                id: data.id,
                code: 400,
                error: 'Require data to save'
              });
              return;
            }

            if (data.data instanceof Array) {
              if (typeof data.filter !== 'undefined') {
                socket.emit(`${options.eventBaseName}result`, {
                  id: data.id,
                  code: 400,
                  error: 'Can\'t use filter with an array of items to update'
                });
                return;
              }
            } else if (data.data instanceof Object && typeof data.filter === 'undefined') {
              socket.emit(`${options.eventBaseName}result`, {
                id: data.id,
                code: 400,
                error: 'Must provide a filter of null to update all items'
              });
              return;
            }

            resultPromise = collection.update(data.data, data.filter);
            break;
          case 'delete':
            resultPromise = collection.read(data.filter, data.options);
            break;
        }

        resultPromise.then((results) => {
          socket.emit(`${options.eventBaseName}result`, {
            id: data.id,
            code: 200,
            results
          });
        }, sendError);

        return;
      });
    } else {
      socket.emit(`${options.eventBaseName}result`, {
        id: data.id,
        code: 400,
        error: 'Unknown query'
      });
    }
  };
};
export default createQueryHandler;
