const flairQueries = require("../db/queries.flairs");

module.exports = {

    new(req, res, next) {
        res.render('flairs/new', {topicId: req.params.topicId})
    },

    create(req, res, next) {
        const options = {
            name: req.body.name,
            color: req.body.color,
            topicId: req.params.topicId
        }

        flairQueries.create(options, (err, flair) => {
            if(err) {
                res.redirect(500, `/topics/${req.params.topicId}/flairs/new`);
            } else {
                res.redirect(303, `/topics/${req.params.topicId}`);
            }
        })
    },

    destroy(req, res, next) {
        flairQueries.destroy(req.params.id, (err, flair) => {
            if(err) {
                res.redirect(500,`/topics/${req.params.topicId}/flairs/${req.params.id}/edit`);
            } else {
                res.redirect(303, `/topics/${req.params.topicId}`);
            }
        })
    },

    edit(req, res, next) {
        flairQueries.show(req.params.id, (err, flair) => {
            if(err || flair == null) {
                res.redirect(404, `/topics/${req.params.topicId}`);
            } else {
                res.render("flairs/edit", {flair});
            }
        })
    },

    update(req, res, next) {
        const values = {
            name:  req.body.name,
            color: req.body.color
        };

        flairQueries.update(values, req.params.id, (err, flair) => {
            if(err) {
                res.redirect(500, `/topics/${req.params.topicId}/flairs/${req.params.id}/edit`);
            } else {
                res.redirect(303, `/topics/${req.params.topicId}`);
            }
        })
    }

}