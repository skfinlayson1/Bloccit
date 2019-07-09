const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

    destroy() {
        return this.user.id == this.record.userId;
    }

};