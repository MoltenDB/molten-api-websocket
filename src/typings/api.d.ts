namespace MDB {
  type SocketQueryType = string;

  type SocketQueryData {
    id?: MDB.ID,
    type: SocketQueryType,
    filter: any
  }
}
