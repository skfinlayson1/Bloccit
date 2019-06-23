const advertisementQueries = require("../db/queries.advertisement");

module.exports = {

    index(req, res, next) {
        advertisementQueries.getAllAdvertisements((err, advertisements) => {
            if(err) {
                res.redirect(500, 'static/index');
            } else {
                res.render('advertisement/index', {advertisements});
            }
        })
    },

    new(req, res, next) {
        res.render("advertisement/new");
    },

    create(req, res, next) {
        const values = {title: req.body.title, description: req.body.description};
        console.log(values);

        advertisementQueries.createAdvertisement(values, (err, advertisement) => {
            if (err) {
                res.redirect(500, '/advertisement/new');
            } else {
                res.redirect(303, `/advertisement/${advertisement.id}`);
            };
        });
    },

    show(req, res, next) {
        advertisementQueries.getAdvertisement(req.params.id, (err, advertisement) => {
            if (err || advertisement == null) {
                res.redirect(404, "/advertisement");
            } else {
                res.render("advertisement/show", {advertisement});
            };
        });
    },

    edit(req, res, next) {
        advertisementQueries.editAdvertisement(req.params.id, (err, advertisement) => {
            if (err || advertisement == null) {
                res.redirect(404, "/advertisement");
            } else {
                res.render("advertisement/edit", {advertisement});
            };
        });
    },

    update(req, res, next) {
        advertisementQueries.updateAdvertisement(req.params.id, req.body, (err, advertisement) => {
            if (err) {
                res.redirect(404, "/advertisement");
            } else {
                res.redirect(303, `/advertisement/${advertisement.id}`);
            }
        });
    },

    destroy(req, res, next) {
        advertisementQueries.removeAdvertisement(req.params.id, (err, advertisement) => {
            if (err) {
                res.redirect(500, `/advertisement/${advertisement.id}`);
            } else {
                res.redirect(303, "/advertisement");
            }
        })
    }

}