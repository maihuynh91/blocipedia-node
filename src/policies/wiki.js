const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  
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
    return true
  }

  update() {
    return this.new();
  }

  destroy() {
    return this.update();
  }
  
}