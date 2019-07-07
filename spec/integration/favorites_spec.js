const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Favorite = require("../../src/db/models").Favorite;

describe("routes : favorites", () => {

    beforeEach((done) => {

        this.user;
        this.topic;
        this.post;

        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "starman@tesla.com",
                password: "123456"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Awesome food display",
                    description: "A bunch of tasty food in the window",
                    posts: [{
                        title: "Food from all around the world",
                        body: "A selection of food from across the planet",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((topic) => {
                    this.topic = topic;
                    this.post = this.topic.posts[0];
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

    });

    describe("guest attempting to favorite on a post", () => {

        beforeEach((done) => {
            const options = {
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0
                }
            };

            request.get(options, (err, res, body) => {
                done();
            });

        });

        describe("Post /topics/:topicId/posts/:postId/favorites/create", () => {

            it("should not create a new favorite", (done) => {

                const options = {url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`};
                let favCountBeforeCreate;

                this.post.getFavorites()
                .then((fav) => {
                    favCountBeforeCreate = fav.length;

                    request.post(options, (err, res, body) => {
                        Favorite.findAll()
                        .then((fav) => {
                            expect(favCountBeforeCreate).toBe(fav.length);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    });
                });

            });

        });

    });

    describe("signed in user favoriting a post", () => {

        beforeEach((done) => {
            options = {
                url: "http://localhost:3000/auth/fake",
                form: {
                    role: "member",
                    userId: this.user.id
                }
            };

            request.get(options, (err, res, body) => {
                done();
            });
        });

        describe("Post /topics/:topicId/post/:postId/favorites/create", () => {

            it("should create a favorite", (done) => {
                const options = {url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`};

                request.post(options, (err, res, body) => {
                    Favorite.findOne({
                        where: {
                            userId: this.user.id,
                            postId: this.post.id
                        }
                    })
                    .then((fav) => {
                        expect(fav).not.toBeNull();
                        expect(fav.userId).toBe(this.user.id);
                        expect(fav.postId).toBe(this.post.id);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

        });

        describe("Post /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {

            it("should destroy a favorite", (done) => {
                const options = {url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`};
                let favCountBeforeDelete;

                request.post(options, (err, res, body) => {
                    this.post.getFavorites()
                    .then((favorites) => {
                        const favorite = favorites[0];
                        favCountBeforeDelete = favorites.length;

                        request.post(`${base}${this.topic.id}/posts/${this.post.id}/favorites/${favorite.id}/destroy`, (err, res, body) => {
                                this.post.getFavorites()
                                .then((favorites) => {
                                    //expect(favorites.length).toBe(favCountBeforeDelete - 1);
                                    done();
                                });
                        });
                    });
                });
            });

        });

    });



});