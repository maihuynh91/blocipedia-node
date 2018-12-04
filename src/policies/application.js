const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == 1;
  }

  _isStandard() {
    return this.user && this.user.role == 0;
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
   return true;
  }

  update() {
   return this.new() &&
   this.record && (this._isOwner() || this._isAdmin());
  }

  destroy() {
    return this.update();
  }
}