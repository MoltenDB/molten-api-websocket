declare namespace MDB.API.WebSocket {
  export type SocketQueryType = 'collection'
      | 'create'
      | 'read'
      | 'update'
      | 'delete'
      | 'createCollection'
      | 'updateCollection'
      | 'deleteCollection';

  /// Data object for a query
  export interface Query {
    id?: string | number,
    type: string
  };

  export interface CollectionQuery extends Query {
    collection: string
  };

  export interface CreateQuery extends CollectionQuery {
    type: 'create',
    data: MDB.Data[]
  };

  export interface FilterQuery extends CollectionQuery {
    filter?: MDB.Filter
  };

  export interface ReadQuery extends FilterQuery {
    type: 'read',
    options?: MDB.FilterOptions,
    includeCollection: boolean
  };

  export interface UpdateQuery extends FilterQuery {
    type: 'update',
    data: MDB.Data | MDB.Data
  };

  export interface DeleteQuery extends FilterQuery {
    type: 'delete'
  };

  export type QueryData = CollectionQuery
    | CreateQuery
    | ReadQuery
    | UpdateQuery
    | DeleteQuery;

  export interface ResultResponse {
    code: number,
    results?: any[]
  };

  /// Options that can be passed to MoltenWebSocket
  export interface MoltenWebSocketOptions {
    /** Instance of MoltenDB library to server data from
     */
    moltenInstance: MDB.MoltenDBInstance,
    /** An existing SocketIO server to listen on. If not given, a new SocketIO
     *  server will be created */
    socketServer?: SocketIO.Server,
    /** If an existing SocketIO server is not given, the HTTP server to attach
     *  the created SocketIO to */
    httpServer?: HTTP,
    /** If an existing SocketIO server is not given, the options to pass to the
     *  created SocketIO server */
    options?: SocketIO.ServerOptions,
    /** If an existing SocketIO or HTTP server are not given, the port that the SocketIO
     *  server will listen on */
    port?: number,
    /// Basename for the SocketIO event to handle (default: `molten:`)
    eventBaseName?: string,
    /** Queries that will be listened for, others will be ignored, unless 
     *  `rejectOthers` or rejectOthersWithBaseName` is true
     */
    allowedOperations?: SocketQueryType[] | {
      default: SocketQueryType[]
      [collection: string]: SocketQueryType[]
    },
    /** If true, MoltenWebSocket will listen for other queries and send a 400
     *  error object on receiving one
     */
    rejectOthers?: boolean = false,
    /** If true, MoltenWebSocket will listen for other queries with the given
     *  base name and respond with a 400 error object on receiving one
     */
    rejectOthersWithBaseName?: boolean = false
  };
}
