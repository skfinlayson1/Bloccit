const Topic = require("./models").Topic;
const Flair = require("./models").Flair;

module.exports = {

    show(id, callback) {
        return Flair.findById(id)
        .then((flair) => {
            callback(null, flair);
        })
        .catch((err) => {
            callback(err);
        })
    },

    create(newFlair, callback) {
        return Flair.create(newFlair)
        .then((flair) => {
            callback(null, flair);
        })
        .catch((err) => {
            callback(err);
        })
    },

    destroy(id, callback) {
        return Flair.destroy({where: {id}})
        .then((res) => {
            callback(null, res);
        })
        .catch((err) => {
            callback(err);
        })
    },

    update(updatedFlair, id, callback) {
        return Flair.update(updatedFlair, {where: {id}, fields: Object.keys(updatedFlair)})
        .then((res) => {
            callback(null, res);
        })
        .catch((err) => {
            callback(err);
        })

    }

}