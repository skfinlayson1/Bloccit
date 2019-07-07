const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;
const Favorite = require("./models").Favorite;
const Authorizer = require("../policies/favorite");

module.exports = {

    createFavorite(req, callback) {
        return Favorite.create({
            postId: req.params.postId,
            userId: req.user.id
        })
        .then((fav) => {
            callback(null, fav);
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteFavorite(req, callback) {
        const id = req.params.id;

        return Favorite.findById(id)
        .then((fav) => {
            if(!fav) {
                return callback("Favorite not found");
            };

            const authorized = new Authorizer(req.user, fav).destroy();

            if(authorized) {
                Favorite.destroy({where: {id}})
                .then((favDelete) => {
                    callback(null, favDelete);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that");
                callback(401);
            };
        })
        .catch((err) => {
            callback(err);
        });
    }

};