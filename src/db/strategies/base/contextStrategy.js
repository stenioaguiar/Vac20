const IDb = require('./interfaceDb');
class ContextStrategy extends IDb {
  constructor(database) {
    super();
    this._database = database;
  }
  isConnected() {
    return this._database.isConnected();
  }
  connect() {
    return this._database.connect()
  }
  create(item) {
    return this._database.create(item);
  }
  readUser(item) {
    return this._database.readUser(item);
  }
  updateUser(cpf, item) {
    return this._database.updateUser(cpf, item);
  }
  deleteUser(cpf) {
    return this._database.deleteUser(cpf);
  }
  readVac(item) {
    return this._database.readVac(item);
  }
  updateVac(id, cpf, item) {
    return this._database.updateVac(id, cpf, item);
  }
  disapproveVac(id, cpf, item) {
    return this._database.approveVac(id, cpf, item);
  }
  deleteVac(id, cpf) {
    return this._database.deleteVac(id, cpf);
  }
  approveVac(id, cpf) {
    return this._database.deleteVac(id, cpf);
  }
  readBusiness(item) {
    return this._database.readBusiness(item);
  }
  updateBusiness(cnpj, item) {
    return this._database.updateBusiness(cnpj, item);
  }
  deleteBusiness(cnpj) {
    return this._database.deleteBusiness(cnpj);
  }
  readVisit(item) {
    return this._database.readVisit(item);
  }
}

module.exports = ContextStrategy;
