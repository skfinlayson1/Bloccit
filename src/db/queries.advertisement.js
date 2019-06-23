const Advertisement = require('./models').Advertisement;

module.exports = {

    getAllAdvertisements(callback) {
        return Advertisement.all()
        .then((advert) => {
            callback(null, advert)
        })
        .catch((err) => {
            callback(err);
        })
    },

    createAdvertisement(values, callback) {
        return Advertisement.create({
            title: values.title,
            description: values.description
        })
        .then((advert) => {
            //console.log(advert);
            callback(null, advert);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getAdvertisement(id, callback) {
        return Advertisement.findById(id)
        .then((advertisement) => {
            callback(null, advertisement);
        })
        .catch((err) => {
            callback(err);
        })
    },

    editAdvertisement(id, callback) {
        return Advertisement.findById(id)
        .then((advertisement) => {
            callback(null, advertisement);
        })
        .catch((err) => {
            callback(err);
        });
    },

    updateAdvertisement(id, newValues, callback) {
        return Advertisement.findById(id)
        .then((advert) => {
            if (!advert) {
                callback("Advertisement can't be found");
            };
            advert.update(newValues, {
                fields: Object.keys(newValues)
            })
            .then(() => {
                callback(null, advert);
            })
            .catch((err) => {
                callback(err);
            });
        });
    },

    removeAdvertisement(id, callback) {
        return Advertisement.destroy({where: {id}})
        .then((advert) => {
            callback(null, advert);
        })
        .catch((err) => {
            callback(err);
        });
    }


};