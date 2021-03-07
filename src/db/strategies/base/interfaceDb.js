class NotImplementedException extends Error {
  constructor() {
    super('Not Implemented Exception');
  }
}
//interface
class IDb {
  create(item) {
    throw new NotImplementedException();
  }
  readUser(item) {
    throw new NotImplementedException();
  }
  updateUser(cpf, item) {
    throw new NotImplementedException();
  }
  deleteUser(cpf) {
    throw new NotImplementedException();
  }
  readVac(item) {
    throw new NotImplementedException();
  }
  updateVac(id, cpf, item) {
    throw new NotImplementedException();
  }
  deleteVac(id, cpf) {
    throw new NotImplementedException();
  }
  isConnected(id) {
    throw new NotImplementedException();
  }
}

module.exports = IDb;
