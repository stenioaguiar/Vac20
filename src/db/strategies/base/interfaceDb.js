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
  disapproveVac(id, cpf, item) {
    throw new NotImplementedException();
  }
  deleteVac(id, cpf) {
    throw new NotImplementedException();
  }
  approveVac(id, cpf) {
    throw new NotImplementedException();
  }
  readBusiness(item) {
    throw new NotImplementedException();
  }
  updateBusiness(cpf, item) {
    throw new NotImplementedException();
  }
  deleteBusiness(cpf) {
    throw new NotImplementedException();
  }
  isConnected(id) {
    throw new NotImplementedException();
  }
  readVisit(item) {
    throw new NotImplementedException();
  }
}

module.exports = IDb;
